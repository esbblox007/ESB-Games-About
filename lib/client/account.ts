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
  const username = pickString(record, ["username", "userName", "handle"]);
  const displayName = pickString(record, ["displayName", "display_name", "name", "fullName"]);
  const avatarUrl = pickString(record, ["avatarUrl", "avatar_url", "image"]);
  if (!username && !displayName) return null;
  return {
    username: username || displayName.replace(/\s+/g, "").toLowerCase(),
    displayName: displayName || username,
    avatarUrl: avatarUrl || undefined,
  };
}

export function getClientAccountProfile(): SiteAccountProfile | null {
  if (typeof window === "undefined") return null;

  for (const key of STORAGE_KEYS) {
    const profile = normaliseProfile(parseRecord(window.localStorage.getItem(key)));
    if (profile) return profile;
  }

  const cookies = readCookieMap();
  const cookieProfile = normaliseProfile({
    username: cookies.esb_username || cookies.username,
    displayName: cookies.esb_display_name || cookies.displayName || cookies.name,
    avatarUrl: cookies.esb_avatar_url || cookies.avatarUrl,
  });
  if (cookieProfile) return cookieProfile;

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
