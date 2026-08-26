import { NextRequest, NextResponse } from "next/server";
import {
  addPublicTicketMessage,
  getAttachmentUrl,
  getTicketConversation,
  SUPPORT_GUEST_COOKIE,
  SupportRateLimitError,
  supportNetworkKey,
  takeSupportRateLimit,
  type SupportTicketRow,
} from "@/lib/server/support";
import { sha256, supabaseSelect, supabaseUpdate } from "@/lib/server/supabase";

type GuestSessionRow = {
  ticket_id: string;
  expires_at: string;
  revoked_at: string | null;
};

type GuestTicket = Pick<SupportTicketRow,
  "id" | "ticket_reference" | "requester_account_id" | "requester_name" | "requester_email" |
  "requester_email_verified" | "subject" | "category_id" | "team" | "status" | "priority" |
  "created_at" | "updated_at" | "last_message_at"
>;

function mapTicket(ticket: GuestTicket) {
  return {
    id: ticket.id,
    reference: ticket.ticket_reference,
    subject: ticket.subject,
    categoryId: ticket.category_id,
    team: ticket.team,
    status: ticket.status,
    priority: ticket.priority,
    createdAt: ticket.created_at,
    updatedAt: ticket.updated_at,
    lastMessageAt: ticket.last_message_at || ticket.updated_at,
  };
}

async function verifiedGuestContext(request: NextRequest) {
  const token = request.cookies.get(SUPPORT_GUEST_COOKIE)?.value?.trim();
  if (!token) return null;
  const tokenHash = sha256(token);
  const sessions = await supabaseSelect<GuestSessionRow>(
    "support_ticket_guest_sessions",
    `select=ticket_id,expires_at,revoked_at&session_token_hash=eq.${encodeURIComponent(tokenHash)}&limit=1`,
  );
  const session = sessions[0];
  if (!session || session.revoked_at || new Date(session.expires_at).getTime() <= Date.now()) return null;

  const sourceRows = await supabaseSelect<GuestTicket>(
    "support_tickets",
    `select=id,ticket_reference,requester_account_id,requester_name,requester_email,requester_email_verified,subject,category_id,team,status,priority,created_at,updated_at,last_message_at&id=eq.${encodeURIComponent(session.ticket_id)}&limit=1`,
  );
  const source = sourceRows[0];
  const email = source?.requester_email?.trim().toLowerCase() ?? "";
  if (!source || source.requester_account_id || !email) return null;

  await supabaseUpdate(
    "support_ticket_guest_sessions",
    `session_token_hash=eq.${encodeURIComponent(tokenHash)}`,
    { last_seen_at: new Date().toISOString() },
  ).catch(() => []);

  return { email, source };
}

