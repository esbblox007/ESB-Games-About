import { NextRequest, NextResponse } from "next/server";
import { addPublicTicketMessage, authoriseTicketRequest, getTicketConversation, SupportRateLimitError, supportNetworkKey, takeSupportRateLimit } from "@/lib/server/support";
import { supabaseRpc } from "@/lib/server/supabase";

export async function GET(request: NextRequest, { params }: { params: Promise<{ accessToken: string }> }) {
  try {
    const { accessToken } = await params;
    const access = await authoriseTicketRequest(request, accessToken);
    if (!access) return NextResponse.json({ error: "Verify your email or sign in to view this ticket.", verificationRequired: true }, { status: 401 });
    const conversation = await getTicketConversation(access.ticket.id);
    await supabaseRpc("support_touch_ticket_view_v1", { p_ticket_id: access.ticket.id }).catch(() => null);
    return NextResponse.json({
      ticket: {
        reference: access.ticket.ticket_reference,
        subject: access.ticket.subject,
        categoryId: access.ticket.category_id,
        status: access.ticket.status,
        createdAt: access.ticket.created_at,
        updatedAt: access.ticket.updated_at,
      },
      typing: conversation.typing,
      messages: conversation.messages.map((message) => ({
        id: message.id,
        senderType: message.sender_type,
        senderName: message.sender_name,
        body: message.body,
        createdAt: message.created_at,
        editedAt: message.edited_at,
        attachments: conversation.attachments.filter((attachment) => attachment.message_id === message.id).map((attachment) => ({
          id: attachment.id,
          name: attachment.original_file_name,
          type: attachment.mime_type,
          size: attachment.size_bytes,
          scanState: attachment.scan_state,
          moderationState: attachment.moderation_state,
          sensitive: attachment.safety_sensitive,
          validationState: attachment.validation_state ?? attachment.scan_state,
          href: `/api/support/tickets/${encodeURIComponent(accessToken)}/attachments/${encodeURIComponent(attachment.id)}`,
        })),
      })),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "The ticket could not be loaded." }, { status: 503 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ accessToken: string }> }) {
  try {
    const { accessToken } = await params;
    const access = await authoriseTicketRequest(request, accessToken);
    if (!access) return NextResponse.json({ error: "Verify your email or sign in before replying." }, { status: 401 });
    if (["Closed", "Spam"].includes(access.ticket.status)) return NextResponse.json({ error: "This ticket cannot receive new messages." }, { status: 409 });
    const form = await request.formData();
    const body = String(form.get("body") ?? "").trim();
    const files = form.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
    if (!body && files.length === 0) return NextResponse.json({ error: "Write a message or attach evidence before sending." }, { status: 400 });
    if (body.length > 20000) return NextResponse.json({ error: "Messages must be 20,000 characters or fewer." }, { status: 400 });
    await Promise.all([
      takeSupportRateLimit({ scope: "support-message-ticket", key: access.ticket.id, windowSeconds: 3600, maxRequests: 60, blockSeconds: 900 }),
      takeSupportRateLimit({ scope: "support-message-network", key: supportNetworkKey(request), windowSeconds: 3600, maxRequests: 120, blockSeconds: 900 }),
    ]);
    const clientMessageId = String(form.get("clientMessageId") ?? "").trim();
    const result = await addPublicTicketMessage({ ticket: access.ticket, actorType: access.actorType, actorId: access.actorId, actorName: access.actorName, body: body || "Attachment added", files, clientMessageId });
    return NextResponse.json({ ok: true, messageId: result.message.id, attachmentError: "attachmentError" in result ? result.attachmentError : null }, { status: 201 });
  } catch (error) {
    if (error instanceof SupportRateLimitError) {
      return NextResponse.json({ error: error.message, retryAfterSeconds: error.retryAfterSeconds }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "The message could not be sent." }, { status: 503 });
  }
}
