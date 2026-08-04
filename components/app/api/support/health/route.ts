import { NextResponse } from "next/server";
import { getSupabaseServerConfig, supabaseRpc } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Preflight = {
  ready?: boolean;
  categoryCount?: number;
  evidenceBucketReady?: boolean;
  pipelineVersion?: number;
};

export async function GET() {
  const config = getSupabaseServerConfig();
  if (!config) {
    return NextResponse.json(
      { available: false, state: "configuration_missing" },
      { status: 503, headers: noStoreHeaders() },
    );
  }

  try {
    const raw = await supabaseRpc<unknown>("support_submission_preflight_v3", {});
    const result = normalisePreflight(raw);
    if (result.ready !== true) {
      return NextResponse.json(
        { available: false, state: "database_unavailable" },
        { status: 503, headers: noStoreHeaders() },
      );
    }

    return NextResponse.json(
      { available: true, state: "ready", pipelineVersion: result.pipelineVersion ?? 3 },
      { headers: noStoreHeaders() },
    );
  } catch (error) {
    console.error("[support-health] Support submission preflight failed", error);
    return NextResponse.json(
      { available: false, state: "database_unavailable" },
      { status: 503, headers: noStoreHeaders() },
    );
  }
}

function normalisePreflight(value: unknown): Preflight {
  let result = value;
  if (Array.isArray(result)) result = result[0];
  if (typeof result === "string") {
    try { result = JSON.parse(result); } catch { return {}; }
  }
  return result && typeof result === "object" && !Array.isArray(result)
    ? result as Preflight
    : {};
}

function noStoreHeaders() {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    Pragma: "no-cache",
    Expires: "0",
  };
}
