import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { extractEmailAddress, sendEmail, supportReplyTo, supportSender } from "@/lib/server/email";
import { generateVerificationCode, getTicketByAccessToken, SupportRateLimitError, supportNetworkKey, takeSupportRateLimit } from "@/lib/server/support";
import { sha256, supabaseInsert, supabaseSelect, supabaseUpdate } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: { params: Promise<{ accessToken: string }> }) {
  try {
    const { accessToken } = await params;
    const ticket = await getTicketByAccessToken(accessToken);
    if (!ticket || !ticket.requester_email) {
      return NextResponse.json({ error: "This private ticket link is invalid or cannot receive email verification." }, { status: 404 });
    }

    await Promise.all([
      takeSupportRateLimit({ scope: "support-code-request-ticket", key: ticket.id, windowSeconds: 3600, maxRequests: 6, blockSeconds: 3600 }),
      takeSupportRateLimit({ scope: "support-code-request-network", key: supportNetworkKey(request), windowSeconds: 3600, maxRequests: 20, blockSeconds: 1800 }),
    ]);

    const recent = await supabaseSelect<{ sent_at: string }>(
      "support_ticket_verification_codes",
      `select=sent_at&ticket_id=eq.${encodeURIComponent(ticket.id)}&revoked_at=is.null&order=sent_at.desc&limit=1`,
    );
    if (recent[0] && Date.now() - new Date(recent[0].sent_at).getTime() < 60_000) {
      return NextResponse.json({ error: "Please wait one minute before requesting another code." }, { status: 429 });
    }

    await supabaseUpdate(
      "support_ticket_verification_codes",
      `ticket_id=eq.${encodeURIComponent(ticket.id)}&consumed_at=is.null&revoked_at=is.null`,
      { revoked_at: new Date().toISOString() },
    ).catch(() => []);

    const code = generateVerificationCode();
    const codeRows = await supabaseInsert<{ id: string }>("support_ticket_verification_codes", {
      ticket_id: ticket.id,
      code_hash: sha256(code),
      requested_email: ticket.requester_email,
      attempts: 0,
      max_attempts: 5,
      expires_at: new Date(Date.now() + 3 * 60_000).toISOString(),
    });
    const verificationCodeId = codeRows[0]?.id;
    if (!verificationCodeId) throw new Error("The verification request could not be recorded.");

    const from = supportSender();
    const replyTo = supportReplyTo();
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin).replace(/\/$/, "");
    const privateUrl = `${siteUrl}/support/ticket/${encodeURIComponent(accessToken)}`;
    const delivery = await sendEmail({
      from,
      to: ticket.requester_email,
      replyTo,
      subject: `${code} · Your ESB Games support ticket ${ticket.ticket_reference}`,
      text: [
        "ESB Games Support",
        "",
        `Your support ticket ${ticket.ticket_reference} has been created.`,
        `Open your private ticket: ${privateUrl}`,
        "",
        `Your one-time verification code is ${code}.`,
        "It expires in three minutes and can only be used once.",
        "",
        "Never share the private link or verification code with anyone, including ESB Games staff.",
        "If you did not create this request, contact support@esbgames.com.",
      ].join("\n"),
      html: verificationEmailHtml({ code, ticketReference: ticket.ticket_reference, privateUrl }),
    });

    await supabaseInsert("support_email_delivery_events", {
      ticket_id: ticket.id,
      verification_code_id: verificationCodeId,
      provider: "Resend",
      purpose: "Guest Ticket Verification",
      recipient_email: ticket.requester_email,
      sender_email: extractEmailAddress(from) || from,
      provider_message_id: delivery.id ?? null,
      delivery_state: delivery.sent ? "Sent" : "Failed",
      error_code: delivery.errorCode ?? null,
      error_message: delivery.error?.slice(0, 1000) ?? null,
      request_reference: delivery.requestReference,
    }).catch((auditError) => {
      console.error("[support-email-audit]", delivery.requestReference, auditError);
      return [];
    });

    if (!delivery.sent) {
      await supabaseUpdate(
        "support_ticket_verification_codes",
        `id=eq.${encodeURIComponent(verificationCodeId)}`,
        { revoked_at: new Date().toISOString() },
      ).catch(() => []);
      console.error("[support-verification-email]", {
        reference: delivery.requestReference,
        ticketReference: ticket.ticket_reference,
        configured: delivery.configured,
        statusCode: delivery.statusCode,
        errorCode: delivery.errorCode,
        error: delivery.error,
      });
      return NextResponse.json({
        error: `We could not send the verification email. Please try again shortly. Reference: ${delivery.requestReference}.`,
        reference: delivery.requestReference,
      }, { status: 503, headers: { "Cache-Control": "no-store" } });
    }

    return NextResponse.json({
      ok: true,
      expiresInSeconds: 180,
      maskedEmail: maskEmail(ticket.requester_email),
      deliveryReference: delivery.requestReference,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SupportRateLimitError) {
      return NextResponse.json(
        { error: error.message, retryAfterSeconds: error.retryAfterSeconds },
        { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds), "Cache-Control": "no-store" } },
      );
    }
    const reference = `ESB-EMAIL-${randomUUID().slice(0, 8).toUpperCase()}`;
    console.error("[support-verification-route]", reference, error);
    return NextResponse.json({
      error: `The verification service could not complete this request. Please try again shortly. Reference: ${reference}.`,
      reference,
    }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}

