import "server-only";
import type { NextRequest } from "next/server";
import {
  getSupabaseServerConfig,
  verifySupabaseAccessToken,
  type VerifiedAccount,
} from "@/lib/server/supabase";

export type RefreshedSharedSession = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number | null;
};

export type SharedAccountSession = {
  account: VerifiedAccount | null;
  refreshedSession: RefreshedSharedSession | null;
  hadSessionCookies: boolean;
};

const ACCESS_COOKIE = "esb_access";
const REFRESH_COOKIE = "esb_refresh";
const LEGACY_ACCESS_COOKIE = "__Host-esb_access";
const LEGACY_REFRESH_COOKIE = "__Host-esb_refresh";

async function refreshSupabaseSession(refreshToken: string): Promise<RefreshedSharedSession | null> {
  const config = getSupabaseServerConfig();
  if (!config?.anonKey) return null;

  const response = await fetch(`${config.url}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: {
      apikey: config.anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  });

  if (!response.ok) return null;

  const payload = await response.json() as {
    access_token?: unknown;
    refresh_token?: unknown;
    expires_in?: unknown;
  };
  const accessToken = typeof payload.access_token === "string" ? payload.access_token.trim() : "";
  const nextRefreshToken = typeof payload.refresh_token === "string" ? payload.refresh_token.trim() : "";
  if (!accessToken || !nextRefreshToken) return null;

  return {
    accessToken,
    refreshToken: nextRefreshToken,
    expiresIn: typeof payload.expires_in === "number" && Number.isFinite(payload.expires_in)
      ? payload.expires_in
      : null,
  };
}

/**
 * Resolve the shared *.esbgames.com account session.
 *
 * The main Platform rotates an expired Supabase access token with the shared
 * refresh token. About must do the same; otherwise a user appears signed out
 * here as soon as the short-lived access token expires, even though their
 * ESB Games session is still valid.
 */
export async function resolveSharedAccountSession(request: NextRequest): Promise<SharedAccountSession> {
  const cookieAccessToken = request.cookies.get(ACCESS_COOKIE)?.value
    ?? request.cookies.get(LEGACY_ACCESS_COOKIE)?.value
    ?? null;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value
    ?? request.cookies.get(LEGACY_REFRESH_COOKIE)?.value
    ?? null;
  const explicitAuthorization = request.headers.get("authorization");
  const authorization = explicitAuthorization
    ?? (cookieAccessToken ? `Bearer ${cookieAccessToken}` : null);

  const account = await verifySupabaseAccessToken(authorization);
  if (account) {
    return {
      account,
      refreshedSession: null,
      hadSessionCookies: Boolean(cookieAccessToken || refreshToken),
    };
  }

  if (!refreshToken) {
    return {
      account: null,
      refreshedSession: null,
      hadSessionCookies: Boolean(cookieAccessToken),
    };
  }

  const refreshedSession = await refreshSupabaseSession(refreshToken);
  if (!refreshedSession) {
    return { account: null, refreshedSession: null, hadSessionCookies: true };
  }

  const refreshedAccount = await verifySupabaseAccessToken(`Bearer ${refreshedSession.accessToken}`);
  if (!refreshedAccount) {
    return { account: null, refreshedSession: null, hadSessionCookies: true };
  }

  return {
    account: refreshedAccount,
    refreshedSession,
    hadSessionCookies: true,
  };
}
