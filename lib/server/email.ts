import "server-only";
import { randomBytes } from "node:crypto";

export type EmailDelivery = {
  configured: boolean;
  sent: boolean;
  id?: string;
  statusCode?: number;
  errorCode?: string;
  error?: string;
  requestReference: string;
};

export type ResendConfigurationState = {
  configured: boolean;
  sender: string;
  senderAddress: string;
  senderDomain: string | null;
  domainVerified: boolean | null;
  state: "not_configured" | "invalid_sender" | "verified" | "unverified" | "provider_unavailable";
  detail?: string;
};

type ResendErrorBody = {
  name?: string;
  message?: string;
  statusCode?: number;
};

type ResendDomain = {
  id?: string;
  name?: string;
  status?: string;
  region?: string;
};

function reference(prefix = "ESB-EMAIL") {
  return `${prefix}-${randomBytes(4).toString("hex").toUpperCase()}`;
}

export function supportSender() {
  return process.env.SUPPORT_FROM_EMAIL?.trim() || "ESB Games Support <support@esbgames.com>";
}

export function supportReplyTo() {
  return process.env.SUPPORT_REPLY_TO_EMAIL?.trim() || "support@esbgames.com";
}

export function extractEmailAddress(value: string) {
  const angle = value.match(/<\s*([^<>\s]+@[^<>\s]+)\s*>/);
  if (angle?.[1]) return angle[1].toLowerCase();
  const plain = value.trim().match(/^([^\s<>]+@[^\s<>]+)$/);
  return plain?.[1]?.toLowerCase() ?? "";
}

export function extractSenderDomain(value: string) {
  const address = extractEmailAddress(value);
  const separator = address.lastIndexOf("@");
  return separator > 0 ? address.slice(separator + 1).toLowerCase() : null;
}

async function parseProviderError(response: Response): Promise<ResendErrorBody> {
  const text = await response.text().catch(() => "");
  if (!text) return { statusCode: response.status, message: `Email provider returned ${response.status}.` };
  try {
    const parsed = JSON.parse(text) as ResendErrorBody;
    return {
      name: parsed.name,
      message: parsed.message || text.slice(0, 320),
      statusCode: parsed.statusCode ?? response.status,
    };
  } catch {
    return { statusCode: response.status, message: text.slice(0, 320) };
  }
}

export async function inspectResendConfiguration(): Promise<ResendConfigurationState> {
  const key = process.env.RESEND_API_KEY?.trim();
  const sender = supportSender();
  const senderAddress = extractEmailAddress(sender);
  const senderDomain = extractSenderDomain(sender);

  if (!key) return { configured: false, sender, senderAddress, senderDomain, domainVerified: null, state: "not_configured", detail: "RESEND_API_KEY is missing." };
  if (!senderAddress || !senderDomain) return { configured: true, sender, senderAddress, senderDomain, domainVerified: false, state: "invalid_sender", detail: "SUPPORT_FROM_EMAIL is not a valid email sender." };

  try {
    const response = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (!response.ok) {
      const providerError = await parseProviderError(response);
      return {
        configured: true,
        sender,
        senderAddress,
        senderDomain,
        domainVerified: null,
        state: "provider_unavailable",
        detail: providerError.message,
      };
    }
    const body = await response.json() as { data?: ResendDomain[] } | ResendDomain[];
    const domains = Array.isArray(body) ? body : body.data ?? [];
    const matching = domains.find((domain) => {
      const configuredDomain = domain.name?.toLowerCase();
      return configuredDomain && (senderDomain === configuredDomain || senderDomain.endsWith(`.${configuredDomain}`));
    });
    const verified = matching?.status?.toLowerCase() === "verified";
    return {
      configured: true,
      sender,
      senderAddress,
      senderDomain,
      domainVerified: Boolean(verified),
      state: verified ? "verified" : "unverified",
      detail: matching ? `Resend domain status: ${matching.status ?? "unknown"}.` : `The sender domain ${senderDomain} is not present in this Resend account.`,
    };
  } catch (error) {
    return {
      configured: true,
      sender,
      senderAddress,
      senderDomain,
      domainVerified: null,
      state: "provider_unavailable",
      detail: error instanceof Error ? error.message.slice(0, 320) : "The email provider could not be reached.",
    };
  }
}

export async function sendEmail(input: {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<EmailDelivery> {
  const requestReference = reference();
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return { configured: false, sent: false, errorCode: "not_configured", error: "Resend is not configured.", requestReference };

  const senderAddress = extractEmailAddress(input.from);
  if (!senderAddress) return { configured: true, sent: false, errorCode: "invalid_sender", error: "The configured sender address is invalid.", requestReference };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": requestReference },
      body: JSON.stringify({
        from: input.from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
        reply_to: input.replyTo,
      }),
      cache: "no-store",
    });
    if (!response.ok) {
      const providerError = await parseProviderError(response);
      return {
        configured: true,
        sent: false,
        statusCode: response.status,
        errorCode: providerError.name ?? "provider_rejected",
        error: providerError.message,
        requestReference,
      };
    }
    const body = await response.json() as { id?: string };
    return { configured: true, sent: true, id: body.id, statusCode: response.status, requestReference };
  } catch (error) {
    return {
      configured: true,
      sent: false,
      errorCode: "provider_unreachable",
      error: error instanceof Error ? error.message.slice(0, 320) : "The email service could not be reached.",
      requestReference,
    };
  }
}
