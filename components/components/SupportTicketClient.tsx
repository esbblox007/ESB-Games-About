"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { authHeaders } from "@/lib/client-auth";

type Attachment = { id: string; name: string; type: string; size: number; scanState: string; moderationState: string; sensitive: boolean; href: string };
type Message = { id: string; senderType: "Account" | "Guest" | "Staff" | "System"; senderName: string; body: string; createdAt: string; editedAt?: string | null; attachments: Attachment[] };
type TicketData = {
  ticket: { reference: string; subject: string; categoryId: string; team: string; status: string; priority: string; createdAt: string; updatedAt: string };
  messages: Message[];
};

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
  const messageCountRef = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);

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
    setBusy(true); setError(null);
    try {
      const response = await fetch(`${endpoint}/request-code`, { method: "POST" });
      const body = await response.json() as { error?: string; maskedEmail?: string; expiresInSeconds?: number };
      if (!response.ok) throw new Error(body.error ?? "The verification code could not be sent.");
      setCodeSent(true); setMaskedEmail(body.maskedEmail ?? null); setCountdown(body.expiresInSeconds ?? 180);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "The verification code could not be sent."); }
    finally { setBusy(false); }
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(null);
    try {
      const response = await fetch(`${endpoint}/verify-code`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "The code could not be verified.");
      setCode(""); setCodeSent(false); await load();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "The code could not be verified."); }
    finally { setBusy(false); }
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(null);
    const formElement = event.currentTarget;
    try {
      const form = new FormData(formElement);
      files.forEach((file) => form.append("files", file));
      const response = await fetch(endpoint, { method: "POST", headers: authHeaders(), body: form });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "The reply could not be sent.");
      formElement.reset(); setFiles([]); await load();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "The reply could not be sent."); }
    finally { setBusy(false); }
  }

  async function openAttachment(attachment: Attachment) {
    setError(null);
    try {
      const response = await fetch(attachment.href, { headers: authHeaders(), redirect: "follow" });
      if (!response.ok) throw new Error("The attachment could not be opened.");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = attachment.name; anchor.rel = "noopener"; anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "The attachment could not be opened."); }
  }

  if (verificationRequired) return (
    <section className="support-ticket-page section">
      <div className="container support-verification-card">
        <span className="eyebrow">Private ESB Games ticket</span>
        <h1>Verify your email to continue.</h1>
        <p>This private link identifies the ticket, but an on-demand one-time code is required before a guest can read or reply to the conversation.</p>
        {!codeSent ? <button className="button button-primary" disabled={busy} onClick={requestCode}>{busy ? "Sending…" : "Send verification code"}</button> : (
          <form onSubmit={verifyCode} className="support-code-form">
            <label htmlFor="support-code">Six-digit code sent to {maskedEmail ?? "your email"}</label>
            <input id="support-code" className="input support-code-input" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} required />
            <button className="button button-primary" disabled={busy || code.length !== 6}>{busy ? "Verifying…" : "Open ticket"}</button>
            <button className="button button-secondary" type="button" disabled={busy || countdown > 120} onClick={requestCode}>Send another code</button>
            <small>{countdown > 0 ? `Code expires in ${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, "0")}.` : "The code has expired. Request another code."}</small>
          </form>
        )}
        {error && <div className="form-alert error" role="alert">{error}</div>}
      </div>
    </section>
  );

  if (!data) return <section className="support-ticket-page section"><div className="container support-verification-card"><h1>Loading private ticket…</h1>{error && <div className="form-alert error" role="alert">{error}</div>}</div></section>;

  const canReply = !["Closed", "Spam"].includes(data.ticket.status);
  return (
    <section className="support-ticket-page section">
      <div className="container support-chat-shell">
        <header className="support-chat-header">
          <div><span className="eyebrow">{data.ticket.reference}</span><h1>{data.ticket.subject}</h1><p>{data.ticket.team} · Created {formatDate(data.ticket.createdAt)}</p></div>
          <div className="support-ticket-badges"><span>{data.ticket.priority}</span><span>{data.ticket.status}</span></div>
        </header>
        <div className="support-evidence-notice"><strong>Private support conversation</strong><span>Attachments are kept private and may be awaiting technical safety scanning. Never send passwords or full card details.</span></div>
        <div className="support-message-thread" aria-live="polite">
          {data.messages.map((message) => (
            <article key={message.id} className={`support-message ${message.senderType === "Staff" ? "staff" : message.senderType === "System" ? "system" : "user"}`}>
              <header><strong>{message.senderName}</strong><span>{message.senderType === "Staff" ? "ESB Games Support" : message.senderType}</span><time dateTime={message.createdAt}>{formatDate(message.createdAt)}</time></header>
              <p>{message.body}</p>
              {message.attachments.length > 0 && <div className="support-message-files">{message.attachments.map((attachment) => <button key={attachment.id} type="button" onClick={() => openAttachment(attachment)}><strong>{attachment.name}</strong><span>{formatBytes(attachment.size)} · {attachment.scanState}{attachment.sensitive ? " · Sensitive evidence" : ""}</span></button>)}</div>}
            </article>
          ))}
          <div ref={endRef} />
        </div>
        {canReply ? <form className="support-chat-composer" onSubmit={sendMessage}>
          <label htmlFor="support-reply">Reply to the support team</label>
          <textarea id="support-reply" className="input" name="body" maxLength={20000} placeholder="Write your message…" />
          <div className="support-composer-row"><input type="file" multiple accept="image/*,video/mp4,video/webm,video/quicktime,audio/*,.pdf,.txt,.csv,.json,.zip" onChange={(event) => setFiles(Array.from(event.currentTarget.files ?? []).slice(0, 8))} /><button className="button button-primary" disabled={busy}>{busy ? "Sending…" : "Send reply"}</button></div>
          {files.length > 0 && <small>{files.length} attachment{files.length === 1 ? "" : "s"} selected.</small>}
        </form> : <div className="support-evidence-notice"><strong>This ticket is {data.ticket.status.toLowerCase()}.</strong><span>Contact support with the ticket reference if you believe it should be reopened.</span></div>}
        {error && <div className="form-alert error" role="alert">{error}</div>}
      </div>
    </section>
  );
}

function formatDate(value: string) { return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
function formatBytes(bytes: number) { return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`; }
function notifyReply(reference: string) {
  try {
    const AudioContextConstructor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextConstructor) {
      const context = new AudioContextConstructor(); const oscillator = context.createOscillator(); const gain = context.createGain();
      oscillator.frequency.value = 660; gain.gain.value = 0.035; oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.12);
    }
    if ("Notification" in window && Notification.permission === "granted") new Notification(`New reply on ${reference}`, { body: "ESB Games Support has replied to your ticket." });
  } catch { /* Notifications are an enhancement, not a requirement. */ }
}
