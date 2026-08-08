import "server-only";
import { randomBytes, randomInt, randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { createSignedObjectUrl, sha256, supabaseInsert, supabaseRpc, supabaseSelect, supabaseUpdate, uploadPrivateObject, verifySupabaseAccessToken } from "./supabase";

export const supportCategories = [
  { id: "account-access", name: "Account & Access" },
  { id: "billing-payments", name: "Billing & Payments" },
  { id: "creator-developer", name: "Creator & Developer Support" },
  { id: "safety-abuse", name: "Safety & Abuse" },
  { id: "technical-issues", name: "Technical Issues" },
  { id: "something-else", name: "Something Else" },
] as const;

export const SUPPORT_GUEST_COOKIE = "esb_support_guest_session";
const evidenceBucket = process.env.SUPPORT_EVIDENCE_BUCKET ?? "support-ticket-evidence";

export class SupportRateLimitError extends Error {
  retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    super("Too many requests. Please wait before trying again.");
    this.name = "SupportRateLimitError";
    this.retryAfterSeconds = Math.max(1, retryAfterSeconds);
  }
}

export function supportNetworkKey(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || "unknown-network";
}

export async function takeSupportRateLimit(input: {
  scope: string;
  key: string;
  windowSeconds: number;
  maxRequests: number;
  blockSeconds?: number;
}) {
  const rawResult = await supabaseRpc<unknown>("support_take_rate_limit_v2", {
    p_scope: input.scope,
    p_key_hash: sha256(input.key),
    p_window_seconds: input.windowSeconds,
    p_max_requests: input.maxRequests,
    p_block_seconds: input.blockSeconds ?? 900,
  });
  const result = normaliseRpcObject(rawResult, "support rate-limit");
  if (result.allowed !== true) {
    throw new SupportRateLimitError(Number(result.retryAfterSeconds ?? 60));
  }
}

export type SupportTicketRow = {
  id: string;
  ticket_reference: string;
  access_token_hash: string | null;
  requester_account_id: string | null;
  requester_name: string;
  requester_email: string | null;
  requester_email_verified: boolean;
  category_id: string;
  team: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  assigned_staff_id: string | null;
  last_message_at: string;
  created_at: string;
  updated_at: string;
};

export type SupportMessageRow = {
  id: string;
  ticket_id: string;
  sender_type: "Account" | "Guest" | "Staff" | "System";
  sender_name: string;
  body: string;
  created_at: string;
  edited_at?: string | null;
};

export type SupportAttachmentRow = {
  id: string;
  attachment_reference: string;
  ticket_id: string;
  message_id: string | null;
  original_file_name: string;
  mime_type: string;
  size_bytes: number;
  scan_state: string;
  moderation_state: string;
  safety_sensitive: boolean;
  storage_bucket: string;
  storage_object_path: string;
  created_at: string;
};

export function generateAccessToken() { return randomBytes(32).toString("hex"); }
export function generateVerificationCode() { return randomInt(100000, 1000000).toString(); }
export function generateGuestSessionToken() { return randomBytes(32).toString("hex"); }

function normaliseRpcObject(value: unknown, operation: string): Record<string, unknown> {
  let result = value;
  if (Array.isArray(result)) result = result[0];
  if (typeof result === "string") {
    try { result = JSON.parse(result); } catch { /* handled below */ }
  }
  if (!result || typeof result !== "object" || Array.isArray(result)) {
    throw new Error(`The ${operation} service returned an invalid response.`);
  }
  return result as Record<string, unknown>;
}

export type CreatedSupportTicket = {
  ticketId: string;
  ticketReference: string;
  accessToken: string;
  requesterEmail: string;
  requesterAccountId: string | null;
  status: string;
  requiresEmailVerification: boolean;
  pipelineVersion: number;
};

