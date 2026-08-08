import { NextRequest, NextResponse } from "next/server";
import { generateGuestSessionToken, SupportRateLimitError, SUPPORT_GUEST_COOKIE, supportNetworkKey, takeSupportRateLimit } from "@/lib/server/support";
import { sha256, supabaseRpc } from "@/lib/server/supabase";

export async function POST(request: NextRequest, { params }: { params: Promise<{ accessToken: string }> }) {
  try {
    const { accessToken } = await params;
    const body = await request.json() as { code?: string };
    const code = String(body.code ?? "").replace(/\D/g, "");
    if (code.length !== 6) return NextResponse.json({ error: "Enter the six-digit verification code." }, { status: 400 });
    await Promise.all([
      takeSupportRateLimit({ scope: "support-code-verify-ticket", key: accessToken, windowSeconds: 600, maxRequests: 10, blockSeconds: 1800 }),
      takeSupportRateLimit({ scope: "support-code-verify-network", key: supportNetworkKey(request), windowSeconds: 600, maxRequests: 30, blockSeconds: 1800 }),
    ]);
    const sessionToken = generateGuestSessionToken();
    const result = await supabaseRpc<Record<string, unknown>>("support_verify_guest_code_v2", {
      p_access_token_hash: sha256(accessToken),
      p_code_hash: sha256(code),
      p_session_token_hash: sha256(sessionToken),
      p_user_agent_hash: sha256(request.headers.get("user-agent") ?? "unknown"),
      p_ip_hash: sha256(request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"),
    });
    const response = NextResponse.json({ ok: true, ticketReference: result.ticketReference }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(SUPPORT_GUEST_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 14 * 24 * 60 * 60,
    });
    return response;
  } catch (error) {
    if (error instanceof SupportRateLimitError) {
      return NextResponse.json({ error: error.message, retryAfterSeconds: error.retryAfterSeconds }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    }
    const message = error instanceof Error ? error.message : "The verification code could not be checked.";
    const status = /incorrect|expired|attempt|invalid/i.test(message) ? 400 : 503;
    return NextResponse.json({ error: message }, { status });
  }
}
