import { NextResponse } from "next/server";
import { getSupabaseServerConfig, supabaseSelect } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!getSupabaseServerConfig()) {
    return NextResponse.json(
      { available: false, message: "Online ticket creation is temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    await supabaseSelect<{ category_id: string }>("support_categories", "select=category_id&active=eq.true&limit=1");
    return NextResponse.json({ available: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(
      { available: false, message: "Online ticket creation is temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
