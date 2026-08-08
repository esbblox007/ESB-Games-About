import { NextRequest, NextResponse } from "next/server";
import { authoriseTicketRequest, getAttachmentUrl, type SupportAttachmentRow } from "@/lib/server/support";
import { supabaseInsert, supabaseSelect } from "@/lib/server/supabase";

export async function GET(request: NextRequest, { params }: { params: Promise<{ accessToken: string; attachmentId: string }> }) {
  try {
    const { accessToken, attachmentId } = await params;
    const access = await authoriseTicketRequest(request, accessToken);
    if (!access) return NextResponse.json({ error: "This resource is unavailable." }, { status: 404, headers: { "Cache-Control": "no-store" } });
    const rows = await supabaseSelect<SupportAttachmentRow>("support_ticket_attachments", `select=*&id=eq.${encodeURIComponent(attachmentId)}&ticket_id=eq.${encodeURIComponent(access.ticket.id)}&customer_visible=eq.true&archived_at=is.null&limit=1`);
    const attachment = rows[0];
    if (!attachment || !attachment.message_id) return NextResponse.json({ error: "This resource is unavailable." }, { status: 404 });
    // A customer-visible attachment must belong to an actual public message; this
    // prevents a guessed attachment id from exposing staff/internal evidence.
    const publicMessage = await supabaseSelect<{ id: string }>("support_ticket_messages", `select=id&id=eq.${encodeURIComponent(attachment.message_id)}&ticket_id=eq.${encodeURIComponent(access.ticket.id)}&deleted_at=is.null&limit=1`);
    if (!publicMessage[0]) return NextResponse.json({ error: "This resource is unavailable." }, { status: 404 });
    const validation = attachment.validation_state ?? attachment.scan_state;
    if (validation !== "Available" && attachment.scan_state !== "Clean") return NextResponse.json({ error: "This attachment is still being processed or is unavailable." }, { status: 423 });
    if (["Quarantined", "Failed", "Rejected"].includes(attachment.scan_state)) return NextResponse.json({ error: "This attachment is unavailable." }, { status: 423 });
    if (attachment.safety_sensitive) await supabaseInsert("support_ticket_events", { ticket_id: access.ticket.id, event_type: "customer_sensitive_attachment_accessed", actor_type: "Customer", actor_id: null, metadata: { attachmentId: attachment.id } }).catch(() => []);
    const url = await getAttachmentUrl(attachment);
    return NextResponse.redirect(url, 302);
  } catch (error) {
    console.error("[support-customer-attachment]", error);
    return NextResponse.json({ error: "The attachment could not be opened." }, { status: 503 });
  }
}
