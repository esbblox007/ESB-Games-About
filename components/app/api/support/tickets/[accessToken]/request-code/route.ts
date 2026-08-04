import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/server/email";
import { generateVerificationCode, getTicketByAccessToken, SupportRateLimitError, supportNetworkKey, takeSupportRateLimit } from "@/lib/server/support";
import { sha256, supabaseInsert, supabaseSelect, supabaseUpdate } from "@/lib/server/supabase";

export async function POST(request: NextRequest, { params }: { params: Promise<{ accessToken: string }> }) {
  try {
    const { accessToken } = await params;
    const ticket = await getTicketByAccessToken(accessToken);
    if (!ticket || !ticket.requester_email) return NextResponse.json({ error: "This private ticket link is invalid or cannot receive email verification." }, { status: 404 });
    await Promise.all([
      takeSupportRateLimit({ scope: "support-code-request-ticket", key: ticket.id, windowSeconds: 3600, maxRequests: 6, blockSeconds: 3600 }),
      takeSupportRateLimit({ scope: "support-code-request-network", key: supportNetworkKey(request), windowSeconds: 3600, maxRequests: 20, blockSeconds: 1800 }),
    ]);
    const recent = await supabaseSelect<{ sent_at: string }>("support_ticket_verification_codes", `select=sent_at&ticket_id=eq.${encodeURIComponent(ticket.id)}&revoked_at=is.null&order=sent_at.desc&limit=1`);
    if (recent[0] && Date.now() - new Date(recent[0].sent_at).getTime() < 60_000) {
      return NextResponse.json({ error: "Please wait one minute before requesting another code." }, { status: 429 });
    }
    await supabaseUpdate("support_ticket_verification_codes", `ticket_id=eq.${encodeURIComponent(ticket.id)}&consumed_at=is.null&revoked_at=is.null`, { revoked_at: new Date().toISOString() }).catch(() => []);
    const code = generateVerificationCode();
    const codeRows = await supabaseInsert<{ id: string }>("support_ticket_verification_codes", {
      ticket_id: ticket.id,
      code_hash: sha256(code),
      requested_email: ticket.requester_email,
      attempts: 0,
      max_attempts: 5,
      expires_at: new Date(Date.now() + 3 * 60_000).toISOString(),
    });
    const delivery = await sendEmail({
      from: process.env.SUPPORT_FROM_EMAIL ?? "ESB Games Support <support@esbgames.com>",
      to: ticket.requester_email,
      replyTo: process.env.SUPPORT_REPLY_TO_EMAIL ?? "support@esbgames.com",
      subject: `${code} is your ESB Games support verification code`,
      text: `Your verification code is ${code}. It expires in three minutes. Do not share it with anyone.`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#11182b"><h1>Verify your support ticket</h1><p>Enter this code on the ESB Games Support page:</p><p style="font-size:34px;font-weight:800;letter-spacing:8px">${code}</p><p>This code expires in three minutes and can only be used once.</p></div>`,
    });
    if (!delivery.sent) {
      if (codeRows[0]?.id) await supabaseUpdate("support_ticket_verification_codes", `id=eq.${encodeURIComponent(codeRows[0].id)}`, { revoked_at: new Date().toISOString() }).catch(() => []);
      return NextResponse.json({ error: "The verification email could not be sent. Please try again shortly." }, { status: 503 });
    }
    return NextResponse.json({ ok: true, expiresInSeconds: 180, maskedEmail: maskEmail(ticket.requester_email) });
  } catch (error) {
    if (error instanceof SupportRateLimitError) {
      return NextResponse.json({ error: error.message, retryAfterSeconds: error.retryAfterSeconds }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "The verification code could not be sent." }, { status: 503 });
  }
}

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  return `${name.slice(0, 2)}${"•".repeat(Math.max(2, name.length - 2))}@${domain}`;
}
