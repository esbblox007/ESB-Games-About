"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowIcon, SearchIcon, TicketIcon } from "./Icons";

type Attachment = {
  id: string;
  name: string;
  type: string;
  size: number;
  scanState?: string;
  validationState?: string;
  moderationState?: string;
  sensitive?: boolean;
  href?: string | null;
};

type TicketSummary = {
  id: string;
  reference: string;
  subject: string;
  categoryId: string;
  team: string;
  status: string;
  appealStatus?: string | null;
  priority: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
};

type TicketMessage = {
  id: string;
  senderType: string;
  senderName: string;
  body: string;
  createdAt: string;
  editedAt: string | null;
  attachments?: Attachment[];
};

type TicketDetail = { ticket: TicketSummary; messages: TicketMessage[] };
type LoadState = "loading" | "ready" | "signed-out" | "error";
type TicketLane = "general" | "appeals";
type AccessMode = "account" | "guest";

type PreparedUpload = {
  path: string;
  token: string;
  signedUrl: string;
  name: string;
  type: string;
  size: number;
};

const platformEndpoint = "https://esbgames.com/api/platform/support/tickets";
const guestEndpoint = "/api/support/guest-tickets";
const supportReturn = "https://about.esbgames.com/support/tickets";
const nestedReturn = `/login?returnTo=${encodeURIComponent(supportReturn)}`;
const signInUrl = `https://esbgames.com/login?next=${encodeURIComponent(nestedReturn)}`;
const finalAppealStatuses = new Set(["Approved", "Partially Approved", "Denied", "Withdrawn"]);
const MAX_FILES = 8;
const MAX_FILE = 100 * 1024 * 1024;
const MAX_COMBINED = 400 * 1024 * 1024;

