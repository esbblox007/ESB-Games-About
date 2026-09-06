import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/server/email";
import { PublicRateLimitError, publicNetworkKey, takePublicRateLimit } from "@/lib/server/public-rate-limit";
import { supabaseInsert, supabaseRpc, supabaseSelect } from "@/lib/server/supabase";

type Submission = {
  publicSlug: string;
  formVersionId: string;
  consentVersionIds: string[];
  answers: Record<string, unknown>;
  fileReferences?: string[];
  candidate: { fullName: string; email: string; phone?: string; location?: string; timezone?: string };
  idempotencyKey: string;
  talentPoolConsent?: boolean;
  website?: string;
};

export async function POST(request: NextRequest) {
  try {
    const input = await request.json() as Submission;
    if (input.website) return NextResponse.json({ ok: true }, { status: 202 });
    if (!input.publicSlug || !input.formVersionId || !input.idempotencyKey || !input.candidate?.fullName?.trim() || !/^\S+@\S+\.\S+$/.test(input.candidate?.email ?? "")) {
      return NextResponse.json({ error: "Review the required application details and try again." }, { status: 400 });
    }
    await Promise.all([
      takePublicRateLimit({ scope: "careers-application-network", key: publicNetworkKey(request), windowSeconds: 3600, maxRequests: 10, blockSeconds: 3600 }),
      takePublicRateLimit({ scope: "careers-application-email", key: input.candidate.email.toLowerCase(), windowSeconds: 86400, maxRequests: 5, blockSeconds: 86400 }),
    ]);
    const roleRows = await supabaseSelect<{ title?: string }>("public_careers_jobs", `select=title&public_slug=eq.${encodeURIComponent(input.publicSlug)}&limit=1`).catch(() => []);
    const roleTitle = roleRows[0]?.title?.trim() || input.publicSlug;
    const result = await supabaseRpc<Record<string, unknown>>("public_submit_careers_application", {
      p_public_slug: input.publicSlug,
      p_application_form_version_id: input.formVersionId,
      p_consent_version_ids: input.consentVersionIds ?? [],
      p_answers: input.answers ?? {},
      p_file_references: input.fileReferences ?? [],
      p_candidate: input.candidate,
      p_idempotency_key: input.idempotencyKey,
      p_talent_pool_consent: input.talentPoolConsent ?? false,
    });
    const applicationId = String(result?.applicationId ?? result?.application_id ?? "Application received");
    const candidateName = input.candidate.fullName.trim();
    const safeCandidateName = escapeHtml(candidateName);
    const safeRoleTitle = escapeHtml(roleTitle);
    const safeApplicationId = escapeHtml(applicationId);
    const delivery = await sendEmail({
      from: "ESB Games Careers <no-reply.careers@esbgames.com>",
      to: input.candidate.email,
      replyTo: process.env.CAREERS_REPLY_TO_EMAIL ?? "careers@esbgames.com",
      subject: `Application received — ${roleTitle} | ${applicationId}`,
      text: `Hello ${candidateName},\n\nThank you for applying to ESB Games. We have successfully received your application for ${roleTitle}.\n\nApplication reference: ${applicationId}\n\nWhat happens next?\n• Our Careers team will review your application against the requirements of the role.\n• If your application progresses, we will contact you using ${input.candidate.email}.\n• No action is required from you right now.\n\nPlease keep your application reference for future correspondence. Receiving this confirmation does not indicate that a hiring decision has been made.\n\nESB Games Careers\ncareers@esbgames.com`,
      html: `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f3f6fb;font-family:Arial,Helvetica,sans-serif;color:#101827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f6fb;margin:0;padding:0;">
      <tr>
        <td align="center" style="padding:36px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #e3e9f2;border-radius:16px;overflow:hidden;box-shadow:0 8px 28px rgba(15,23,42,0.08);">
            <tr>
              <td style="background:#071426;padding:26px 34px;border-bottom:3px solid #7c3aed;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td>
                      <div style="font-size:20px;line-height:1.2;font-weight:800;letter-spacing:0.08em;color:#ffffff;">ESB GAMES</div>
                      <div style="margin-top:5px;font-size:10px;line-height:1.2;font-weight:700;letter-spacing:0.22em;color:#b8a7ff;">CAREERS</div>
                    </td>
                    <td align="right" valign="middle">
                      <span style="display:inline-block;padding:7px 11px;border:1px solid #27435d;border-radius:999px;font-size:11px;font-weight:700;color:#b9d7ee;">APPLICATION RECEIVED</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:38px 34px 16px;">
                <div style="font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#7c3aed;">Thank you for applying</div>
                <h1 style="margin:10px 0 14px;font-size:30px;line-height:1.18;color:#0b1324;">Your application is with us.</h1>
                <p style="margin:0;font-size:16px;line-height:1.7;color:#465267;">Hello ${safeCandidateName},</p>
                <p style="margin:14px 0 0;font-size:16px;line-height:1.7;color:#465267;">We have successfully received your application for <strong style="color:#111827;">${safeRoleTitle}</strong>. Our Careers team will review the information you submitted.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 34px 8px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f7f5ff;border:1px solid #e5dcff;border-radius:12px;">
                  <tr>
                    <td style="padding:18px 20px;">
                      <div style="font-size:11px;line-height:1.3;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#6d5b9a;">Application reference</div>
                      <div style="margin-top:6px;font-size:20px;line-height:1.3;font-weight:800;letter-spacing:0.02em;color:#5b21b6;">${safeApplicationId}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 34px 8px;">
                <h2 style="margin:0 0 14px;font-size:18px;line-height:1.3;color:#0b1324;">What happens next?</h2>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td width="28" valign="top" style="padding:3px 0 14px;"><span style="display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;border-radius:50%;background:#ede9fe;color:#6d28d9;font-size:12px;font-weight:800;">1</span></td>
                    <td valign="top" style="padding:2px 0 14px 8px;font-size:14px;line-height:1.6;color:#465267;"><strong style="color:#111827;">Review</strong><br>Our Careers team will assess your application against the requirements of the role.</td>
                  </tr>
                  <tr>
                    <td width="28" valign="top" style="padding:3px 0 14px;"><span style="display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;border-radius:50%;background:#e0f2fe;color:#0369a1;font-size:12px;font-weight:800;">2</span></td>
                    <td valign="top" style="padding:2px 0 14px 8px;font-size:14px;line-height:1.6;color:#465267;"><strong style="color:#111827;">Contact</strong><br>If your application progresses, we will contact you using the email address provided in your application.</td>
                  </tr>
                  <tr>
                    <td width="28" valign="top" style="padding:3px 0 4px;"><span style="display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;border-radius:50%;background:#dcfce7;color:#15803d;font-size:12px;font-weight:800;">✓</span></td>
                    <td valign="top" style="padding:2px 0 4px 8px;font-size:14px;line-height:1.6;color:#465267;"><strong style="color:#111827;">Nothing else to do</strong><br>No action is required from you right now. Please keep your reference for future correspondence.</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 34px 34px;">
                <div style="padding:14px 16px;background:#f8fafc;border-left:3px solid #94a3b8;border-radius:4px;font-size:12px;line-height:1.6;color:#667085;">This confirmation only means that your application was received successfully. It does not indicate that a hiring decision has been made.</div>
              </td>
            </tr>
            <tr>
              <td style="background:#0a1728;padding:22px 34px;">
                <div style="font-size:13px;font-weight:700;color:#ffffff;">ESB Games Careers</div>
                <div style="margin-top:5px;font-size:11px;line-height:1.6;color:#91a4b7;">This is an automated confirmation from <strong style="color:#c8d4df;">no-reply.careers@esbgames.com</strong>. Replies are routed to our Careers team at careers@esbgames.com.</div>
              </td>
            </tr>
          </table>
          <div style="max-width:640px;padding:14px 10px 0;text-align:center;font-size:10px;line-height:1.5;color:#8a96a8;">ESB Games · Discover. Belong. Build.</div>
        </td>
      </tr>
    </table>
  </body>
</html>`,
    });
    await supabaseInsert("public_site_notification_outbox", {
      source_system: "Careers",
      source_record_id: applicationId,
      channel: "Email",
      recipient: input.candidate.email.toLowerCase(),
      template_key: "careers_application_received",
      payload: { publicSlug: input.publicSlug, jobTitle: roleTitle, applicationId },
      status: delivery.sent ? "Sent" : "Queued",
      attempts: delivery.sent ? 1 : 0,
      sent_at: delivery.sent ? new Date().toISOString() : null,
      provider_message_id: delivery.id ?? null,
      last_error: delivery.error ?? null,
    }).catch(() => []);
    return NextResponse.json({ ok: true, applicationId, emailSent: delivery.sent }, { status: 201 });
  } catch (error) {
    if (error instanceof PublicRateLimitError) return NextResponse.json({ error: error.message, retryAfterSeconds: error.retryAfterSeconds }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    console.error("[careers-application] Submission failed", error);
    return NextResponse.json({ error: "Your application could not be submitted right now. No hiring decision has been made. Please try again shortly." }, { status: 503 });
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}
