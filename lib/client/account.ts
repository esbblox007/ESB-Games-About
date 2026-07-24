export type SiteAccountProfile = {
  username: string;
  displayName: string;
  avatarUrl?: string;
};

const STORAGE_KEYS = [
  "esb-account-profile",
  "esb_account_profile",
  "esb-user-profile",
  "esbUserProfile",
  "esbUser",
  "esb_user",
] as const;

function parseRecord(value: string | null): Record<string, unknown> | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function decodeBase64Url(value: string) {
  try {
    const normalised = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalised.padEnd(Math.ceil(normalised.length / 4) * 4, "=");
    return decodeURIComponent(
      Array.from(atob(padded))
        .map((character) => `%${character.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );
  } catch {
    return "";
  }
}

function parseJwt(token: string | null | undefined): Record<string, unknown> | null {
  if (!token) return null;
  const payload = token.split(".")[1];
  if (!payload) return null;
  return parseRecord(decodeBase64Url(payload));
}

function readCookieMap() {
  return document.cookie.split(";").reduce<Record<string, string>>((acc, item) => {
    const [rawKey, ...rest] = item.trim().split("=");
    if (!rawKey) return acc;
    acc[decodeURIComponent(rawKey)] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}

function pickString(record: Record<string, unknown> | null, keys: string[]) {
  if (!record) return "";
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function normaliseProfile(record: Record<string, unknown> | null): SiteAccountProfile | null {
  const nestedMetadata = record?.user_metadata && typeof record.user_metadata === "object"
    ? record.user_metadata as Record<string, unknown>
    : null;
  const nestedUser = record?.user && typeof record.user === "object"
    ? record.user as Record<string, unknown>
    : null;

  const username =
    pickString(record, ["username", "userName", "handle", "preferred_username"]) ||
    pickString(nestedMetadata, ["username", "user_name", "handle", "preferred_username"]) ||
    pickString(nestedUser, ["username", "userName", "handle"]);

  const displayName =
    pickString(record, ["displayName", "display_name", "name", "fullName", "full_name"]) ||
    pickString(nestedMetadata, ["displayName", "display_name", "name", "fullName", "full_name"]) ||
    pickString(nestedUser, ["displayName", "display_name", "name", "fullName", "full_name"]);

  const avatarUrl =
    pickString(record, ["avatarUrl", "avatar_url", "image", "picture"]) ||
    pickString(nestedMetadata, ["avatarUrl", "avatar_url", "image", "picture"]) ||
    pickString(nestedUser, ["avatarUrl", "avatar_url", "image", "picture"]);

  if (!username && !displayName) return null;
  return {
    username: username || displayName.replace(/\s+/g, "").toLowerCase(),
    displayName: displayName || username,
    avatarUrl: avatarUrl || undefined,
  };
}

function readSupabaseProfile(): SiteAccountProfile | null {
  const keys: string[] = [];
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (key && key.startsWith("sb-") && key.includes("auth-token")) keys.push(key);
  }

  for (const key of keys) {
    const stored = parseRecord(window.localStorage.getItem(key));
    const direct = normaliseProfile(stored);
    if (direct) return direct;

    const accessToken = pickString(stored, ["access_token", "accessToken"]);
    const jwtProfile = normaliseProfile(parseJwt(accessToken));
    if (jwtProfile) return jwtProfile;
  }

  return null;
}

export function getClientAccountProfile(): SiteAccountProfile | null {
  if (typeof window === "undefined") return null;

  for (const key of STORAGE_KEYS) {
    const profile = normaliseProfile(parseRecord(window.localStorage.getItem(key)));
    if (profile) return profile;
  }

  const supabaseProfile = readSupabaseProfile();
  if (supabaseProfile) return supabaseProfile;

  const cookies = readCookieMap();
  const cookieProfile = normaliseProfile({
    username: cookies.esb_username || cookies.username,
    displayName: cookies.esb_display_name || cookies.displayName || cookies.name,
    avatarUrl: cookies.esb_avatar_url || cookies.avatarUrl,
  });
  if (cookieProfile) return cookieProfile;

  for (const [key, value] of Object.entries(cookies)) {
    if (!key.startsWith("sb-") || !key.includes("auth-token")) continue;
    const decoded = value.startsWith("base64-") ? decodeBase64Url(value.slice(7)) : value;
    const record = parseRecord(decoded);
    const profile = normaliseProfile(record) || normaliseProfile(parseJwt(pickString(record, ["access_token", "accessToken"])));
    if (profile) return profile;
  }

  const signedIn = [cookies.esb_signed_in, cookies.signed_in, cookies.session].some((value) => value === "1" || value === "true" || Boolean(value));
  if (signedIn) {
    return {
      username: cookies.esb_username || "player",
      displayName: cookies.esb_display_name || cookies.displayName || "My Account",
      avatarUrl: cookies.esb_avatar_url || undefined,
    };
  }

  return null;
}

export function isClientSignedIn() {
  return Boolean(getClientAccountProfile());
}
