import "server-only";
import type { NextRequest } from "next/server";
import { sha256, supabaseRpc } from "./supabase";

export class PublicRateLimitError extends Error {
  retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    super("Too many requests. Please wait before trying again.");
    this.name = "PublicRateLimitError";
    this.retryAfterSeconds = Math.max(1, retryAfterSeconds);
  }
}

export function publicNetworkKey(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || "unknown-network";
}

export async function takePublicRateLimit(input: {
  scope: string;
  key: string;
  windowSeconds: number;
  maxRequests: number;
  blockSeconds?: number;
}) {
  const result = await supabaseRpc<Record<string, unknown>>("public_take_api_rate_limit", {
    p_scope: input.scope,
    p_key_hash: sha256(input.key),
    p_window_seconds: input.windowSeconds,
    p_max_requests: input.maxRequests,
    p_block_seconds: input.blockSeconds ?? 900,
  });
  if (result.allowed !== true) throw new PublicRateLimitError(Number(result.retryAfterSeconds ?? 60));
}
