import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { buildSupportTicketDescription } from "@/lib/support-intake";
import { extractEmailAddress, sendEmail, supportReplyTo, supportSender } from "@/lib/server/email";
import {
  createSupportTicket,
  SupportRateLimitError,
  supportCategories,
  supportNetworkKey,
  takeSupportRateLimit,
  uploadSupportAttachments,
} from "@/lib/server/support";
import { getSupabaseServerConfig, supabaseInsert, supabaseSelect } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CreatedTicketResult = {
  ticketId: string;
  ticketReference: string;
  accessToken: string;
  requesterEmail: string;
  requesterAccountId: string | null;
  status: string;
  requiresEmailVerification: boolean;
  pipelineVersion: number;
};

type SubmissionStage =
  | "configuration"
  | "parse_request"
  | "validate_request"
  | "network_rate_limit"
  | "email_rate_limit"
  | "create_ticket"
  | "load_initial_message"
  | "upload_attachments"
  | "send_confirmation"
  | "queue_notifications"
  | "complete";

export async function POST(request: NextRequest) {
  const incidentReference = `ESB-SUP-${randomUUID().slice(0, 8).toUpperCase()}`;
  let stage: SubmissionStage = "configuration";

  try {
    if (!getSupabaseServerConfig()) {
      return unavailableResponse(incidentReference);
    }

    stage = "parse_request";
    const form = await request.formData();
    if (String(form.get("website") ?? "")) {
      return NextResponse.json({ ok: true }, { status: 202, headers: noStoreHeaders() });
    }

    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const categoryId = String(form.get("category") ?? "").trim();
    const subject = String(form.get("subject") ?? "").trim();
    const files = form.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);

    stage = "validate_request";
    if (!name || name.length > 120) return validationResponse("Enter your full name.");
    if (!subject || subject.length > 160) return validationResponse("Enter a clear subject of 160 characters or fewer.");
    if (!supportCategories.some((category) => category.id === categoryId)) return validationResponse("Choose a valid support category.");
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return validationResponse("Enter a valid email address.");

    const description = buildSupportTicketDescription(form, categoryId);

    stage = "network_rate_limit";
    await takeSupportRateLimit({
      scope: "support-ticket-create-network",
      key: supportNetworkKey(request),
      windowSeconds: 3600,
      maxRequests: 8,
      blockSeconds: 1800,
    });

    stage = "email_rate_limit";
    await takeSupportRateLimit({
      scope: "support-ticket-create-email",
      key: email.toLowerCase(),
      windowSeconds: 3600,
      maxRequests: 4,
      blockSeconds: 1800,
    });

    stage = "create_ticket";
    // Keep the route independently typed as well as the server helper. This
    // prevents stale or partially replaced helper files from causing Next.js
    // to infer the response as only `{ accessToken: string }`.
    const result = (await createSupportTicket({
      request,
      name,
      email,
      categoryId,
      subject,
      description,
    })) as CreatedTicketResult;
    const ticketId = String(result.ticketId ?? "");
    const ticketReference = String(result.ticketReference ?? "");
    const accessToken = String(result.accessToken ?? "");
    const requiresEmailVerification = Boolean(result.requiresEmailVerification);
    const requesterEmail = String(result.requesterEmail ?? email).trim().toLowerCase();
    const requesterAccountId = result.requesterAccountId ? String(result.requesterAccountId) : null;
    if (!ticketId || !ticketReference || !accessToken) {
      throw new Error("The ticket service returned an incomplete ticket record.");
    }

    if (files.length) {
      stage = "load_initial_message";
      const messages = await supabaseSelect<{ id: string }>(
        "support_ticket_messages",
        `select=id&ticket_id=eq.${encodeURIComponent(ticketId)}&order=created_at.asc&limit=1`,
      );

      stage = "upload_attachments";
      await uploadSupportAttachments({
        ticketId,
        messageId: messages[0]?.id ?? null,
        files,
        uploaderType: requiresEmailVerification ? "Guest" : "Account",
        uploaderAccountId: requesterAccountId,
        safetySensitive: categoryId === "safety-abuse",
      });
    }

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin).replace(/\/$/, "");
    const privatePath = `/support/ticket/${accessToken}`;
    const privateUrl = `${siteUrl}${privatePath}`;
    const recipient = requesterEmail;

    stage = "send_confirmation";
    // Guest tickets use one combined, on-demand verification email. This avoids
    // sending a separate creation email immediately followed by a code email.
    const delivery = requiresEmailVerification
      ? {
          configured: true,
          sent: false,
          id: undefined,
          statusCode: undefined,
          errorCode: "verification_on_demand",
          error: null,
          requestReference: `ESB-EMAIL-${randomUUID().slice(0, 8).toUpperCase()}`,
        }
      : recipient
        ? await sendEmail({
            from: supportSender(),
            to: recipient,
            replyTo: supportReplyTo(),
            subject: `Your ESB Games support ticket — ${ticketReference}`,
            text: `Your ESB Games support ticket ${ticketReference} has been created.\n\nOpen your private ticket: ${privateUrl}\n\nDo not forward the private ticket link.`,
            html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#11182b"><h1>Support ticket created</h1><p>Your reference is <strong>${escapeHtml(ticketReference)}</strong>.</p><p><a href="${escapeHtml(privateUrl)}" style="display:inline-block;padding:12px 18px;background:#7c3aed;color:white;text-decoration:none;border-radius:8px">Open private ticket</a></p><p>Do not forward this private link.</p></div>`,
          })
        : { configured: false, sent: false, id: undefined, statusCode: undefined, errorCode: "no_recipient", error: "No email available.", requestReference: `ESB-EMAIL-${randomUUID().slice(0, 8).toUpperCase()}` };

    stage = "queue_notifications";
    if (recipient && !requiresEmailVerification) {
      await supabaseInsert("support_email_delivery_events", {
        ticket_id: ticketId,
        provider: "Resend",
        purpose: "Ticket Created",
        recipient_email: recipient,
        sender_email: extractEmailAddress(supportSender()) || supportSender(),
        provider_message_id: delivery.id ?? null,
        delivery_state: delivery.sent ? "Sent" : "Failed",
        error_code: delivery.errorCode ?? null,
        error_message: delivery.error?.slice(0, 1000) ?? null,
        request_reference: delivery.requestReference,
      }).catch((auditError) => console.error("[support-ticket-create] Email audit insert failed", { incidentReference, auditError }));
    }
    if (!requiresEmailVerification) {
      await supabaseInsert("support_notification_outbox", {
        ticket_id: ticketId,
        channel: "Email",
        recipient: recipient || "linked-account",
        template_key: "support_ticket_created",
        payload: { ticketReference, privatePath, verificationOnDemand: false },
        status: delivery.sent ? "Sent" : "Queued",
        attempts: delivery.sent ? 1 : 0,
        sent_at: delivery.sent ? new Date().toISOString() : null,
        last_error: requiresEmailVerification ? null : delivery.error ?? null,
      }).catch((error) => console.error("[support-ticket-create] Notification outbox insert failed", { incidentReference, error }));
    }

    if (requesterAccountId) {
      await supabaseInsert("public_site_notification_outbox", {
        source_system: "Support",
        source_record_id: ticketId,
        channel: "Platform Notification",
        recipient: requesterAccountId,
        template_key: "support_ticket_created",
        payload: {
          title: `Support ticket ${ticketReference} created`,
          body: subject,
          actionUrl: privatePath,
          ticketId,
        },
        status: "Queued",
      }).catch((error) => console.error("[support-ticket-create] Platform notification insert failed", { incidentReference, error }));
    }

    stage = "complete";
    return NextResponse.json(
      { ok: true, ticketReference, privatePath, requiresEmailVerification, emailSent: delivery.sent, verificationEmailOnDemand: requiresEmailVerification },
      { status: 201, headers: noStoreHeaders() },
    );
  } catch (error) {
    if (error instanceof SupportRateLimitError) {
      return NextResponse.json(
        { error: error.message, retryAfterSeconds: error.retryAfterSeconds },
        {
          status: 429,
          headers: { ...noStoreHeaders(), "Retry-After": String(error.retryAfterSeconds) },
        },
      );
    }

    const message = error instanceof Error ? error.message : "Your support ticket could not be created.";
    console.error("[support-ticket-create] Ticket creation failed", {
      incidentReference,
      stage,
      message,
      error,
    });

    const status = /complete|enter|choose|valid|too long|required/i.test(message) ? 400 : 503;
    return NextResponse.json(
      {
        error: publicSupportError(message),
        incidentReference,
      },
      {
        status,
        headers: {
          ...noStoreHeaders(),
          "X-ESB-Support-Incident": incidentReference,
        },
      },
    );
  }
}

function validationResponse(error: string) {
  return NextResponse.json({ error }, { status: 400, headers: noStoreHeaders() });
}

function unavailableResponse(incidentReference: string) {
  return NextResponse.json(
    {
      error: "Online ticket creation is temporarily unavailable. Please try again shortly or contact support@esbgames.com.",
      incidentReference,
    },
    { status: 503, headers: noStoreHeaders() },
  );
}

function publicSupportError(message: string) {
  if (/Supabase|not configured|service role|connection|PGRST|database|ticket service/i.test(message)) {
    return "Online ticket creation is temporarily unavailable. Please try again shortly or contact support@esbgames.com.";
  }
  return message;
}

function noStoreHeaders() {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    Pragma: "no-cache",
    Expires: "0",
  };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}
