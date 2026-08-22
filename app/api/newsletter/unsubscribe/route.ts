import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerConfig, supabaseSelect, supabaseUpdate } from "@/lib/server/supabase";

const TOKEN_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const attempts = new Map<string, number[]>();

type SubscriptionRow = { id: string | number; status?: string | null };

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) || []).filter((time) => now - time < 60_000);
  recent.push(now);
  attempts.set(key, recent);
  return recent.length > 8;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ status: "rate_limited" }, { status: 429 });

  let body: { token?: string };
  try { body = await request.json(); }
  catch { return NextResponse.json({ status: "invalid" }, { status: 400 }); }

  const token = body.token?.trim() || "";
  if (!TOKEN_RE.test(token)) return NextResponse.json({ status: "invalid" }, { status: 400 });
  if (!getSupabaseServerConfig()) return NextResponse.json({ status: "unavailable" }, { status: 503 });

  try {
    const rows = await supabaseSelect<SubscriptionRow>(
      "newsletter_subscriptions",
      `unsubscribe_token=eq.${encodeURIComponent(token)}&select=id,status&limit=1`,
    );
    const subscription = rows[0];
    if (!subscription) return NextResponse.json({ status: "invalid" }, { status: 404 });
    if (String(subscription.status || "").toLowerCase() !== "subscribed") {
      return NextResponse.json({ status: "already_unsubscribed" });
    }

    const now = new Date().toISOString();
    await supabaseUpdate(
      "newsletter_subscriptions",
      `unsubscribe_token=eq.${encodeURIComponent(token)}`,
      { status: "Unsubscribed", unsubscribed_at: now, updated_at: now },
    );
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("[newsletter] Unsubscribe request failed", error);
    return NextResponse.json({ status: "unavailable" }, { status: 503 });
  }
}
