import "server-only";

const supabaseUrl = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)?.replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  ?? process.env.SUPABASE_SECRET_KEY
  ?? process.env.SUPABASE_SERVICE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ?? process.env.SUPABASE_ANON_KEY
  ?? process.env.SUPABASE_PUBLISHABLE_KEY;

export const contentBackendConfigured = Boolean(supabaseUrl && (serviceKey || anonKey));

function apiKeyHeaders(key: string): Record<string, string> {
  return key.startsWith("sb_secret_") || key.startsWith("sb_publishable_")
    ? { apikey: key }
    : { apikey: key, Authorization: `Bearer ${key}` };
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function contentSelect<T>(
  table: string,
  query: string,
  options?: { revalidate?: number; tags?: string[]; cache?: RequestCache },
): Promise<T[]> {
  if (!contentBackendConfigured) return [];
  const key = serviceKey || anonKey!;
  const url = `${supabaseUrl}/rest/v1/${table}?${query}`;
  const headers = {
    ...apiKeyHeaders(key),
    Accept: "application/json",
  };

  try {
    const response = await fetch(url, {
      headers,
      cache: options?.cache,
      next: options?.cache === "no-store" ? undefined : {
        revalidate: options?.revalidate ?? 300,
        tags: options?.tags,
      },
    });

    if (!response.ok) {
      throw new Error(`Content service request failed with ${response.status}`);
    }

    return await response.json() as T[];
  } catch (error) {
    if (options?.cache === "no-store") throw error;

    // A transient Next.js data-cache/read failure must not turn one published
    // article into a cached "temporarily unavailable" page. Retry once against
    // the live content service without the data cache before giving up.
    console.warn(`[content] ${table} cached request failed; retrying uncached: ${errorMessage(error)}`);

    try {
      const response = await fetch(url, {
        headers,
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Content service retry failed with ${response.status}`);
      }

      return await response.json() as T[];
    } catch (retryError) {
      console.error(`[content] ${table} uncached retry failed: ${errorMessage(retryError)}`);
      throw retryError;
    }
  }
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
      ...apiKeyHeaders(key),
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
