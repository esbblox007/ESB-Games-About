import { NextResponse } from "next/server";
import { escapeHtml, sendEmail, supabaseInsert } from "@/lib/integrations";

function ticketId() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `ESB-${code}`;
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const category = String(body.category || "Other").trim();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();
    if (name.length < 2 || !validEmail(email) || subject.length < 4 || message.length < 15) {
      return NextResponse.json({ error: "Please complete every field with valid information." }, { status: 400 });
    }
    const id = ticketId();
    const createdAt = new Date().toISOString();
    await supabaseInsert("support_tickets", { ticket_id: id, name, email, category, subject, message, status: "Received", created_at: createdAt });

    const inbox = process.env.SUPPORT_INBOX_EMAIL;
    if (inbox) {
      await sendEmail({
        to: inbox,
        replyTo: email,
        subject: `[${id}] ${subject}`,
        html: `<h2>New ESB Games support ticket</h2><p><strong>Reference:</strong> ${id}</p><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Category:</strong> ${escapeHtml(category)}</p><p><strong>Subject:</strong> ${escapeHtml(subject)}</p><p><strong>Message:</strong></p><p>${escapeHtml(message).replaceAll("\n", "<br>")}</p>`,
      });
    }
    await sendEmail({
      to: email,
      subject: `We received your ESB Games ticket ${id}`,
      html: `<h2>We received your request</h2><p>Hello ${escapeHtml(name)},</p><p>Your support reference is <strong>${id}</strong>. Keep this code so you can track the request on the support page.</p><p><strong>${escapeHtml(subject)}</strong></p><p>Our team will review your request and reply by email.</p>`,
    });
    return NextResponse.json({ ticketId: id, status: "Received" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "The ticket could not be submitted. Check your server integration settings and try again." }, { status: 500 });
  }
}
