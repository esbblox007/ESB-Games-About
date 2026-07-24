import "server-only";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const contentBackendConfigured = Boolean(supabaseUrl && (serviceKey || anonKey));

export async function contentSelect<T>(
  table: string,
  query: string,
  options?: { revalidate?: number; tags?: string[]; cache?: RequestCache },
): Promise<T[]> {
  if (!contentBackendConfigured) return [];
  const key = serviceKey || anonKey!;
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
    },
    cache: options?.cache,
    next: options?.cache === "no-store" ? undefined : {
      revalidate: options?.revalidate ?? 300,
      tags: options?.tags,
    },
  });

  if (!response.ok) {
    throw new Error(`Content service request failed with ${response.status}`);
  }

  return response.json() as Promise<T[]>;
}

export async function contentSelectPage<T>(
  table: string,
  query: string,
  from: number,
  to: number,
  options?: { revalidate?: number; tags?: string[] },
): Promise<{ rows: T[]; total: number }> {
  if (!contentBackendConfigured) return { rows: [], total: 0 };
  const key = serviceKey || anonKey!;
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
      Prefer: "count=exact",
      Range: `${from}-${to}`,
    },
    next: { revalidate: options?.revalidate ?? 300, tags: options?.tags },
  });
  if (!response.ok) throw new Error(`Content service request failed with ${response.status}`);
  const range = response.headers.get("content-range") || "*/0";
  const total = Number(range.split("/")[1] || 0);
  return { rows: await response.json() as T[], total: Number.isFinite(total) ? total : 0 };
}