async function guestTicketById(email: string, ticketId: string) {
  const rows = await supabaseSelect<GuestTicket>(
    "support_tickets",
    `select=id,ticket_reference,requester_account_id,requester_name,requester_email,requester_email_verified,subject,category_id,team,status,priority,created_at,updated_at,last_message_at&id=eq.${encodeURIComponent(ticketId)}&requester_account_id=is.null&requester_email=eq.${encodeURIComponent(email)}&limit=1`,
  );
  return rows[0] ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const context = await verifiedGuestContext(request);
    if (!context) return NextResponse.json({ ok: false, code: "guest_verification_required", message: "Verify your email to view guest support tickets." }, { status: 401, headers: { "Cache-Control": "no-store" } });

    const ticketId = request.nextUrl.searchParams.get("ticketId")?.trim() ?? "";
    if (ticketId) {
      const ticket = await guestTicketById(context.email, ticketId);
      if (!ticket) return NextResponse.json({ ok: false, code: "ticket_not_found", message: "This guest ticket is not available in the verified inbox." }, { status: 404 });
      const conversation = await getTicketConversation(ticket.id);
      const messages = await Promise.all(conversation.messages.map(async (message) => ({
        id: message.id,
        senderType: message.sender_type,
        senderName: message.sender_name,
        body: message.body,
        createdAt: message.created_at,
        editedAt: message.edited_at ?? null,
        attachments: await Promise.all(conversation.attachments
          .filter((attachment) => attachment.message_id === message.id)
          .map(async (attachment) => ({
            id: attachment.id,
            name: attachment.original_file_name,
            type: attachment.mime_type,
            size: attachment.size_bytes,
            scanState: attachment.scan_state,
            validationState: attachment.validation_state ?? attachment.scan_state,
            moderationState: attachment.moderation_state,
            sensitive: attachment.safety_sensitive,
            href: await getAttachmentUrl(attachment).catch(() => null),
          }))),
      })));
      return NextResponse.json({ ok: true, data: { ticket: mapTicket(ticket), messages } }, { headers: { "Cache-Control": "no-store" } });
    }

    const tickets = await supabaseSelect<GuestTicket>(
      "support_tickets",
      `select=id,ticket_reference,requester_account_id,requester_name,requester_email,requester_email_verified,subject,category_id,team,status,priority,created_at,updated_at,last_message_at&requester_account_id=is.null&requester_email=eq.${encodeURIComponent(context.email)}&order=updated_at.desc&limit=100`,
    );
    return NextResponse.json({
      ok: true,
      data: { tickets: tickets.map(mapTicket), generatedAt: new Date().toISOString(), accessMode: "verified-email" },
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[support-guest-inbox] Unable to load verified guest tickets", error);
    return NextResponse.json({ ok: false, code: "guest_tickets_unavailable", message: "Your guest support tickets are temporarily unavailable." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await verifiedGuestContext(request);
    if (!context) return NextResponse.json({ ok: false, code: "guest_verification_required", message: "Verify your email before replying." }, { status: 401 });

    const form = await request.formData();
    const ticketId = String(form.get("ticketId") ?? "").trim();
    const body = String(form.get("body") ?? "").trim();
    const clientMessageId = String(form.get("clientMessageId") ?? "").trim();
    const files = form.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
    if (!ticketId) return NextResponse.json({ ok: false, message: "Choose a ticket before replying." }, { status: 400 });
    if (!body && files.length === 0) return NextResponse.json({ ok: false, message: "Write a message or attach evidence before sending." }, { status: 400 });
    if (body.length > 20000) return NextResponse.json({ ok: false, message: "Messages must be 20,000 characters or fewer." }, { status: 400 });

    const ticket = await guestTicketById(context.email, ticketId);
    if (!ticket) return NextResponse.json({ ok: false, code: "ticket_not_found", message: "This guest ticket is not available in the verified inbox." }, { status: 404 });
    if (["Closed", "Resolved", "Spam"].includes(ticket.status)) return NextResponse.json({ ok: false, code: "ticket_closed", message: "This ticket cannot receive new messages." }, { status: 409 });

    await Promise.all([
      takeSupportRateLimit({ scope: "support-guest-inbox-message-ticket", key: ticket.id, windowSeconds: 3600, maxRequests: 60, blockSeconds: 900 }),
      takeSupportRateLimit({ scope: "support-guest-inbox-message-network", key: supportNetworkKey(request), windowSeconds: 3600, maxRequests: 120, blockSeconds: 900 }),
    ]);

    const result = await addPublicTicketMessage({
      ticket: ticket as SupportTicketRow,
      actorType: "Guest",
      actorId: context.email,
      actorName: ticket.requester_name,
      body: body || "Attachment added",
      files,
      clientMessageId,
    });
    return NextResponse.json({ ok: true, messageId: result.message.id, attachmentError: result.attachmentError ?? null }, { status: 201 });
  } catch (error) {
    if (error instanceof SupportRateLimitError) {
      return NextResponse.json({ ok: false, message: error.message, retryAfterSeconds: error.retryAfterSeconds }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    }
    console.error("[support-guest-inbox] Unable to send guest reply", error);
    return NextResponse.json({ ok: false, message: "Your reply could not be sent right now." }, { status: 503 });
  }
}
