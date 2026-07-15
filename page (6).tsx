import { NextResponse } from "next/server";
import { escapeHtml, sendEmail, supabaseInsert } from "@/lib/integrations";

function validEmail(value: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const interest = String(body.interest || "Player").trim();
    if (name.length < 2 || !validEmail(email) || !body.consent) return NextResponse.json({ error: "Please provide valid details and confirm email consent." }, { status: 400 });
    await supabaseInsert("early_access", { name, email, interest, consent: true, created_at: new Date().toISOString() });
    await sendEmail({ to: email, subject: "You’re on the ESB Games early-access list", html: `<h2>Welcome to early access</h2><p>Hello ${escapeHtml(name)},</p><p>You’re now registered as <strong>${escapeHtml(interest)}</strong>. We’ll email you when there is a relevant testing or launch update.</p>` });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to join the waitlist. Check your server integration settings and try again." }, { status: 500 });
  }
}
