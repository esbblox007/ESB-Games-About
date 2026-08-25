import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const sharedCookies = ["esb_access", "esb_refresh", "esb_remember"];
const legacyCookies = ["__Host-esb_access", "__Host-esb_refresh", "__Host-esb_remember"];

export async function POST() {
  const response = NextResponse.json({ ok: true }, { status: 200, headers: { "Cache-Control": "private, no-store" } });
  for (const name of sharedCookies) {
    response.cookies.set(name, "", {
      domain: "esbgames.com",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
  }
  for (const name of legacyCookies) {
    response.cookies.set(name, "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
  }
  return response;
}
