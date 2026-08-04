import { NextResponse } from "next/server";
import { getSupabaseServerConfig, supabaseSelect } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const config = getSupabaseServerConfig();
  if (!config) {
    return NextResponse.json(
      { available: false, state: "configuration_missing" },
      { status: 503, headers: noStoreHeaders() },
    );
  }

  try {
    await supabaseSelect<{ category_id: string }>("support_categories", "select=category_id&limit=1");
    return NextResponse.json(
      { available: true, state: "ready" },
      { headers: noStoreHeaders() },
    );
  } catch (error) {
    console.error("[support-health] Supabase readiness check failed", error);
    return NextResponse.json(
      { available: false, state: "database_unavailable" },
      { status: 503, headers: noStoreHeaders() },
    );
  }
}

function noStoreHeaders() {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    Pragma: "no-cache",
    Expires: "0",
  };
}
