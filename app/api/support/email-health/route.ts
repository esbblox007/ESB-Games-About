import { NextResponse } from "next/server";
import { inspectResendConfiguration } from "@/lib/server/email";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await inspectResendConfiguration();
  const ready = result.state === "verified" || result.state === "send_only";

  if (result.state === "send_only") {
    console.warn("Support email domain inspection skipped for restricted send-only credentials", {
      configured: result.configured,
      senderDomain: result.senderDomain,
    });
  } else if (!ready) {
    console.error("Support email readiness check failed", {
      state: result.state,
      configured: result.configured,
      senderDomain: result.senderDomain,
      domainVerified: result.domainVerified,
      detail: result.detail,
    });
  }

  return NextResponse.json({
    available: ready,
    state: ready ? (result.state === "send_only" ? "configured" : "available") : "unavailable",
    guidance: ready ? "Support email delivery is configured." : "Support email delivery is temporarily unavailable.",
  }, {
    status: ready ? 200 : 503,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
