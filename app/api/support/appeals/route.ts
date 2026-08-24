import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  createSupportTicket,
  SupportRateLimitError,
  supportNetworkKey,
  takeSupportRateLimit,
  uploadSupportAttachments,
} from "@/lib/server/support";
import { supabaseInsert, supabaseSelect, verifySupabaseAccessToken } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const validActions = new Set([
  "Warning",
  "Temporary ban",
  "Permanent ban",
  "Account restriction",
  "Communication restriction",
  "Content or asset removal",
  "Creator or marketplace enforcement",
  "Other disciplinary action",
]);

export async function POST(request: NextRequest) {
  const incidentReference = `ESB-APL-${randomUUID().slice(0, 8).toUpperCase()}`;
  try {
    const form = await request.formData();
    if (String(form.get("website") ?? "")) return NextResponse.json({ ok: true }, { status: 202 });

    const account = await verifySupabaseAccessToken(request.headers.get("authorization"));
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const actionType = String(form.get("actionType") ?? "").trim();
    const enforcementReference = String(form.get("enforcementReference") ?? "").trim();
    const actionScope = String(form.get("actionScope") ?? "").trim();
    const actionIssuedAt = String(form.get("actionIssuedAt") ?? "").trim();
    const actionExpiresAt = String(form.get("actionExpiresAt") ?? "").trim();
    const appealReason = String(form.get("appealReason") ?? "").trim();
    const requestedOutcome = String(form.get("requestedOutcome") ?? "").trim();
    const files = form.getAll("files").filter((value): value is File => value instanceof File && value.size > 0).slice(0, 8);

    if (!account && (!name || !email || !/^\S+@\S+\.\S+$/.test(email))) {
      return NextResponse.json({ error: "Sign in to ESB Games or enter a valid name and email address." }, { status: 400 });
    }
    if (!validActions.has(actionType)) return NextResponse.json({ error: "Choose the enforcement action you want to appeal." }, { status: 400 });
    if (appealReason.length < 20 || appealReason.length > 10000) return NextResponse.json({ error: "Explain why the action should be reviewed (20–10,000 characters)." }, { status: 400 });
    if (requestedOutcome.length < 5 || requestedOutcome.length > 3000) return NextResponse.json({ error: "Tell us what outcome you are requesting." }, { status: 400 });
    if (files.some((file) => file.size > 100 * 1024 * 1024)) return NextResponse.json({ error: "Each attachment must be 100 MB or smaller." }, { status: 400 });

    await takeSupportRateLimit({
      scope: "support-appeal-create-network",
      key: supportNetworkKey(request),
      windowSeconds: 3600,
      maxRequests: 6,
      blockSeconds: 1800,
    });
    await takeSupportRateLimit({
      scope: "support-appeal-create-identity",
      key: account?.id ?? email.toLowerCase(),
      windowSeconds: 3600,
      maxRequests: 3,
      blockSeconds: 1800,
    });

    const subject = `Appeal: ${actionType}${enforcementReference ? ` — ${enforcementReference}` : ""}`.slice(0, 160);
    const description = [
      "ENFORCEMENT APPEAL",
      "",
      `Action type: ${actionType}`,
      enforcementReference ? `Enforcement reference: ${enforcementReference}` : null,
      actionScope ? `Affected account/content: ${actionScope}` : null,
      actionIssuedAt ? `Action issued: ${actionIssuedAt}` : null,
      actionExpiresAt ? `Action expires: ${actionExpiresAt}` : null,
      "",
      "Reason for appeal:",
      appealReason,
      "",
      "Requested outcome:",
      requestedOutcome,
      "",
      "The requester was instructed not to include passwords, one-time codes or backup codes.",
    ].filter(Boolean).join("\n");

    const ticket = await createSupportTicket({
      request,
      name: account ? String(account.userMetadata.display_name ?? account.userMetadata.username ?? "ESB Games user") : name,
      email: account?.email ?? email,
      categoryId: "enforcement-appeal",
      subject,
      description,
    });

    await supabaseInsert("enforcement_appeals", {
      ticket_id: ticket.ticketId,
      requester_account_id: ticket.requesterAccountId,
      enforcement_reference: enforcementReference || null,
      action_type: actionType,
      action_scope: actionScope || null,
      action_issued_at: normaliseDate(actionIssuedAt),
      action_expires_at: normaliseDate(actionExpiresAt),
      appeal_reason: appealReason,
      requested_outcome: requestedOutcome,
      review_status: "Submitted",
    });

    if (files.length) {
      const messages = await supabaseSelect<{ id: string }>(
        "support_ticket_messages",
        `select=id&ticket_id=eq.${encodeURIComponent(ticket.ticketId)}&order=created_at.asc&limit=1`,
      );
      await uploadSupportAttachments({
        ticketId: ticket.ticketId,
        messageId: messages[0]?.id ?? null,
        files,
        uploaderType: ticket.requiresEmailVerification ? "Guest" : "Account",
        uploaderAccountId: ticket.requesterAccountId,
        safetySensitive: false,
      });
    }

    return NextResponse.json({
      ok: true,
      ticketReference: ticket.ticketReference,
      privatePath: `/support/ticket/${ticket.accessToken}`,
      requiresEmailVerification: ticket.requiresEmailVerification,
      reviewStatus: "Submitted",
    }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    if (error instanceof SupportRateLimitError) {
      return NextResponse.json(
        { error: error.message, retryAfterSeconds: error.retryAfterSeconds },
        { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds), "Cache-Control": "private, no-store" } },
      );
    }
    console.error("[support-appeal] Appeal creation failed", { incidentReference, error });
    return NextResponse.json({
      error: "Your appeal could not be submitted right now. Please try again shortly.",
      incidentReference,
    }, { status: 503, headers: { "Cache-Control": "private, no-store" } });
  }
}

function normaliseDate(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
