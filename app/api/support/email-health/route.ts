import { NextResponse } from "next/server";
import { inspectResendConfiguration } from "@/lib/server/email";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await inspectResendConfiguration();
  const ready = result.state === "verified";
  return NextResponse.json({
    available: ready,
    state: result.state,
    configured: result.configured,
    senderDomain: result.senderDomain,
    domainVerified: result.domainVerified,
    guidance: ready
      ? "Support verification email delivery is ready."
      : result.state === "not_configured"
        ? "Add RESEND_API_KEY to the About website Production environment and redeploy."
        : result.state === "invalid_sender"
          ? "Set SUPPORT_FROM_EMAIL to a valid sender on a verified Resend domain."
          : result.state === "unverified"
            ? "Verify the configured sender domain in Resend, then redeploy if the sender variable changes."
            : "The Resend account could not be checked. Review the Vercel function logs and Resend account.",
  }, {
    status: ready ? 200 : 503,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
