import { NextRequest, NextResponse } from "next/server";
import { resolveSharedAccountSession } from "@/lib/server/shared-account-session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SHARED_COOKIE_DOMAIN = process.env.VERCEL_ENV === "production" ? "esbgames.com" : undefined;
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function setSharedSessionCookie(response: NextResponse, name: string, value: string) {
  response.cookies.set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    domain: SHARED_COOKIE_DOMAIN,
    maxAge: SESSION_MAX_AGE,
  });
}

function clearSharedSessionCookie(response: NextResponse, name: string, legacy = false) {
  response.cookies.set(name, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(legacy ? {} : { domain: SHARED_COOKIE_DOMAIN }),
    maxAge: 0,
    expires: new Date(0),
  });
}

export async function GET(request: NextRequest) {
  const session = await resolveSharedAccountSession(request);
  const account = session.account;

  if (!account) {
    const response = NextResponse.json(
      { authenticated: false },
      { status: 200, headers: { "Cache-Control": "private, no-store" } },
    );

    // If Supabase rejected both the access and refresh tokens, remove the stale
    // shared session rather than making About repeatedly retry a dead session.
    if (session.hadSessionCookies) {
      clearSharedSessionCookie(response, "esb_access");
      clearSharedSessionCookie(response, "esb_refresh");
      clearSharedSessionCookie(response, "__Host-esb_access", true);
      clearSharedSessionCookie(response, "__Host-esb_refresh", true);
    }
    return response;
  }

  const username = String(
    account.userMetadata.username
      ?? account.userMetadata.display_name
      ?? account.userMetadata.full_name
      ?? "ESB Games account",
  ).trim();
  const displayName = String(
    account.userMetadata.display_name
      ?? account.userMetadata.full_name
      ?? account.userMetadata.username
      ?? "ESB Games user",
  ).trim();
  const avatarCandidate = account.userMetadata.avatar_url
    ?? account.userMetadata.avatarUrl
    ?? account.userMetadata.picture
    ?? null;
  const avatarUrl = typeof avatarCandidate === "string" && /^https?:\/\//i.test(avatarCandidate.trim()) ? avatarCandidate.trim() : null;

  const response = NextResponse.json(
    {
      authenticated: true,
      account: {
        id: account.id,
        username,
        displayName,
        email: account.email ?? null,
        avatarUrl,
      },
    },
    { status: 200, headers: { "Cache-Control": "private, no-store" } },
  );

  if (session.refreshedSession) {
    setSharedSessionCookie(response, "esb_access", session.refreshedSession.accessToken);
    setSharedSessionCookie(response, "esb_refresh", session.refreshedSession.refreshToken);
    clearSharedSessionCookie(response, "__Host-esb_access", true);
    clearSharedSessionCookie(response, "__Host-esb_refresh", true);
  }

  return response;
}
