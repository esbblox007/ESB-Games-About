import "server-only";
import { createHash } from "node:crypto";

export type SupabaseServerConfig = { url: string; serviceKey: string; anonKey?: string };

export function getSupabaseServerConfig(): SupabaseServerConfig | null {
  const url = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && serviceKey ? { url, serviceKey, anonKey } : null;
}

export async function supabaseServiceRequest(path: string, init: RequestInit = {}) {
  const config = getSupabaseServerConfig();
  if (!config) throw new Error("The shared ESB Games Supabase connection is not configured.");
  const response = await fetch(`${config.url}${path}`, {
    ...init,
    headers: {
      apikey: config.serviceKey,
      Authorization: `Bearer ${config.serviceKey}`,
      Accept: "application/json",
      ...(init.body && !(init.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Supabase returned ${response.status}${details ? `: ${details.slice(0, 300)}` : ""}`);
  }
  return response;
}

export async function supabaseSelect<T>(table: string, query: string): Promise<T[]> {
  const response = await supabaseServiceRequest(`/rest/v1/${encodeURIComponent(table)}?${query}`);
  return response.json() as Promise<T[]>;
}

export async function supabaseInsert<T = unknown>(table: string, payload: Record<string, unknown>): Promise<T[]> {
  const response = await supabaseServiceRequest(`/rest/v1/${encodeURIComponent(table)}`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(payload),
  });
  return response.json() as Promise<T[]>;
}

export async function supabaseUpdate<T = unknown>(table: string, query: string, payload: Record<string, unknown>): Promise<T[]> {
  const response = await supabaseServiceRequest(`/rest/v1/${encodeURIComponent(table)}?${query}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(payload),
  });
  return response.json() as Promise<T[]>;
}

export async function supabaseRpc<T = unknown>(name: string, payload: Record<string, unknown>): Promise<T> {
  const response = await supabaseServiceRequest(`/rest/v1/rpc/${encodeURIComponent(name)}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.json() as Promise<T>;
}

export function sha256(value: string | ArrayBuffer | Uint8Array) {
  const input = typeof value === "string" ? value : Buffer.from(value instanceof ArrayBuffer ? new Uint8Array(value) : value);
  return createHash("sha256").update(input).digest("hex");
}

export type VerifiedAccount = { id: string; email?: string; userMetadata: Record<string, unknown> };

export async function verifySupabaseAccessToken(header: string | null): Promise<VerifiedAccount | null> {
  const token = header?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  const config = getSupabaseServerConfig();
  if (!token || !config?.anonKey) return null;
  const response = await fetch(`${config.url}/auth/v1/user`, {
    headers: { apikey: config.anonKey, Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) return null;
  const user = await response.json() as { id?: string; email?: string; user_metadata?: Record<string, unknown> };
  return user.id ? { id: user.id, email: user.email, userMetadata: user.user_metadata ?? {} } : null;
}

export async function uploadPrivateObject(input: {
  bucket: string;
  path: string;
  file: File;
}) {
  const config = getSupabaseServerConfig();
  if (!config) throw new Error("File storage is not configured.");
  const objectPath = input.path.split("/").map(encodeURIComponent).join("/");
  const response = await fetch(`${config.url}/storage/v1/object/${encodeURIComponent(input.bucket)}/${objectPath}`, {
    method: "POST",
    headers: {
      apikey: config.serviceKey,
      Authorization: `Bearer ${config.serviceKey}`,
      "Content-Type": input.file.type || "application/octet-stream",
      "x-upsert": "false",
    },
    body: await input.file.arrayBuffer(),
    cache: "no-store",
  });
  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Secure file upload failed${details ? `: ${details.slice(0, 180)}` : ""}`);
  }
}

export async function createSignedObjectUrl(bucket: string, path: string, expiresIn = 300) {
  const config = getSupabaseServerConfig();
  if (!config) throw new Error("File storage is not configured.");
  const objectPath = path.split("/").map(encodeURIComponent).join("/");
  const response = await fetch(`${config.url}/storage/v1/object/sign/${encodeURIComponent(bucket)}/${objectPath}`, {
    method: "POST",
    headers: {
      apikey: config.serviceKey,
      Authorization: `Bearer ${config.serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expiresIn }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("The attachment link could not be created.");
  const body = await response.json() as { signedURL?: string; signedUrl?: string };
  const signed = body.signedURL ?? body.signedUrl;
  if (!signed) throw new Error("The attachment link could not be created.");
  return signed.startsWith("http") ? signed : `${config.url}/storage/v1${signed}`;
}
