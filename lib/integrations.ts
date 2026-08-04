function integrationConfig() {
  const url = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    ?? process.env.SUPABASE_SECRET_KEY
    ?? process.env.SUPABASE_SERVICE_KEY;
  return url && serviceKey ? { url, serviceKey } : null;
}

function apiKeyHeaders(key: string): Record<string, string> {
  return key.startsWith("sb_secret_") || key.startsWith("sb_publishable_")
    ? { apikey: key }
    : { apikey: key, Authorization: `Bearer ${key}` };
}

export const hasSupabase = Boolean(integrationConfig());

export async function supabaseInsert(table: string, data: Record<string, unknown>) {
  const config = integrationConfig();
  if (!config) return { configured: false };
  const response = await fetch(`${config.url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      ...apiKeyHeaders(config.serviceKey),
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Supabase insert failed: ${await response.text()}`);
  return { configured: true };
}

export async function supabaseSelectOne(table: string, column: string, value: string) {
  const config = integrationConfig();
  if (!config) return null;
  const url = `${config.url}/rest/v1/${table}?${encodeURIComponent(column)}=eq.${encodeURIComponent(value)}&select=*&limit=1`;
  const response = await fetch(url, {
    headers: apiKeyHeaders(config.serviceKey),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Supabase query failed: ${await response.text()}`);
  const rows = await response.json();
  return rows[0] ?? null;
}
