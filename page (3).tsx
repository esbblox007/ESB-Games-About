import { NextResponse } from "next/server";
import { hasSupabase, supabaseSelectOne } from "@/lib/integrations";

export async function GET(_request: Request, context: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = await context.params;
  const id = ticketId.trim().toUpperCase();
  if (!/^ESB-[A-Z0-9]{6}$/.test(id)) return NextResponse.json({ error: "Enter a valid ticket reference." }, { status: 400 });
  if (!hasSupabase) return NextResponse.json({ error: "This ticket is not stored in this browser, and Supabase tracking is not configured." }, { status: 404 });
  try {
    const row = await supabaseSelectOne("support_tickets", "ticket_id", id);
    if (!row) return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
    return NextResponse.json({ ticket: { id: row.ticket_id, status: row.status, subject: row.subject, createdAt: row.created_at } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to retrieve this ticket." }, { status: 500 });
  }
}
