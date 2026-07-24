import { NextRequest, NextResponse } from "next/server";
import { hasSupabase, supabaseInsert, supabaseSelectOne } from "@/lib/integrations";

const attempts = new Map<string, number[]>();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  if (body.website) return NextResponse.json({ status: "success" });
  const email = body.email?.trim().toLowerCase() || "";
  if (!EMAIL_RE.test(email) || email.length > 254) return NextResponse.json({ status: "invalid" }, { status: 400 });
  if (!hasSupabase) return NextResponse.json({ status: "unavailable" }, { status: 503 });

  try {
    const existing = await supabaseSelectOne("newsletter_subscriptions", "email", email);
    if (existing) return NextResponse.json({ status: "exists" });
    await supabaseInsert("newsletter_subscriptions", {
      email,
      locale: body.locale || "en",
      source: "about-homepage",
      status: "Subscribed",
      subscribed_at: new Date().toISOString(),
    });
    return NextResponse.json({ status: "success" });
  } catch {
    return NextResponse.json({ status: "unavailable" }, { status: 503 });
  }
}
