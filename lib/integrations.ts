export const hasSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function supabaseInsert(table: string, data: Record<string, unknown>) {
  if (!hasSupabase) return { configured: false };
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, "");
  const response = await fetch(`${base}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
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
  if (!hasSupabase) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, "");
  const url = `${base}/rest/v1/${table}?${encodeURIComponent(column)}=eq.${encodeURIComponent(value)}&select=*&limit=1`;
  const response = await fetch(url, {
    headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Supabase query failed: ${await response.text()}`);
  const rows = await response.json();
  return rows[0] ?? null;
}
