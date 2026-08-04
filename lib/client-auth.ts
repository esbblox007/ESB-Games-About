export function getSupabaseBrowserAccessToken() {
  if (typeof window === "undefined") return null;
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key || !/^sb-.+-auth-token$/.test(key)) continue;
    try {
      const parsed = JSON.parse(window.localStorage.getItem(key) ?? "null") as Record<string, unknown> | null;
      const direct = typeof parsed?.access_token === "string" ? parsed.access_token : null;
      const currentSession = parsed?.currentSession && typeof parsed.currentSession === "object"
        ? parsed.currentSession as Record<string, unknown>
        : null;
      const nested = typeof currentSession?.access_token === "string" ? currentSession.access_token : null;
      if (direct || nested) return direct ?? nested;
    } catch {
      // Ignore unrelated or corrupted browser storage entries.
    }
  }
  return null;
}

export function authHeaders() {
  const token = getSupabaseBrowserAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
