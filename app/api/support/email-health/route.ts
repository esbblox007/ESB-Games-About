import { NextResponse } from "next/server";
import { inspectResendConfiguration } from "@/lib/server/email";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await inspectResendConfiguration();
  const ready = result.state === "verified";
  if (!ready) {
    console.error("Support email readiness check failed", {
      state: result.state,
      configured: result.configured,
      senderDomain: result.senderDomain,
      domainVerified: result.domainVerified,
    });
  }
  return NextResponse.json({
    available: ready,
    state: ready ? "available" : "unavailable",
    guidance: ready ? "Support email delivery is ready." : "Support email delivery is temporarily unavailable.",
  }, {
    status: ready ? 200 : 503,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
