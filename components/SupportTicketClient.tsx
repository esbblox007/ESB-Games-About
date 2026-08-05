"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { authHeaders } from "@/lib/client-auth";

type Attachment = { id: string; name: string; type: string; size: number; scanState: string; moderationState: string; sensitive: boolean; href: string };
type Message = { id: string; senderType: "Account" | "Guest" | "Staff" | "System"; senderName: string; body: string; createdAt: string; editedAt?: string | null; attachments: Attachment[] };
type TicketData = {
  ticket: { reference: string; subject: string; categoryId: string; team: string; status: string; priority: string; createdAt: string; updatedAt: string };
  messages: Message[];
};

type CodeResponse = { error?: string; maskedEmail?: string; expiresInSeconds?: number; deliveryReference?: string; reference?: string };

export default function SupportTicketClient({ accessToken }: { accessToken: string }) {
  const [data, setData] = useState<TicketData | null>(null);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [countdown, setCountdown] = useState(0);
  const [deliveryReference, setDeliveryReference] = useState<string | null>(null);
  const messageCountRef = useRef(0);
  const endRef = useRef<HTMLDivElement | null>(null);

  const endpoint = `/api/support/tickets/${encodeURIComponent(accessToken)}`;
  const load = useCallback(async (announce = false) => {
    try {
      const response = await fetch(endpoint, { headers: authHeaders(), cache: "no-store" });
      const body = await response.json() as TicketData & { error?: string; verificationRequired?: boolean };
      if (response.status === 401) {
        setVerificationRequired(true);
        setData(null);
        return;
      }
      if (!response.ok) throw new Error(body.error ?? "The ticket could not be loaded.");
      if (announce && body.messages.length > messageCountRef.current && messageCountRef.current > 0) notifyReply(body.ticket.reference);
      messageCountRef.current = body.messages.length;
      setVerificationRequired(false);
      setData(body);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The ticket could not be loaded.");
    }
  }, [endpoint]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (!data) return;
    const timer = window.setInterval(() => void load(true), 15000);
    return () => window.clearInterval(timer);
  }, [data, load]);
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = window.setInterval(() => setCountdown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [countdown]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [data?.messages.length]);

  async function requestCode() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`${endpoint}/request-code`, { method: "POST", cache: "no-store" });
      const body = await response.json() as CodeResponse;
      if (!response.ok) throw new Error(body.error ?? "The verification code could not be sent.");
      setCodeSent(true);
      setMaskedEmail(body.maskedEmail ?? null);
      setCountdown(body.expiresInSeconds ?? 180);
      setDeliveryReference(body.deliveryReference ?? null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The verification code could not be sent.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`${endpoint}/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        cache: "no-store",
      });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "The code could not be verified.");
      setCode("");
      setCodeSent(false);
      setDeliveryReference(null);
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The code could not be verified.");
    } finally {
      setBusy(false);
    }
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const formElement = event.currentTarget;
    try {
      const form = new FormData(formElement);
      files.forEach((file) => form.append("files", file));
      const response = await fetch(endpoint, { method: "POST", headers: authHeaders(), body: form });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "The reply could not be sent.");
      formElement.reset();
      setFiles([]);
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The reply could not be sent.");
    } finally {
      setBusy(false);
    }
  }

  async function openAttachment(attachment: Attachment) {
    setError(null);
    try {
      const response = await fetch(attachment.href, { headers: authHeaders(), redirect: "follow" });
      if (!response.ok) throw new Error("The attachment could not be opened.");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = attachment.name;
      anchor.rel = "noopener";
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The attachment could not be opened.");
    }
  }

  if (verificationRequired) {
    return <VerificationWorkspace
      busy={busy}
      code={code}
      codeSent={codeSent}
      countdown={countdown}
      deliveryReference={deliveryReference}
      error={error}
      maskedEmail={maskedEmail}
      onCodeChange={setCode}
      onRequestCode={requestCode}
      onVerifyCode={verifyCode}
    />;
  }

  if (!data) {
    return <section className="support-case-page"><div className="container support-case-loading"><span className="support-case-loader" /><div><strong>Opening your private support case</strong><p>Checking secure access and loading the conversation.</p></div>{error && <div className="form-alert error" role="alert">{error}</div>}</div></section>;
  }

  const canReply = !["Closed", "Spam"].includes(data.ticket.status);
  const lastMessage = data.messages.at(-1);

  return <section className="support-case-page">
    <div className="container support-customer-workspace">
      <header className="support-customer-commandbar">
        <div className="support-case-brand"><span>ESB</span><div><small>ESB GAMES SUPPORT</small><strong>Private customer case</strong></div></div>
        <div className="support-case-command-actions"><span className="support-secure-state"><i /> Secure session</span><a href="/support">Support centre</a></div>
      </header>

      <div className="support-customer-case-header">
        <div><span className="eyebrow">{data.ticket.reference}</span><h1>{data.ticket.subject}</h1><p>{data.ticket.team} · Opened {formatDate(data.ticket.createdAt)}</p></div>
        <div className="support-customer-badges"><span className={`priority ${data.ticket.priority.toLowerCase()}`}>{data.ticket.priority} priority</span><span className="status">{data.ticket.status}</span></div>
      </div>

      <div className="support-customer-layout">
        <aside className="support-customer-sidebar">
          <section><span className="support-case-label">CASE OVERVIEW</span><dl><div><dt>Reference</dt><dd>{data.ticket.reference}</dd></div><div><dt>Category</dt><dd>{categoryLabel(data.ticket.categoryId)}</dd></div><div><dt>Team</dt><dd>{data.ticket.team}</dd></div><div><dt>Updated</dt><dd>{formatDate(data.ticket.updatedAt)}</dd></div></dl></section>
          <section className="support-case-security"><span className="support-case-label">SECURITY</span><strong>Private and access-restricted</strong><p>Only you and authorised ESB Games staff assigned to this case can access the conversation.</p></section>
          <section><span className="support-case-label">LATEST ACTIVITY</span><strong>{lastMessage ? `${lastMessage.senderName} replied` : "Case created"}</strong><p>{lastMessage ? formatDate(lastMessage.createdAt) : formatDate(data.ticket.createdAt)}</p></section>
          <a className="support-case-help" href="mailto:support@esbgames.com?subject=Support%20case%20access%20help">Having trouble with this case?<span>Contact Support Operations →</span></a>
        </aside>

        <main className="support-customer-conversation">
          <div className="support-conversation-notice"><span>✓</span><div><strong>Secure support conversation</strong><p>Evidence is private and may be held for authorised review. Never share passwords, full payment-card details or verification codes.</p></div></div>
          <div className="support-customer-thread" aria-live="polite">
            <div className="support-thread-date"><span>Case opened · {formatDate(data.ticket.createdAt)}</span></div>
            {data.messages.map((message) => <article key={message.id} className={`support-customer-message ${message.senderType.toLowerCase()}`}>
              <div className="support-message-avatar">{message.senderType === "Staff" ? "ESB" : initials(message.senderName)}</div>
              <div className="support-message-content"><header><div><strong>{message.senderName}</strong><span>{message.senderType === "Staff" ? "ESB Games Support" : message.senderType === "System" ? "Case system" : "Customer"}</span></div><time dateTime={message.createdAt}>{formatDate(message.createdAt)}</time></header><p>{message.body}</p>
                {message.attachments.length > 0 && <div className="support-customer-files">{message.attachments.map((attachment) => <button key={attachment.id} type="button" onClick={() => openAttachment(attachment)}><span>↗</span><div><strong>{attachment.name}</strong><small>{formatBytes(attachment.size)} · {attachment.scanState}{attachment.sensitive ? " · Restricted evidence" : ""}</small></div></button>)}</div>}
              </div>
            </article>)}
            <div ref={endRef} />
          </div>

          {canReply ? <form className="support-customer-composer" onSubmit={sendMessage}>
            <div className="support-composer-heading"><div><strong>Reply to ESB Games Support</strong><span>Your message will be added to the private case.</span></div><span>20,000 characters maximum</span></div>
            <textarea id="support-reply" name="body" maxLength={20000} placeholder="Write a clear reply, include any requested information, or provide an update…" />
            {files.length > 0 && <ul className="support-selected-files">{files.map((file) => <li key={`${file.name}-${file.lastModified}`}><span>{file.name}</span><small>{formatBytes(file.size)}</small></li>)}</ul>}
            <div className="support-customer-composer-actions"><label><span>＋</span> Add evidence<input type="file" multiple accept="image/*,video/mp4,video/webm,video/quicktime,audio/*,.pdf,.txt,.csv,.json,.zip" onChange={(event: ChangeEvent<HTMLInputElement>) => setFiles(Array.from(event.currentTarget.files ?? []).slice(0, 8))} /></label><small>Up to 8 private files · 100 MB each</small><button className="button button-primary" disabled={busy}>{busy ? "Sending securely…" : "Send secure reply"}</button></div>
          </form> : <div className="support-customer-closed"><strong>This case is {data.ticket.status.toLowerCase()}.</strong><p>Contact Support Operations with the reference above if you believe further review is required.</p></div>}
          {error && <div className="form-alert error support-inline-error" role="alert">{error}</div>}
        </main>
      </div>
    </div>
  </section>;
}

function VerificationWorkspace(input: {
  busy: boolean;
  code: string;
  codeSent: boolean;
  countdown: number;
  deliveryReference: string | null;
  error: string | null;
  maskedEmail: string | null;
  onCodeChange: (value: string) => void;
  onRequestCode: () => void;
  onVerifyCode: (event: FormEvent) => void;
}) {
  const time = `${Math.floor(input.countdown / 60)}:${String(input.countdown % 60).padStart(2, "0")}`;
  return <section className="support-case-page support-verification-page">
    <div className="container support-verification-workspace">
      <header className="support-customer-commandbar"><div className="support-case-brand"><span>ESB</span><div><small>ESB GAMES SUPPORT</small><strong>Private case access</strong></div></div><div className="support-case-command-actions"><span className="support-secure-state"><i /> Protected by email verification</span><a href="/support">Support centre</a></div></header>
      <div className="support-verification-layout">
        <main className="support-verification-primary">
          <span className="support-verification-icon">⌁</span>
          <span className="eyebrow">IDENTITY VERIFICATION</span>
          <h1>Securely access your support case.</h1>
          <p className="support-verification-lead">This private link identifies the case. A short-lived one-time code confirms that you control the email address used when the request was created.</p>

          {!input.codeSent ? <div className="support-verification-action">
            <div><strong>Send a one-time access code</strong><p>The code will expire after three minutes and cannot be reused.</p></div>
            <button className="button button-primary" disabled={input.busy} onClick={input.onRequestCode}>{input.busy ? "Requesting code…" : "Send verification code"}</button>
          </div> : <form onSubmit={input.onVerifyCode} className="support-enterprise-code-form">
            <div className="support-code-delivery"><span>✓</span><div><strong>Code sent to {input.maskedEmail ?? "your email address"}</strong><p>Check your inbox and spam folder. Delivery can take up to one minute.</p></div></div>
            <label htmlFor="support-code">Enter your six-digit code</label>
            <input id="support-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={input.code} onChange={(event: ChangeEvent<HTMLInputElement>) => input.onCodeChange(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" required autoFocus />
            <div className="support-code-controls"><button className="button button-primary" disabled={input.busy || input.code.length !== 6}>{input.busy ? "Verifying…" : "Open private case"}</button><button className="button button-secondary" type="button" disabled={input.busy || input.countdown > 120} onClick={input.onRequestCode}>Send another code</button></div>
            <div className="support-code-timer"><span className={input.countdown <= 30 ? "ending" : ""}>{input.countdown > 0 ? `Code expires in ${time}` : "Code expired"}</span>{input.deliveryReference && <small>Delivery reference: {input.deliveryReference}</small>}</div>
          </form>}
          {input.error && <div className="form-alert error support-verification-error" role="alert">{input.error}</div>}
        </main>

        <aside className="support-verification-aside">
          <span className="support-case-label">SECURE ACCESS PROCESS</span>
          <ol><li className="active"><span>1</span><div><strong>Request code</strong><p>We send a single-use code to the ticket email.</p></div></li><li className={input.codeSent ? "active" : ""}><span>2</span><div><strong>Confirm identity</strong><p>Enter the six-digit code before it expires.</p></div></li><li><span>3</span><div><strong>Open conversation</strong><p>Read and reply within a ticket-specific secure session.</p></div></li></ol>
          <div className="support-verification-security"><strong>Your security matters</strong><p>ESB Games staff will never ask for your password, full payment-card details or this verification code.</p></div>
          <div className="support-verification-help"><strong>Unable to receive the email?</strong><p>Confirm that you are checking the same email address used to submit the case. You can also contact <a href="mailto:support@esbgames.com">support@esbgames.com</a>.</p></div>
        </aside>
      </div>
    </div>
  </section>;
}

function categoryLabel(id: string) {
  return ({
    "account-access": "Account & Access",
    "billing-payments": "Billing & Payments",
    "creator-developer": "Creator & Developer Support",
    "safety-abuse": "Safety & Abuse",
    "technical-issues": "Technical Issues",
    "something-else": "Something Else",
  } as Record<string, string>)[id] ?? id;
}

function formatDate(value: string) { return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
function formatBytes(bytes: number) { return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`; }
function initials(value: string) { return value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "ES"; }
function notifyReply(reference: string) {
  try {
    const AudioContextConstructor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextConstructor) {
      const context = new AudioContextConstructor();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = 660;
      gain.gain.value = 0.035;
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.12);
    }
    if ("Notification" in window && Notification.permission === "granted") new Notification(`New reply on ${reference}`, { body: "ESB Games Support has replied to your ticket." });
  } catch { /* Notifications are an enhancement, not a requirement. */ }
}
