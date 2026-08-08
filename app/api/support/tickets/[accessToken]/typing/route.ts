import { NextRequest, NextResponse } from "next/server";
import { authoriseTicketRequest, setCustomerTyping } from "@/lib/server/support";

export async function POST(request: NextRequest, { params }: { params: Promise<{ accessToken: string }> }) {
  try {
    const { accessToken } = await params;
    const access = await authoriseTicketRequest(request, accessToken);
    if (!access) return NextResponse.json({ error: "This resource is unavailable." }, { status: 404 });
    const body = await request.json().catch(() => ({})) as { typing?: boolean };
    await setCustomerTyping(access.ticket.id, access.actorId, access.actorName, Boolean(body.typing));
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Presence could not be updated." }, { status: 503 });
  }
}
