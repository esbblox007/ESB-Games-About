import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  getSupabaseServerConfig,
  supabaseInsert,
  supabaseSelect,
  supabaseUpdate,
} from "@/lib/server/supabase";
import { sendEmail } from "@/lib/server/email";
import { ESB_BRAND } from "@/lib/site-config";

const attempts = new Map<string, number[]>();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubscriptionRow = {
  id: string | number;
  status?: string | null;
  unsubscribe_token?: string | null;
};

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) || []).filter((time) => now - time < 60_000);
  recent.push(now);
  attempts.set(key, recent);
  return recent.length > 5;
}

function newsletterSender() {
  return process.env.NEWSLETTER_FROM_EMAIL?.trim() || process.env.SUPPORT_FROM_EMAIL?.trim() || "ESB Games Updates <updates@esbgames.com>";
}

function newsletterReplyTo() {
  return process.env.NEWSLETTER_REPLY_TO_EMAIL?.trim() || "contact@esbgames.com";
}

async function sendSubscriptionConfirmation(email: string, token: string) {
  const unsubscribeUrl = new URL("/newsletter/unsubscribe", ESB_BRAND.siteUrl);
  unsubscribeUrl.searchParams.set("token", token);

  const result = await sendEmail({
    from: newsletterSender(),
    to: email,
    replyTo: newsletterReplyTo(),
    subject: "You’re subscribed to ESB Games updates",
    text: [
      "You’re subscribed to ESB Games updates.",
      "",
      "We’ll use this email for major ESB Games updates, product and development news, launch announcements and other important information from the ESB Games ecosystem.",
      "",
      "You can unsubscribe at any time:",
      unsubscribeUrl.toString(),
      "",
      "ESB Games — Discover. Belong. Build.",
    ].join("\n"),
    html: `
      <div style="margin:0;padding:32px;background:#040711;color:#f8f8ff;font-family:Arial,Helvetica,sans-serif">
        <div style="max-width:620px;margin:0 auto;padding:34px;border:1px solid #252b45;border-radius:18px;background:#090e1d">
          <div style="font-size:12px;font-weight:800;letter-spacing:.18em;color:#bd8cff">ESB GAMES UPDATES</div>
          <h1 style="margin:12px 0 16px;font-size:30px;line-height:1.15;color:#ffffff">You’re subscribed.</h1>
          <p style="margin:0 0 14px;color:#b7c0d4;font-size:15px;line-height:1.65">Thanks for subscribing to ESB Games updates.</p>
          <p style="margin:0 0 18px;color:#b7c0d4;font-size:15px;line-height:1.65">We’ll use this email for major platform updates, product and development news, launch announcements and other important information from across the ESB Games ecosystem.</p>
          <div style="margin:24px 0;padding:18px;border-radius:12px;background:#0d1427;color:#cbd3e5;font-size:14px;line-height:1.6">You can unsubscribe whenever you want. We’ll keep the process simple and won’t require you to contact Support.</div>
          <a href="${unsubscribeUrl.toString()}" style="display:inline-block;padding:12px 18px;border-radius:9px;background:linear-gradient(100deg,#7f42ff,#b62bec);color:#fff;text-decoration:none;font-weight:800">Unsubscribe from updates</a>
          <p style="margin:26px 0 0;color:#7f8aa4;font-size:12px;line-height:1.55">If you did not subscribe to ESB Games updates, use the unsubscribe button above.</p>
          <p style="margin:18px 0 0;color:#7f8aa4;font-size:12px">ESB Games · Discover. Belong. Build.</p>
        </div>
      </div>`,
  });

  if (!result.sent) {
    console.error("[newsletter] Confirmation email was not delivered", {
      email,
      errorCode: result.errorCode,
      error: result.error,
      reference: result.requestReference,
    });
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ status: "rate_limited" }, { status: 429 });

  let body: { email?: string; locale?: string; website?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  if (body.website) return NextResponse.json({ status: "success" });

  const email = body.email?.trim().toLowerCase() || "";
  const locale = (body.locale || "en").trim().slice(0, 20) || "en";
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  if (!getSupabaseServerConfig()) {
    console.error("[newsletter] Supabase server configuration is unavailable.");
    return NextResponse.json({ status: "unavailable" }, { status: 503 });
  }

  try {
    const rows = await supabaseSelect<SubscriptionRow>(
      "newsletter_subscriptions",
      `email=eq.${encodeURIComponent(email)}&select=id,status,unsubscribe_token&limit=1`,
    );
    const existing = rows[0];

    if (existing) {
      const status = String(existing.status || "").toLowerCase();
      if (status !== "subscribed") {
        const now = new Date().toISOString();
        const token = randomUUID();
        await supabaseUpdate(
          "newsletter_subscriptions",
          `email=eq.${encodeURIComponent(email)}`,
          {
            locale,
            source: "about-homepage",
            status: "Subscribed",
            unsubscribe_token: token,
            subscribed_at: now,
            unsubscribed_at: null,
            updated_at: now,
          },
        );
        await sendSubscriptionConfirmation(email, token);
        return NextResponse.json({ status: "success" });
      }

      if (!existing.unsubscribe_token) {
        await supabaseUpdate(
          "newsletter_subscriptions",
          `email=eq.${encodeURIComponent(email)}`,
          { unsubscribe_token: randomUUID(), updated_at: new Date().toISOString() },
        );
      }
      return NextResponse.json({ status: "exists" });
    }

    const now = new Date().toISOString();
    const token = randomUUID();
    await supabaseInsert("newsletter_subscriptions", {
      email,
      locale,
      source: "about-homepage",
      status: "Subscribed",
      unsubscribe_token: token,
      subscribed_at: now,
      updated_at: now,
    });

    await sendSubscriptionConfirmation(email, token);
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("[newsletter] Supabase subscription request failed", error);
    return NextResponse.json({ status: "unavailable" }, { status: 503 });
  }
}