const categoryNames: Record<string, string> = {
  "account-access": "Account & Access",
  "billing-payments": "Billing & Payments",
  "creator-developer": "Creator & Developer Support",
  "safety-abuse": "Safety & Abuse",
  "technical-issues": "Technical Issues",
  "something-else": "Something Else",
  "enforcement-appeal": "Appeal Support",
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

function formatBytes(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "0 B";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / (1024 * 1024)).toFixed(value >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
}

function ticketDisplayStatus(ticket: TicketSummary) {
  if (ticket.categoryId === "enforcement-appeal" && ticket.appealStatus && finalAppealStatuses.has(ticket.appealStatus)) return ticket.appealStatus;
  return ticket.status;
}

function statusClass(status: string) {
  return `support-account-status support-account-status-${status.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function accountGet(url: string) {
  return fetch(url, { method: "GET", credentials: "include", cache: "no-store", headers: { Accept: "application/json" } });
}

function guestGet(url: string) {
  return fetch(url, { method: "GET", credentials: "same-origin", cache: "no-store", headers: { Accept: "application/json" } });
}

export default function SupportTicketsClient() {
  const [state, setState] = useState<LoadState>("loading");
  const [accessMode, setAccessMode] = useState<AccessMode | null>(null);
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [lane, setLane] = useState<TicketLane>("general");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<TicketDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const [replyBusy, setReplyBusy] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const generalTickets = useMemo(() => tickets.filter((ticket) => ticket.categoryId !== "enforcement-appeal"), [tickets]);
  const appealTickets = useMemo(() => tickets.filter((ticket) => ticket.categoryId === "enforcement-appeal"), [tickets]);
  const visibleTickets = lane === "appeals" ? appealTickets : generalTickets;

  const detailUrl = useCallback((ticketId: string, mode: AccessMode) => mode === "account"
    ? `${platformEndpoint}?ticketId=${encodeURIComponent(ticketId)}`
    : `${guestEndpoint}?ticketId=${encodeURIComponent(ticketId)}`, []);

  const loadDetail = useCallback(async (ticketId: string, silent = false, explicitMode?: AccessMode) => {
    const mode = explicitMode ?? accessMode;
    if (!mode) return;
    setSelectedId(ticketId);
    if (!silent) { setDetailLoading(true); setMessage(null); setReplyError(null); }
    try {
      const response = mode === "account" ? await accountGet(detailUrl(ticketId, mode)) : await guestGet(detailUrl(ticketId, mode));
      const body = await response.json().catch(() => ({})) as { ok?: boolean; data?: TicketDetail; message?: string };
      if (response.status === 401) { setState("signed-out"); setDetail(null); return; }
      if (!response.ok || body.ok !== true || !body.data) throw new Error(body.message || "This ticket could not be loaded.");
      setDetail(body.data);
    } catch (error) {
      if (!silent) { setMessage(error instanceof Error ? error.message : "This ticket could not be loaded."); setDetail(null); }
    } finally {
      if (!silent) setDetailLoading(false);
    }
  }, [accessMode, detailUrl]);

  const applyTickets = useCallback((nextTickets: TicketSummary[], mode: AccessMode) => {
    const nextGeneral = nextTickets.filter((ticket) => ticket.categoryId !== "enforcement-appeal");
    const nextAppeals = nextTickets.filter((ticket) => ticket.categoryId === "enforcement-appeal");
    setAccessMode(mode);
    setTickets(nextTickets);
    setLane((current) => {
      if (current === "general" && !nextGeneral.length && nextAppeals.length) return "appeals";
      if (current === "appeals" && !nextAppeals.length && nextGeneral.length) return "general";
      return current;
    });
    setState("ready");
  }, []);

  const loadTickets = useCallback(async (silent = false) => {
    if (!silent) { setState("loading"); setMessage(null); }
    try {
      const accountResponse = await accountGet(platformEndpoint);
      const accountBody = await accountResponse.json().catch(() => ({})) as { ok?: boolean; data?: { tickets?: TicketSummary[] }; message?: string };
      if (accountResponse.ok && accountBody.ok === true) {
        applyTickets(Array.isArray(accountBody.data?.tickets) ? accountBody.data?.tickets ?? [] : [], "account");
        return;
      }
      if (accountResponse.status !== 401) throw new Error(accountBody.message || "Your support tickets could not be loaded.");

      const guestResponse = await guestGet(guestEndpoint);
      const guestBody = await guestResponse.json().catch(() => ({})) as { ok?: boolean; data?: { tickets?: TicketSummary[] }; message?: string };
      if (guestResponse.ok && guestBody.ok === true) {
        applyTickets(Array.isArray(guestBody.data?.tickets) ? guestBody.data?.tickets ?? [] : [], "guest");
        return;
      }
      if (guestResponse.status === 401) {
        setState("signed-out"); setAccessMode(null); setTickets([]); setDetail(null); return;
      }
      throw new Error(guestBody.message || "Your support tickets could not be loaded.");
    } catch (error) {
      if (!silent) { setMessage(error instanceof Error ? error.message : "Your support tickets could not be loaded."); setState("error"); }
    }
  }, [applyTickets]);

  function selectFiles(incoming: File[]) {
    const merged = [...replyFiles, ...incoming].filter((file, index, all) => all.findIndex((candidate) => candidate.name === file.name && candidate.size === file.size && candidate.lastModified === file.lastModified) === index).slice(0, MAX_FILES);
    if (merged.some((file) => file.size <= 0 || file.size > MAX_FILE)) { setReplyError("Each attachment must be 100 MB or smaller."); return; }
    if (merged.reduce((sum, file) => sum + file.size, 0) > MAX_COMBINED) { setReplyError("Combined attachments for one reply must be 400 MB or smaller."); return; }
    setReplyError(null);
    setReplyFiles(merged);
  }

  async function uploadAccountFiles(ticketId: string) {
    if (!replyFiles.length) return [] as PreparedUpload[];
    const prepare = await fetch(platformEndpoint, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ action: "prepare_attachments", ticketId, files: replyFiles.map((file) => ({ name: file.name, type: file.type, size: file.size })) }),
    });
    const prepareBody = await prepare.json().catch(() => ({})) as { ok?: boolean; data?: { uploads?: PreparedUpload[] }; message?: string };
    if (!prepare.ok || prepareBody.ok !== true || !Array.isArray(prepareBody.data?.uploads)) throw new Error(prepareBody.message || "The attachment upload could not be prepared.");
    const uploads = prepareBody.data.uploads;
    if (uploads.length !== replyFiles.length) throw new Error("One or more attachment uploads could not be prepared.");

    for (let index = 0; index < uploads.length; index += 1) {
      const prepared = uploads[index];
      const file = replyFiles[index];
      const uploadForm = new FormData();
      uploadForm.append("cacheControl", "3600");
      uploadForm.append("", file);
      const response = await fetch(prepared.signedUrl, { method: "PUT", headers: { "x-upsert": "false" }, body: uploadForm });
      if (!response.ok) throw new Error(`${file.name} could not be uploaded. Please try again.`);
    }
    return uploads;
  }

  async function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!detail || !accessMode || replyBusy) return;
    const bodyText = reply.trim();
    if (!bodyText && !replyFiles.length) return;
    setReplyBusy(true);
    setReplyError(null);
    try {
      let response: Response;
      if (accessMode === "account") {
        const uploads = await uploadAccountFiles(detail.ticket.id);
        response = await fetch(platformEndpoint, {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "send_reply",
            ticketId: detail.ticket.id,
            body: bodyText,
            attachments: uploads.map((upload) => ({ path: upload.path, name: upload.name, type: upload.type, size: upload.size })),
          }),
        });
      } else {
        const form = new FormData();
        form.set("ticketId", detail.ticket.id);
        form.set("body", bodyText);
        form.set("clientMessageId", globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
        replyFiles.forEach((file) => form.append("files", file));
        response = await fetch(guestEndpoint, { method: "POST", credentials: "same-origin", cache: "no-store", body: form });
      }
      const body = await response.json().catch(() => ({})) as { ok?: boolean; message?: string; attachmentError?: string | null };
      if (!response.ok || body.ok !== true) throw new Error(body.message || "Your reply could not be sent.");
      setReply("");
      setReplyFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (body.attachmentError) setReplyError(`Message sent, but an attachment could not be stored: ${body.attachmentError}`);
      await Promise.all([loadTickets(true), loadDetail(detail.ticket.id, true, accessMode)]);
    } catch (error) {
      setReplyError(error instanceof Error ? error.message : "Your reply could not be sent.");
    } finally {
      setReplyBusy(false);
    }
  }

  useEffect(() => { void loadTickets(false); }, [loadTickets]);

  useEffect(() => {
    if (state !== "ready" || !accessMode) return;
    if (visibleTickets.some((ticket) => ticket.id === selectedId)) return;
    const first = visibleTickets[0];
    if (first) void loadDetail(first.id, false, accessMode);
    else { setSelectedId(null); setDetail(null); }
  }, [accessMode, lane, loadDetail, selectedId, state, visibleTickets]);

  useEffect(() => {
    if (state !== "ready" || !accessMode) return;
    const sync = () => {
      if (document.hidden) return;
      void loadTickets(true);
      if (selectedId) void loadDetail(selectedId, true, accessMode);
    };
    const timer = window.setInterval(sync, 5000);
    window.addEventListener("focus", sync);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", sync); };
  }, [accessMode, loadDetail, loadTickets, selectedId, state]);

  if (state === "loading") return <div className="support-account-state"><span className="support-account-spinner" aria-hidden="true" /><h2>Loading your tickets</h2><p>Checking your secure support access and conversations.</p></div>;

  if (state === "signed-out") {
    return <div className="support-account-state support-account-signin">
      <span className="support-account-state-icon"><TicketIcon /></span>
      <span className="eyebrow">Secure access required</span>
      <h2>Sign in or verify a guest ticket.</h2>
      <p>Sign in to view account-linked tickets. If you created a ticket as a guest, open the private link sent to your email and verify the six-digit code; you will then be brought back to this ticket inbox.</p>
      <a className="button button-primary" href={signInUrl}>Sign in to ESB Games <ArrowIcon size={15} /></a>
    </div>;
  }

  if (state === "error") return <div className="support-account-state"><span className="support-account-state-icon"><SearchIcon /></span><h2>Tickets are temporarily unavailable.</h2><p>{message || "Please try again shortly."}</p><button className="button button-secondary" type="button" onClick={() => void loadTickets(false)}>Try again</button></div>;

  if (tickets.length === 0) return <div className="support-account-state"><span className="support-account-state-icon"><TicketIcon /></span><span className="eyebrow">No tickets</span><h2>You do not have any open support conversations here yet.</h2><p>New account-linked tickets and verified guest tickets will appear here.</p><a className="button button-primary" href="/support#submit-ticket">Create a support ticket</a></div>;

  return <div className="support-account-workspace">
    <aside className="support-account-list" aria-label="Your support tickets">
      <div className="support-account-list-heading"><div><span className="eyebrow">{accessMode === "guest" ? "Verified email tickets" : "Your tickets"}</span><h2>{tickets.length} {tickets.length === 1 ? "conversation" : "conversations"}</h2></div><button type="button" onClick={() => void loadTickets(false)}>Refresh</button></div>
      <div className="support-account-ticket-tabs" role="tablist" aria-label="Support ticket type">
        <button type="button" role="tab" aria-selected={lane === "general"} className={lane === "general" ? "active" : ""} onClick={() => setLane("general")}>General support <span>{generalTickets.length}</span></button>
        <button type="button" role="tab" aria-selected={lane === "appeals"} className={lane === "appeals" ? "active" : ""} onClick={() => setLane("appeals")}>Appeal support <span>{appealTickets.length}</span></button>
      </div>
      <div className="support-account-ticket-list">
        {visibleTickets.length ? visibleTickets.map((ticket) => {
          const displayStatus = ticketDisplayStatus(ticket);
          return <button key={ticket.id} type="button" className={`support-account-ticket${selectedId === ticket.id ? " active" : ""}`} onClick={() => void loadDetail(ticket.id)}>
            <span className="support-account-ticket-top"><strong>{ticket.reference}</strong><span className={statusClass(displayStatus)}>{displayStatus}</span></span>
            <b>{ticket.subject}</b><small>{categoryNames[ticket.categoryId] || ticket.categoryId} · Updated {formatDate(ticket.updatedAt)}</small>
          </button>;
        }) : <div className="support-account-lane-empty"><strong>{lane === "appeals" ? "No appeal conversations" : "No general support conversations"}</strong><span>{lane === "appeals" ? "Appeal tickets will appear here after you submit an enforcement appeal." : "Your non-appeal support tickets will appear here."}</span></div>}
      </div>
    </aside>

    <section className="support-account-conversation" aria-live="polite">
      {detailLoading ? <div className="support-account-conversation-loading"><span className="support-account-spinner" aria-hidden="true" /> Loading conversation…</div> : detail ? <>
        <header className="support-account-conversation-head"><div><span>{detail.ticket.reference}</span><h2>{detail.ticket.subject}</h2><p>{categoryNames[detail.ticket.categoryId] || detail.ticket.categoryId} · {detail.ticket.team}</p></div><span className={statusClass(ticketDisplayStatus(detail.ticket))}>{ticketDisplayStatus(detail.ticket)}</span></header>
        <div className="support-account-message-list">
          {detail.messages.length > 0 ? detail.messages.map((item) => <article key={item.id} className={`support-account-message support-account-message-${item.senderType.toLowerCase()}`}>
            <div><strong>{item.senderName || (item.senderType === "Staff" ? "ESB Games Support" : "You")}</strong><time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time></div>
            <p>{item.body}</p>
            {item.attachments?.length ? <div className="support-account-message-files">{item.attachments.map((attachment) => attachment.href ? <a key={attachment.id} href={attachment.href} target="_blank" rel="noopener noreferrer"><strong>{attachment.name}</strong><span>{formatBytes(attachment.size)}</span></a> : <span key={attachment.id}><strong>{attachment.name}</strong><span>Processing</span></span>)}</div> : null}
          </article>) : <div className="support-account-no-messages">No messages are available for this ticket yet.</div>}
        </div>
        <footer className="support-account-conversation-foot">
          {!['Closed', 'Resolved', 'Spam'].includes(detail.ticket.status) ? <form className="support-account-reply-composer" onSubmit={sendReply}>
            <label htmlFor="support-account-reply">{detail.ticket.categoryId === "enforcement-appeal" ? "Reply about this appeal" : "Reply to this support ticket"}</label>
            {replyFiles.length ? <div className="support-account-selected-files">{replyFiles.map((file, index) => <span key={`${file.name}-${file.lastModified}`}><strong>{file.name}</strong><small>{formatBytes(file.size)}</small><button type="button" aria-label={`Remove ${file.name}`} onClick={() => setReplyFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))}>×</button></span>)}</div> : null}
            <div><textarea id="support-account-reply" value={reply} onChange={(event) => setReply(event.currentTarget.value)} maxLength={20000} rows={3} placeholder={detail.ticket.categoryId === "enforcement-appeal" ? "Write a message related to this appeal…" : "Write your reply…"} disabled={replyBusy}/><button type="submit" disabled={replyBusy || (!reply.trim() && !replyFiles.length)}>{replyBusy ? (replyFiles.length ? "Uploading…" : "Sending…") : "Send reply"}</button></div>
            <div className="support-account-composer-tools"><label className="button button-secondary" htmlFor="support-account-files">＋ Attach files</label><input ref={fileInputRef} id="support-account-files" type="file" multiple accept="image/*,video/mp4,video/webm,video/quicktime,audio/*,.pdf,.txt,.csv,.json,.zip" onChange={(event: ChangeEvent<HTMLInputElement>) => selectFiles(Array.from(event.currentTarget.files ?? []))}/><small>Up to 8 files · 100 MB each · 400 MB combined</small></div>
            {replyError ? <p className="support-account-reply-error" role="alert">{replyError}</p> : null}
          </form> : <div className="support-account-ticket-closed-note">This ticket is closed. Open a new support ticket if you need further help.</div>}
          <div className="support-account-conversation-foot-row"><p>{detail.ticket.categoryId === "enforcement-appeal" ? "Use this conversation only for messages directly related to this appeal." : accessMode === "guest" ? "Access is secured by your verified email session." : "This conversation is securely linked to your ESB Games account."}</p><a className="button button-secondary" href="/support#submit-ticket">Create another ticket</a></div>
        </footer>
      </> : <div className="support-account-state compact"><h2>{lane === "appeals" ? "No appeal selected" : "Select a ticket"}</h2><p>{message || "Choose a support conversation from the list."}</p></div>}
    </section>
  </div>;
}