export async function createSupportTicket(input: {
  request: NextRequest;
  name: string;
  email: string;
  categoryId: string;
  subject: string;
  description: string;
}): Promise<CreatedSupportTicket> {
  const account = await verifySupabaseAccessToken(input.request.headers.get("authorization"));
  const displayName = account
    ? String(account.userMetadata.display_name ?? account.userMetadata.full_name ?? account.userMetadata.username ?? input.name).trim()
    : input.name.trim();
  const email = String(account?.email ?? input.email).trim().toLowerCase();

  // Generate the private token in the trusted About server and send only its
  // SHA-256 hash to Supabase. This avoids relying on the database extension
  // search path for pgcrypto during ticket creation.
  const accessToken = generateAccessToken();
  const rawResult = await supabaseRpc<unknown>("support_create_ticket_v3", {
    p_requester_account_id: account?.id ?? null,
    p_requester_name: displayName,
    p_requester_email: email || null,
    p_category_id: input.categoryId,
    p_subject: input.subject.trim(),
    p_description: input.description.trim(),
    p_requester_locale: input.request.headers.get("accept-language")?.split(",")[0] ?? "en-GB",
    p_requester_region: input.request.headers.get("x-vercel-ip-country") ?? null,
    p_source: "About Website",
    p_access_token_hash: sha256(accessToken),
  });
  const result = normaliseRpcObject(rawResult, "support ticket creation");
  const ticketId = String(result.ticketId ?? "").trim();
  const ticketReference = String(result.ticketReference ?? "").trim();
  const requesterEmail = String(result.requesterEmail ?? email).trim().toLowerCase();
  const requesterAccountId = result.requesterAccountId
    ? String(result.requesterAccountId)
    : null;
  const status = String(result.status ?? "").trim();
  const requiresEmailVerification = result.requiresEmailVerification === true;
  const parsedPipelineVersion = Number(result.pipelineVersion ?? 3);

  if (!ticketId || !ticketReference) {
    throw new Error("The support ticket creation service returned an incomplete ticket record.");
  }

  return {
    ticketId,
    ticketReference,
    accessToken,
    requesterEmail,
    requesterAccountId,
    status,
    requiresEmailVerification,
    pipelineVersion: Number.isFinite(parsedPipelineVersion) ? parsedPipelineVersion : 3,
  };
}

export async function getTicketByAccessToken(accessToken: string) {
  const tokenHash = sha256(accessToken);
  const rows = await supabaseSelect<SupportTicketRow>("support_tickets", `select=*&access_token_hash=eq.${encodeURIComponent(tokenHash)}&limit=1`);
  if (rows[0]) return rows[0];

  const aliases = await supabaseSelect<{ id: string; ticket_id: string; expires_at: string | null; revoked_at: string | null }>(
    "support_ticket_access_tokens",
    `select=id,ticket_id,expires_at,revoked_at&token_hash=eq.${encodeURIComponent(tokenHash)}&limit=1`,
  ).catch(() => []);
  const alias = aliases[0];
  if (!alias || alias.revoked_at || (alias.expires_at && new Date(alias.expires_at).getTime() <= Date.now())) return null;
  const tickets = await supabaseSelect<SupportTicketRow>("support_tickets", `select=*&id=eq.${encodeURIComponent(alias.ticket_id)}&limit=1`);
  if (tickets[0]) await supabaseUpdate("support_ticket_access_tokens", `id=eq.${encodeURIComponent(alias.id)}`, { last_accessed_at: new Date().toISOString() }).catch(() => []);
  return tickets[0] ?? null;
}

export async function authoriseTicketRequest(request: NextRequest, accessToken: string) {
  const ticket = await getTicketByAccessToken(accessToken);
  if (!ticket) return null;
  const account = await verifySupabaseAccessToken(request.headers.get("authorization"));
  if (account && ticket.requester_account_id === account.id) return { ticket, actorType: "Account" as const, actorId: account.id, actorName: String(account.userMetadata.display_name ?? account.userMetadata.username ?? ticket.requester_name) };
  const rawSession = request.cookies.get(SUPPORT_GUEST_COOKIE)?.value;
  if (!rawSession) return null;
  const sessions = await supabaseSelect<{ ticket_id: string; expires_at: string; revoked_at: string | null }>(
    "support_ticket_guest_sessions",
    `select=ticket_id,expires_at,revoked_at&session_token_hash=eq.${encodeURIComponent(sha256(rawSession))}&ticket_id=eq.${encodeURIComponent(ticket.id)}&limit=1`,
  );
  const session = sessions[0];
  if (!session || session.revoked_at || new Date(session.expires_at).getTime() <= Date.now()) return null;
  await supabaseUpdate("support_ticket_guest_sessions", `session_token_hash=eq.${encodeURIComponent(sha256(rawSession))}`, { last_seen_at: new Date().toISOString() }).catch(() => []);
  return { ticket, actorType: "Guest" as const, actorId: ticket.requester_email ?? ticket.id, actorName: ticket.requester_name };
}