function maskEmail(email: string) {
  const [name = "", domain = ""] = email.split("@");
  return `${name.slice(0, 2)}${"•".repeat(Math.max(2, name.length - 2))}@${domain}`;
}

function verificationEmailHtml(input: { code: string; ticketReference: string; privateUrl: string }) {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#050711;color:#f7f8ff;font-family:Inter,Segoe UI,Arial,sans-serif">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#050711;padding:38px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;border:1px solid #263252;border-radius:20px;overflow:hidden;background:#0a1020">
        <tr><td style="padding:22px 30px;border-bottom:1px solid #222d49;background:linear-gradient(135deg,#151135,#071c2d)">
          <div style="font-size:12px;letter-spacing:.18em;font-weight:800;color:#b99aff">ESB GAMES SUPPORT</div>
          <div style="margin-top:8px;font-size:13px;color:#8ea0c2">Private ticket access · ${escapeHtml(input.ticketReference)}</div>
        </td></tr>
        <tr><td style="padding:38px 30px">
          <h1 style="margin:0 0 14px;font-size:30px;line-height:1.15;color:#ffffff">Your support ticket has been created.</h1>
          <p style="margin:0;color:#aab7d2;font-size:16px;line-height:1.65">Use the secure link and one-time code below to open your private conversation.</p>
          <p style="margin:22px 0 0"><a href="${escapeHtml(input.privateUrl)}" style="display:inline-block;padding:12px 18px;border-radius:10px;background:linear-gradient(135deg,#7c3aed,#c026d3);color:#fff;text-decoration:none;font-weight:800">Open private ticket</a></p>
          <div style="margin:28px 0;padding:22px;border:1px solid #5840a2;border-radius:14px;background:#11132c;text-align:center;font-size:38px;font-weight:900;letter-spacing:.24em;color:#ffffff">${escapeHtml(input.code)}</div>
          <p style="margin:0 0 8px;color:#d6dcf0;font-size:14px;line-height:1.6"><strong>This code expires in three minutes</strong> and can only be used once.</p>
          <p style="margin:0;color:#8798b9;font-size:13px;line-height:1.6">Never share the private link or verification code with anyone, including ESB Games staff. If you did not create this request, contact support@esbgames.com.</p>
        </td></tr>
        <tr><td style="padding:20px 30px;border-top:1px solid #222d49;color:#7384a6;font-size:12px;line-height:1.6">ESB Games Support · Secure customer communications</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}
