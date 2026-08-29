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

type EnforcementRecord = {
  id: string;
  enforcement_reference: string;
  subject_account_id: string | null;
  original_action_type: string | null;
  original_scope: string | null;
  issued_at: string;
  expires_at: string | null;
  issued_by_staff_id: string;
  enforcement_state: string;
  effective_action_type: string | null;
  effective_scope: string | null;
  effective_expires_at: string | null;
};

async function authoritativeEnforcement(reference: string) {
  const clean = reference.trim().toUpperCase();
  if (!clean) return null;
  const rows = await supabaseSelect<EnforcementRecord>(
    "trust_safety_enforcements",
    `select=id,enforcement_reference,subject_account_id,original_action_type,original_scope,issued_at,expires_at,issued_by_staff_id,enforcement_state,effective_action_type,effective_scope,effective_expires_at&enforcement_reference=eq.${encodeURIComponent(clean)}&limit=1`,
  );
  return rows[0] ?? null;
}

export async function POST(request: NextRequest) {
  const incidentReference = `ESB-APL-${randomUUID().slice(0, 8).toUpperCase()}`;
  try {
    const form = await request.formData();
    if (String(form.get("website") ?? "")) return NextResponse.json({ ok: true }, { status: 202 });

    const sharedAccessToken = request.cookies.get("esb_access")?.value
      ?? request.cookies.get("__Host-esb_access")?.value
      ?? null;
    const authorization = request.headers.get("authorization")
      ?? (sharedAccessToken ? `Bearer ${sharedAccessToken}` : null);
    const account = await verifySupabaseAccessToken(authorization);

    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const submittedActionType = String(form.get("actionType") ?? "").trim();
    const submittedEnforcementReference = String(form.get("enforcementReference") ?? "").trim();
    const submittedActionScope = String(form.get("actionScope") ?? "").trim();
    const submittedActionIssuedAt = String(form.get("actionIssuedAt") ?? "").trim();
    const submittedActionExpiresAt = String(form.get("actionExpiresAt") ?? "").trim();
    const appealReason = String(form.get("appealReason") ?? "").trim();
    const requestedOutcome = String(form.get("requestedOutcome") ?? "").trim();
    const files = form.getAll("files").filter((value): value is File => value instanceof File && value.size > 0).slice(0, 8);

    if (!account && (!name || !email || !/^\S+@\S+\.\S+$/.test(email))) {
      return NextResponse.json({ error: "Sign in to ESB Games or enter a valid name and email address." }, { status: 400 });
    }
    if (!validActions.has(submittedActionType)) return NextResponse.json({ error: "Choose the enforcement action you want to appeal." }, { status: 400 });
    if (appealReason.length < 20 || appealReason.length > 10000) return NextResponse.json({ error: "Explain why the action should be reviewed (20–10,000 characters)." }, { status: 400 });
    if (requestedOutcome.length < 5 || requestedOutcome.length > 3000) return NextResponse.json({ error: "Tell us what outcome you are requesting." }, { status: 400 });
    if (files.some((file) => file.size > 100 * 1024 * 1024)) return NextResponse.json({ error: "Each attachment must be 100 MB or smaller." }, { status: 400 });

    const today = new Date().toISOString().slice(0, 10);
    if (submittedActionIssuedAt) {
      if (!isDateOnly(submittedActionIssuedAt)) return NextResponse.json({ error: "Enter a valid date for when the action was issued." }, { status: 400 });
      if (submittedActionIssuedAt > today) return NextResponse.json({ error: "The date the action was issued cannot be in the future." }, { status: 400 });
    }
    if (submittedActionExpiresAt) {
      if (!isDateOnly(submittedActionExpiresAt)) return NextResponse.json({ error: "Enter a valid restriction or ban end date." }, { status: 400 });
      if (submittedActionExpiresAt <= today) return NextResponse.json({ error: "The restriction or ban end date must be a future date." }, { status: 400 });
    }

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

    let linkedEnforcement: EnforcementRecord | null = null;
    if (submittedEnforcementReference) {
      linkedEnforcement = await authoritativeEnforcement(submittedEnforcementReference);
      if (/^ESB-ENF-/i.test(submittedEnforcementReference) && !linkedEnforcement) {
        return NextResponse.json({ error: "That enforcement reference could not be found. Check the reference shown on the moderation notice and try again." }, { status: 400 });
      }
      if (linkedEnforcement && account?.id && linkedEnforcement.subject_account_id && linkedEnforcement.subject_account_id !== account.id) {
        return NextResponse.json({ error: "That enforcement reference does not belong to the signed-in ESB Games account." }, { status: 403 });
      }
    }

    const actionType = linkedEnforcement?.original_action_type || submittedActionType;
    const enforcementReference = linkedEnforcement?.enforcement_reference || submittedEnforcementReference;
    const actionScope = linkedEnforcement?.original_scope || submittedActionScope;
    const actionIssuedAt = linkedEnforcement?.issued_at || normaliseDate(submittedActionIssuedAt);
    const actionExpiresAt = linkedEnforcement?.expires_at || normaliseDate(submittedActionExpiresAt);

    const subject = `Appeal: ${actionType}${enforcementReference ? ` — ${enforcementReference}` : ""}`.slice(0, 160);
    const description = [
      "ENFORCEMENT APPEAL",
      "",
      `Action type: ${actionType}`,
      enforcementReference ? `Enforcement reference: ${enforcementReference}` : null,
      linkedEnforcement ? `Authoritative enforcement linked: Yes (${linkedEnforcement.id})` : "Authoritative enforcement linked: No — legacy/manual action details require staff verification",
      actionScope ? `Affected account/content: ${actionScope}` : null,
      actionIssuedAt ? `Action issued: ${actionIssuedAt}` : null,
      actionExpiresAt ? `Action expires: ${actionExpiresAt}` : null,
      linkedEnforcement ? `Current enforcement state: ${linkedEnforcement.enforcement_state}` : null,
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

    let structuredRecordPending = false;
    let attachmentUploadFailed = false;

    try {
      await supabaseInsert("enforcement_appeals", {
        ticket_id: ticket.ticketId,
        requester_account_id: ticket.requesterAccountId,
        enforcement_id: linkedEnforcement?.id ?? null,
        enforcement_reference: enforcementReference || null,
        enforcement_issued_by_staff_id: linkedEnforcement?.issued_by_staff_id ?? null,
        action_type: actionType,
        action_scope: actionScope || null,
        action_issued_at: actionIssuedAt,
        action_expires_at: actionExpiresAt,
        appeal_reason: appealReason,
        requested_outcome: requestedOutcome,
        review_status: "Submitted",
      });
    } catch (error) {
      structuredRecordPending = true;
      console.error("[support-appeal] Ticket created but structured appeal indexing failed", {
        incidentReference,
        ticketId: ticket.ticketId,
        ticketReference: ticket.ticketReference,
        error,
      });
    }

    if (files.length) {
      try {
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
      } catch (error) {
        attachmentUploadFailed = true;
        console.error("[support-appeal] Appeal submitted but evidence upload failed", {
          incidentReference,
          ticketId: ticket.ticketId,
          ticketReference: ticket.ticketReference,
          error,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      ticketReference: ticket.ticketReference,
      privatePath: `/support/ticket/${ticket.accessToken}`,
      requiresEmailVerification: ticket.requiresEmailVerification,
      reviewStatus: "Submitted",
      enforcementLinked: Boolean(linkedEnforcement),
      enforcementReference: (linkedEnforcement?.enforcement_reference ?? enforcementReference) || null,
      structuredRecordPending,
      attachmentUploadFailed,
    }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    if (error instanceof SupportRateLimitError) {
      return NextResponse.json(
        { error: error.message, retryAfterSeconds: error.retryAfterSeconds },
        { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds), "Cache-Control": "private, no-store" } },
      );
    }
    console.error("[support-appeal] Appeal creation failed before ticket completion", { incidentReference, error });
    return NextResponse.json({
      error: "Your appeal could not be submitted right now. Please try again shortly.",
      incidentReference,
    }, { status: 503, headers: { "Cache-Control": "private, no-store" } });
  }
}

function isDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function normaliseDate(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