export async function getTicketConversation(ticketId: string) {
  const [messages, attachments] = await Promise.all([
    supabaseSelect<SupportMessageRow>("support_ticket_messages", `select=*&ticket_id=eq.${encodeURIComponent(ticketId)}&deleted_at=is.null&order=created_at.asc`),
    supabaseSelect<SupportAttachmentRow>("support_ticket_attachments", `select=*&ticket_id=eq.${encodeURIComponent(ticketId)}&archived_at=is.null&order=created_at.asc`),
  ]);
  return { messages, attachments };
}

const allowedEvidenceTypes = new Set([
  "image/png","image/jpeg","image/webp","image/gif","image/avif",
  "video/mp4","video/webm","video/quicktime",
  "audio/mpeg","audio/wav","audio/ogg","audio/mp4",
  "application/pdf","text/plain","text/csv","application/json",
  "application/zip","application/x-zip-compressed",
]);

export async function uploadSupportAttachments(input: {
  ticketId: string;
  messageId: string | null;
  files: File[];
  uploaderType: "Account" | "Guest" | "Staff";
  uploaderAccountId?: string | null;
  uploaderStaffId?: string | null;
  safetySensitive?: boolean;
}) {
  if (input.files.length > 8) throw new Error("A maximum of eight files can be attached to one message.");
  const uploaded: SupportAttachmentRow[] = [];
  for (const file of input.files) {
    if (!allowedEvidenceTypes.has(file.type)) throw new Error(`${file.name} uses a file type that is not supported.`);
    if (file.size <= 0 || file.size > 100 * 1024 * 1024) throw new Error(`${file.name} must be smaller than 100 MB.`);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-140) || "evidence";
    const reference = `ATT-${randomUUID()}`;
    const path = `${input.ticketId}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safeName}`;
    const bytes = await file.arrayBuffer();
    const clone = new File([bytes], file.name, { type: file.type });
    await uploadPrivateObject({ bucket: evidenceBucket, path, file: clone });
    const rows = await supabaseInsert<SupportAttachmentRow>("support_ticket_attachments", {
      attachment_reference: reference,
      ticket_id: input.ticketId,
      message_id: input.messageId,
      uploader_type: input.uploaderType,
      uploader_account_id: input.uploaderAccountId ?? null,
      uploader_staff_id: input.uploaderStaffId ?? null,
      storage_bucket: evidenceBucket,
      storage_object_path: path,
      original_file_name: safeName,
      mime_type: file.type,
      size_bytes: file.size,
      sha256: sha256(bytes),
      scan_state: "Pending",
      moderation_state: "Evidence Unreviewed",
      safety_sensitive: Boolean(input.safetySensitive),
      access_classification: input.safetySensitive ? "Safety Evidence Restricted" : "Support Restricted",
    });
    if (rows[0]) uploaded.push(rows[0]);
  }
  return uploaded;
}

export async function addPublicTicketMessage(input: {
  ticket: SupportTicketRow;
  actorType: "Account" | "Guest";
  actorId: string;
  actorName: string;
  body: string;
  files: File[];
}) {
  const rows = await supabaseInsert<SupportMessageRow>("support_ticket_messages", {
    ticket_id: input.ticket.id,
    sender_type: input.actorType,
    sender_account_id: input.actorType === "Account" ? input.actorId : null,
    sender_name: input.actorName,
    body: input.body.trim(),
    client_message_id: randomUUID(),
  });
  const message = rows[0];
  if (!message) throw new Error("The message could not be recorded.");
  const attachments = await uploadSupportAttachments({
    ticketId: input.ticket.id,
    messageId: message.id,
    files: input.files,
    uploaderType: input.actorType,
    uploaderAccountId: input.actorType === "Account" ? input.actorId : null,
    safetySensitive: input.ticket.category_id === "safety-abuse",
  });
  return { message, attachments };
}

export async function getAttachmentUrl(attachment: SupportAttachmentRow) {
  return createSignedObjectUrl(attachment.storage_bucket, attachment.storage_object_path, 300);
}
