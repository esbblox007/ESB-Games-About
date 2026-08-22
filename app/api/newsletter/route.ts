import { NextRequest, NextResponse } from "next/server";
import {
  getSupabaseServerConfig,
  supabaseInsert,
  supabaseSelect,
  supabaseUpdate,
} from "@/lib/server/supabase";

const attempts = new Map<string, number[]>();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubscriptionRow = {
  id: string | number;
  status?: string | null;
};

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) || []).filter((time) => now - time < 60_000);
  recent.push(now);
  attempts.set(key, recent);
  return recent.length > 5;
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

  // Honeypot submissions should look successful to bots without touching data.
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
      `email=eq.${encodeURIComponent(email)}&select=id,status&limit=1`,
    );
    const existing = rows[0];

    if (existing) {
      const status = String(existing.status || "").toLowerCase();
      if (status !== "subscribed") {
        const now = new Date().toISOString();
        await supabaseUpdate(
          "newsletter_subscriptions",
          `email=eq.${encodeURIComponent(email)}`,
          {
            locale,
            source: "about-homepage",
            status: "Subscribed",
            subscribed_at: now,
            unsubscribed_at: null,
            updated_at: now,
          },
        );
        return NextResponse.json({ status: "success" });
      }
      return NextResponse.json({ status: "exists" });
    }

    const now = new Date().toISOString();
    await supabaseInsert("newsletter_subscriptions", {
      email,
      locale,
      source: "about-homepage",
      status: "Subscribed",
      subscribed_at: now,
      updated_at: now,
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("[newsletter] Supabase subscription request failed", error);
    return NextResponse.json({ status: "unavailable" }, { status: 503 });
  }
}
