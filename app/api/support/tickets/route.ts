import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/server/email";
import { createSupportTicket, SupportRateLimitError, supportCategories, supportNetworkKey, takeSupportRateLimit, uploadSupportAttachments } from "@/lib/server/support";
import { supabaseInsert, supabaseSelect } from "@/lib/server/supabase";

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    if (String(form.get("website") ?? "")) return NextResponse.json({ ok: true }, { status: 202 });
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const categoryId = String(form.get("category") ?? "").trim();
    const subject = String(form.get("subject") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const files = form.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
    if (!name || name.length > 120 || !subject || subject.length > 160 || description.length < 10 || description.length > 20000) {
      return NextResponse.json({ error: "Complete your name, subject and a detailed description of at least 10 characters." }, { status: 400 });
    }
    if (!supportCategories.some((category) => category.id === categoryId)) return NextResponse.json({ error: "Choose a valid support category." }, { status: 400 });
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });

    await Promise.all([
      takeSupportRateLimit({ scope: "support-ticket-create-network", key: supportNetworkKey(request), windowSeconds: 3600, maxRequests: 8, blockSeconds: 1800 }),
      ...(email ? [takeSupportRateLimit({ scope: "support-ticket-create-email", key: email.toLowerCase(), windowSeconds: 3600, maxRequests: 4, blockSeconds: 1800 })] : []),
    ]);

    const result = await createSupportTicket({ request, name, email, categoryId, subject, description });
    const ticketId = String(result.ticketId ?? "");
    const ticketReference = String(result.ticketReference ?? "");
    const accessToken = String(result.accessToken ?? "");
    const requiresEmailVerification = Boolean(result.requiresEmailVerification);
    const requesterEmail = String(result.requesterEmail ?? email).trim().toLowerCase();
    const requesterAccountId = result.requesterAccountId ? String(result.requesterAccountId) : null;
    if (!ticketId || !accessToken) throw new Error("The ticket was created without a valid access link.");

    if (files.length) {
      const messages = await supabaseSelect<{ id: string }>("support_ticket_messages", `select=id&ticket_id=eq.${encodeURIComponent(ticketId)}&order=created_at.asc&limit=1`);
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
    const delivery = recipient ? await sendEmail({
      from: process.env.SUPPORT_FROM_EMAIL ?? "ESB Games Support <support@esbgames.com>",
      to: recipient,
      replyTo: process.env.SUPPORT_REPLY_TO_EMAIL ?? "support@esbgames.com",
      subject: `Your ESB Games support ticket — ${ticketReference}`,
      text: `Your support ticket ${ticketReference} has been created. Open your private ticket: ${privateUrl}\n\nGuest users will be asked to request a one-time email verification code before viewing the conversation.`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#11182b"><h1>Support ticket created</h1><p>Your reference is <strong>${escapeHtml(ticketReference)}</strong>.</p><p><a href="${escapeHtml(privateUrl)}" style="display:inline-block;padding:12px 18px;background:#7c3aed;color:white;text-decoration:none;border-radius:8px">Open private ticket</a></p>${requiresEmailVerification ? "<p>For your privacy, select <strong>Send verification code</strong> after opening the link. The code expires after three minutes.</p>" : ""}<p>Do not forward this private link.</p></div>`,
    }) : { configured: false, sent: false, error: "No email available." };

    await supabaseInsert("support_notification_outbox", {
      ticket_id: ticketId,
      channel: "Email",
      recipient: recipient || "linked-account",
      template_key: "support_ticket_created",
      payload: { ticketReference, privatePath },
      status: delivery.sent ? "Sent" : "Queued",
      attempts: delivery.sent ? 1 : 0,
      sent_at: delivery.sent ? new Date().toISOString() : null,
      last_error: delivery.error ?? null,
    }).catch(() => []);

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
      }).catch(() => []);
    }

    return NextResponse.json({ ok: true, ticketReference, privatePath, requiresEmailVerification, emailSent: delivery.sent }, { status: 201 });
  } catch (error) {
    if (error instanceof SupportRateLimitError) {
      return NextResponse.json({ error: error.message, retryAfterSeconds: error.retryAfterSeconds }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Your support ticket could not be created." }, { status: 503 });
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}
