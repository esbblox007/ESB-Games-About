import { NextRequest, NextResponse } from "next/server";
import { addPublicTicketMessage, authoriseTicketRequest, getTicketConversation, SupportRateLimitError, supportNetworkKey, takeSupportRateLimit } from "@/lib/server/support";
import { createSignedObjectUrl, supabaseRpc, supabaseSelect } from "@/lib/server/supabase";

type StaffProfileRow = {
  staff_account_id: string;
  display_name: string;
  public_title: string;
  bio: string;
  avatar_path: string | null;
  enabled: boolean;
};

type StaffAccountRow = {
  id: string;
  staff_name: string;
  position_title: string | null;
};

type StaffSettingsRow = { avatar_path: string | null };
type MessageWithStaff = { sender_type: string; sender_staff_id?: string | null; sender_name: string };

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function loadPublicStaffProfiles(messages: MessageWithStaff[]) {
  const ids = [...new Set(messages
    .filter((message) => message.sender_type === "Staff")
    .map((message) => String(message.sender_staff_id ?? "").trim())
    .filter((id) => isUuid(id))
  )];

  const pairs = await Promise.all(ids.map(async (id) => {
    const [profileRows, accountRows, settingsRows] = await Promise.all([
      supabaseSelect<StaffProfileRow>("backend_staff_support_profiles", `select=staff_account_id,display_name,public_title,bio,avatar_path,enabled&staff_account_id=eq.${encodeURIComponent(id)}&limit=1`).catch(() => []),
      supabaseSelect<StaffAccountRow>("backend_staff_accounts", `select=id,staff_name,position_title&id=eq.${encodeURIComponent(id)}&archived_at=is.null&limit=1`).catch(() => []),
      supabaseSelect<StaffSettingsRow>("backend_staff_profile_settings", `select=avatar_path&staff_account_id=eq.${encodeURIComponent(id)}&limit=1`).catch(() => []),
    ]);
    const profile = profileRows[0];
    const account = accountRows[0];
    if (profile && profile.enabled === false) return null;
    if (!profile && !account) return null;

    const avatarPath = profile?.avatar_path ?? settingsRows[0]?.avatar_path ?? null;
    const avatarUrl = avatarPath
      ? await createSignedObjectUrl("backend-staff-avatars", avatarPath, 60 * 60 * 24).catch(() => null)
      : null;

    return [id, {
      displayName: profile?.display_name?.trim() || account?.staff_name?.trim() || "ESB Games Support",
      publicTitle: profile?.public_title?.trim() || account?.position_title?.trim() || "ESB Games Support",
      bio: profile?.bio?.trim() || "Helping players, creators and families across ESB Games.",
      avatarUrl,
      verified: true,
    }] as const;
  }));

  return Object.fromEntries(pairs.filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)));
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ accessToken: string }> }) {
  try {
    const { accessToken } = await params;
    const access = await authoriseTicketRequest(request, accessToken);
    if (!access) return NextResponse.json({ error: "Verify your email or sign in to view this ticket.", verificationRequired: true }, { status: 401 });
    const conversation = await getTicketConversation(access.ticket.id);
    await supabaseRpc("support_touch_ticket_view_v1", { p_ticket_id: access.ticket.id }).catch(() => null);
    const staffProfiles = await loadPublicStaffProfiles(conversation.messages as unknown as MessageWithStaff[]);
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
      staffProfiles,
      messages: conversation.messages.map((message) => {
        const linked = message as typeof message & { sender_staff_id?: string | null };
        return {
          id: message.id,
          senderType: message.sender_type,
          senderName: message.sender_name,
          senderStaffId: linked.sender_staff_id ?? null,
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
        };
      }),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[support-ticket] Ticket load failed", error);
    return NextResponse.json({ error: "This ticket could not be loaded right now. Please try again shortly." }, { status: 503 });
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
    console.error("[support-ticket] Customer reply failed", error);
    return NextResponse.json({ error: "Your message could not be sent right now. Please try again shortly." }, { status: 503 });
  }
}
