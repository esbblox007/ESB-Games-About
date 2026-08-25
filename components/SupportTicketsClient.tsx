"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowIcon, SearchIcon, TicketIcon } from "./Icons";

type TicketSummary = {
  id: string;
  reference: string;
  subject: string;
  categoryId: string;
  team: string;
  status: string;
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
};

type TicketDetail = {
  ticket: TicketSummary;
  messages: TicketMessage[];
};

type LoadState = "loading" | "ready" | "signed-out" | "error";
type TicketLane = "general" | "appeals";

const platformEndpoint = "https://esbgames.com/api/platform/support/tickets";
const supportReturn = "https://about.esbgames.com/support/tickets";
const nestedReturn = `/login?returnTo=${encodeURIComponent(supportReturn)}`;
const signInUrl = `https://esbgames.com/login?next=${encodeURIComponent(nestedReturn)}`;

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
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function statusClass(status: string) {
  const normalized = status.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `support-account-status support-account-status-${normalized}`;
}

async function platformFetch(url: string) {
  return fetch(url, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
}

export default function SupportTicketsClient() {
  const [state, setState] = useState<LoadState>("loading");
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [lane, setLane] = useState<TicketLane>("general");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<TicketDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [replyBusy, setReplyBusy] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const generalTickets = useMemo(() => tickets.filter((ticket) => ticket.categoryId !== "enforcement-appeal"), [tickets]);
  const appealTickets = useMemo(() => tickets.filter((ticket) => ticket.categoryId === "enforcement-appeal"), [tickets]);
  const visibleTickets = lane === "appeals" ? appealTickets : generalTickets;

  const loadDetail = useCallback(async (ticketId: string) => {
    setSelectedId(ticketId);
    setDetailLoading(true);
    setMessage(null);
    setReplyError(null);
    try {
      const response = await platformFetch(`${platformEndpoint}?ticketId=${encodeURIComponent(ticketId)}`);
      const body = await response.json().catch(() => ({})) as { ok?: boolean; data?: TicketDetail; message?: string; code?: string };
      if (response.status === 401) {
        setState("signed-out");
        setDetail(null);
        return;
      }
      if (!response.ok || body.ok !== true || !body.data) throw new Error(body.message || "This ticket could not be loaded.");
      setDetail(body.data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "This ticket could not be loaded.");
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const loadTickets = useCallback(async () => {
    setState("loading");
    setMessage(null);
    try {
      const response = await platformFetch(platformEndpoint);
      const body = await response.json().catch(() => ({})) as { ok?: boolean; data?: { tickets?: TicketSummary[] }; message?: string };
      if (response.status === 401) {
        setState("signed-out");
        setTickets([]);
        setDetail(null);
        return;
      }
      if (!response.ok || body.ok !== true) throw new Error(body.message || "Your support tickets could not be loaded.");
      const nextTickets = Array.isArray(body.data?.tickets) ? body.data?.tickets ?? [] : [];
      const nextGeneral = nextTickets.filter((ticket) => ticket.categoryId !== "enforcement-appeal");
      const nextAppeals = nextTickets.filter((ticket) => ticket.categoryId === "enforcement-appeal");
      const nextLane: TicketLane = nextGeneral.length ? "general" : "appeals";
      setTickets(nextTickets);
      setLane(nextLane);
      setState("ready");
      const first = nextLane === "appeals" ? nextAppeals[0] : nextGeneral[0];
      if (first) void loadDetail(first.id);
      else { setSelectedId(null); setDetail(null); }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Your support tickets could not be loaded.");
      setState("error");
    }
  }, [loadDetail]);

  async function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!detail || replyBusy) return;
    const bodyText = reply.trim();
    if (!bodyText) return;
    setReplyBusy(true);
    setReplyError(null);
    try {
      const response = await fetch(platformEndpoint, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: detail.ticket.id, body: bodyText }),
      });
      const body = await response.json().catch(() => ({})) as { ok?: boolean; message?: string };
      if (!response.ok || body.ok !== true) throw new Error(body.message || "Your reply could not be sent.");
      setReply("");
      await loadDetail(detail.ticket.id);
    } catch (error) {
      setReplyError(error instanceof Error ? error.message : "Your reply could not be sent.");
    } finally {
      setReplyBusy(false);
    }
  }

  useEffect(() => { void loadTickets(); }, [loadTickets]);

  useEffect(() => {
    if (state !== "ready") return;
    if (visibleTickets.some((ticket) => ticket.id === selectedId)) return;
    const first = visibleTickets[0];
    if (first) void loadDetail(first.id);
    else { setSelectedId(null); setDetail(null); }
  }, [lane, loadDetail, selectedId, state, visibleTickets]);

  if (state === "loading") {
    return <div className="support-account-state"><span className="support-account-spinner" aria-hidden="true" /><h2>Loading your tickets</h2><p>Checking your ESB Games account and linked support conversations.</p></div>;
  }

  if (state === "signed-out") {
    return (
      <div className="support-account-state support-account-signin">
        <span className="support-account-state-icon"><TicketIcon /></span>
        <span className="eyebrow">Account sign-in required</span>
        <h2>Sign in to view your tickets.</h2>
        <p>Your ESB Games login remains on the main Platform. After you sign in, you will be returned here automatically.</p>
        <a className="button button-primary" href={signInUrl}>Sign in to ESB Games <ArrowIcon size={15} /></a>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="support-account-state">
        <span className="support-account-state-icon"><SearchIcon /></span>
        <h2>Tickets are temporarily unavailable.</h2>
        <p>{message || "Please try again shortly."}</p>
        <button className="button button-secondary" type="button" onClick={() => void loadTickets()}>Try again</button>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="support-account-state">
        <span className="support-account-state-icon"><TicketIcon /></span>
        <span className="eyebrow">No linked tickets</span>
        <h2>You do not have any account-linked support tickets yet.</h2>
        <p>Tickets created while signed in will appear here. Guest tickets remain accessible through the private link sent to the email address used when the ticket was created.</p>
        <a className="button button-primary" href="/support#submit-ticket">Create a support ticket</a>
      </div>
    );
  }

  return (
    <div className="support-account-workspace">
      <aside className="support-account-list" aria-label="Your support tickets">
        <div className="support-account-list-heading"><div><span className="eyebrow">Your tickets</span><h2>{tickets.length} {tickets.length === 1 ? "conversation" : "conversations"}</h2></div><button type="button" onClick={() => void loadTickets()}>Refresh</button></div>
        <div className="support-account-ticket-tabs" role="tablist" aria-label="Support ticket type">
          <button type="button" role="tab" aria-selected={lane === "general"} className={lane === "general" ? "active" : ""} onClick={() => setLane("general")}>General support <span>{generalTickets.length}</span></button>
          <button type="button" role="tab" aria-selected={lane === "appeals"} className={lane === "appeals" ? "active" : ""} onClick={() => setLane("appeals")}>Appeal support <span>{appealTickets.length}</span></button>
        </div>
        <div className="support-account-ticket-list">
          {visibleTickets.length ? visibleTickets.map((ticket) => (
            <button key={ticket.id} type="button" className={`support-account-ticket${selectedId === ticket.id ? " active" : ""}`} onClick={() => void loadDetail(ticket.id)}>
              <span className="support-account-ticket-top"><strong>{ticket.reference}</strong><span className={statusClass(ticket.status)}>{ticket.status}</span></span>
              <b>{ticket.subject}</b>
              <small>{categoryNames[ticket.categoryId] || ticket.categoryId} · Updated {formatDate(ticket.updatedAt)}</small>
            </button>
          )) : <div className="support-account-lane-empty"><strong>{lane === "appeals" ? "No appeal conversations" : "No general support conversations"}</strong><span>{lane === "appeals" ? "Appeal tickets will appear here after you submit an enforcement appeal." : "Your non-appeal support tickets will appear here."}</span></div>}
        </div>
      </aside>

      <section className="support-account-conversation" aria-live="polite">
        {detailLoading ? (
          <div className="support-account-conversation-loading"><span className="support-account-spinner" aria-hidden="true" /> Loading conversation…</div>
        ) : detail ? (
          <>
            <header className="support-account-conversation-head">
              <div><span>{detail.ticket.reference}</span><h2>{detail.ticket.subject}</h2><p>{categoryNames[detail.ticket.categoryId] || detail.ticket.categoryId} · {detail.ticket.team}</p></div>
              <span className={statusClass(detail.ticket.status)}>{detail.ticket.status}</span>
            </header>
            <div className="support-account-message-list">
              {detail.messages.length > 0 ? detail.messages.map((item) => (
                <article key={item.id} className={`support-account-message support-account-message-${item.senderType.toLowerCase()}`}>
                  <div><strong>{item.senderName || (item.senderType === "Staff" ? "ESB Games Support" : "You")}</strong><time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time></div>
                  <p>{item.body}</p>
                </article>
              )) : <div className="support-account-no-messages">No messages are available for this ticket yet.</div>}
            </div>
            <footer className="support-account-conversation-foot">
              {!['Closed', 'Spam'].includes(detail.ticket.status) ? <form className="support-account-reply-composer" onSubmit={sendReply}>
                <label htmlFor="support-account-reply">{detail.ticket.categoryId === "enforcement-appeal" ? "Reply about this appeal" : "Reply to this support ticket"}</label>
                <div><textarea id="support-account-reply" value={reply} onChange={(event) => setReply(event.currentTarget.value)} maxLength={20000} rows={3} placeholder={detail.ticket.categoryId === "enforcement-appeal" ? "Write a message related to this appeal…" : "Write your reply…"} disabled={replyBusy}/><button type="submit" disabled={replyBusy || !reply.trim()}>{replyBusy ? "Sending…" : "Send reply"}</button></div>
                {replyError ? <p className="support-account-reply-error" role="alert">{replyError}</p> : null}
              </form> : <div className="support-account-ticket-closed-note">This ticket is closed. Open a new support ticket if you need further help.</div>}
              <div className="support-account-conversation-foot-row"><p>{detail.ticket.categoryId === "enforcement-appeal" ? "Use this conversation only for messages directly related to this appeal. For anything else, please open a new support ticket." : "This conversation is securely linked to your ESB Games account."}</p><a className="button button-secondary" href="/support#submit-ticket">Need another issue? Create a new ticket</a></div>
            </footer>
          </>
        ) : (
          <div className="support-account-state compact"><h2>{lane === "appeals" ? "No appeal selected" : "Select a ticket"}</h2><p>{message || (lane === "appeals" ? "Choose an appeal conversation from the list." : "Choose a support conversation from the list.")}</p></div>
        )}
      </section>
    </div>
  );
}
