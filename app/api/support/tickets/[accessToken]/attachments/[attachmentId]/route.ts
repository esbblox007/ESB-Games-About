import { NextRequest, NextResponse } from "next/server";
import { authoriseTicketRequest, getAttachmentUrl, type SupportAttachmentRow } from "@/lib/server/support";
import { supabaseSelect } from "@/lib/server/supabase";

export async function GET(request: NextRequest, { params }: { params: Promise<{ accessToken: string; attachmentId: string }> }) {
  try {
    const { accessToken, attachmentId } = await params;
    const access = await authoriseTicketRequest(request, accessToken);
    if (!access) return NextResponse.json({ error: "Permission denied." }, { status: 401 });
    const rows = await supabaseSelect<SupportAttachmentRow>("support_ticket_attachments", `select=*&id=eq.${encodeURIComponent(attachmentId)}&ticket_id=eq.${encodeURIComponent(access.ticket.id)}&archived_at=is.null&limit=1`);
    if (!rows[0]) return NextResponse.json({ error: "Attachment not found." }, { status: 404 });
    if (["Quarantined", "Failed"].includes(rows[0].scan_state)) return NextResponse.json({ error: "This attachment is unavailable following its security scan." }, { status: 423 });
    const url = await getAttachmentUrl(rows[0]);
    return NextResponse.redirect(url, 302);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "The attachment could not be opened." }, { status: 503 });
  }
}
