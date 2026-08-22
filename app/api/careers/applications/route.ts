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
    const delivery = await sendEmail({
      from: process.env.CAREERS_FROM_EMAIL ?? "ESB Games Careers <careers@esbgames.com>",
      to: input.candidate.email,
      replyTo: process.env.CAREERS_REPLY_TO_EMAIL ?? "careers@esbgames.com",
      subject: `We received your ESB Games application — ${applicationId}`,
      text: `Hello ${input.candidate.fullName},\n\nWe have received your application for ${roleTitle}. Your reference is ${applicationId}.\n\nThe ESB Games Careers Team`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#10162a"><h1>Application received</h1><p>Hello ${escapeHtml(input.candidate.fullName)},</p><p>We have received your application for <strong>${escapeHtml(roleTitle)}</strong>.</p><p>Your reference is <strong>${escapeHtml(applicationId)}</strong>.</p><p>We will contact you using this email address if your application progresses.</p><p>ESB Games Careers</p></div>`,
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
