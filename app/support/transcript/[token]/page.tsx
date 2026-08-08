import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { sha256, supabaseSelect, supabaseUpdate } from "@/lib/server/supabase";

export const metadata: Metadata = {
  title: "Support ticket transcript",
  description: "Read-only transcript of a closed ESB Games support ticket.",
  robots: { index: false, follow: false },
};

type TranscriptToken = { id: string; ticket_id: string; expires_at: string | null; revoked_at: string | null };
type Ticket = { id: string; ticket_reference: string; requester_name: string; requester_email: string | null; subject: string; category_id: string; status: string; created_at: string; closed_at: string | null };
type Message = { id: string; sender_type: string; sender_name: string; body: string; created_at: string; deleted_at: string | null };
type Attachment = { id: string; message_id: string | null; original_file_name: string; mime_type: string; size_bytes: number; scan_state: string; archived_at: string | null };

export default async function SupportTranscriptPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const tokenHash = sha256(token);
  const tokens = await supabaseSelect<TranscriptToken>("support_ticket_transcript_tokens", `select=id,ticket_id,expires_at,revoked_at&token_hash=eq.${encodeURIComponent(tokenHash)}&limit=1`).catch(() => []);
  const record = tokens[0];
  const expired = Boolean(record?.expires_at && new Date(record.expires_at).getTime() < Date.now());

  if (!record || record.revoked_at || expired) {
    return <PageShell><main className="support-transcript-page"><div className="support-transcript-shell support-transcript-invalid"><span className="support-transcript-lock">⌁</span><span className="eyebrow">PRIVATE SUPPORT TRANSCRIPT</span><h1>This transcript link is unavailable.</h1><p>The link may have expired, been revoked or be invalid. Contact ESB Games Support and provide your ticket reference if you need another copy.</p><Link className="button button-primary" href="/support">Go to Support</Link></div></main></PageShell>;
  }

  const [tickets, messages, attachments] = await Promise.all([
    supabaseSelect<Ticket>("support_tickets", `select=id,ticket_reference,requester_name,requester_email,subject,category_id,status,created_at,closed_at&id=eq.${encodeURIComponent(record.ticket_id)}&limit=1`),
    supabaseSelect<Message>("support_ticket_messages", `select=id,sender_type,sender_name,body,created_at,deleted_at&ticket_id=eq.${encodeURIComponent(record.ticket_id)}&deleted_at=is.null&order=created_at.asc`),
    supabaseSelect<Attachment>("support_ticket_attachments", `select=id,message_id,original_file_name,mime_type,size_bytes,scan_state,archived_at&ticket_id=eq.${encodeURIComponent(record.ticket_id)}&customer_visible=eq.true&archived_at=is.null&order=created_at.asc`),
  ]);
  const ticket = tickets[0];
  await supabaseUpdate("support_ticket_transcript_tokens", `id=eq.${encodeURIComponent(record.id)}`, { last_accessed_at: new Date().toISOString() }).catch(() => []);

  if (!ticket) {
    return <PageShell><main className="support-transcript-page"><div className="support-transcript-shell support-transcript-invalid"><span className="eyebrow">PRIVATE SUPPORT TRANSCRIPT</span><h1>Ticket not found.</h1><p>The support record linked to this transcript is no longer available.</p></div></main></PageShell>;
  }

  return <PageShell><main className="support-transcript-page"><div className="support-transcript-shell">
    <header className="support-transcript-commandbar"><div><span className="support-transcript-logo">ESB</span><div><small>ESB GAMES SUPPORT</small><strong>Read-only ticket transcript</strong></div></div><span className="support-transcript-readonly">Closed · replies disabled</span></header>
    <section className="support-transcript-heading"><div><span className="eyebrow">{ticket.ticket_reference}</span><h1>{ticket.subject}</h1><p>{categoryLabel(ticket.category_id)} · Opened {formatDate(ticket.created_at)}</p></div><div><strong>{ticket.status}</strong></div></section>
    <section className="support-transcript-summary"><div><span>Customer</span><strong>{ticket.requester_name}</strong><small>{ticket.requester_email ?? "Linked ESB Games account"}</small></div><div><span>Opened</span><strong>{formatDate(ticket.created_at)}</strong></div><div><span>Closed</span><strong>{ticket.closed_at ? formatDate(ticket.closed_at) : "Closed"}</strong></div><div><span>Messages</span><strong>{messages.length}</strong></div></section>
    <section className="support-transcript-conversation">
      <div className="support-transcript-notice"><span>✓</span><div><strong>This is the final read-only transcript.</strong><p>The ticket is closed. Messages cannot be edited or added from this page.</p></div></div>
      <div className="support-transcript-thread">
        {messages.map((message) => <article key={message.id} className={`support-transcript-message ${message.sender_type.toLowerCase()}`}><span className="support-transcript-avatar">{message.sender_type === "Staff" ? "ESB" : initials(message.sender_name)}</span><div><header><div><strong>{message.sender_name}</strong><small>{message.sender_type === "Staff" ? "ESB Games Support" : "Customer"}</small></div><time>{formatDate(message.created_at)}</time></header><p>{message.body}</p>{attachments.filter((attachment) => attachment.message_id === message.id).length > 0 && <div className="support-transcript-files">{attachments.filter((attachment) => attachment.message_id === message.id).map((attachment) => <div key={attachment.id}><span>▧</span><div><strong>{attachment.original_file_name}</strong><small>{formatBytes(attachment.size_bytes)} · {attachment.scan_state}</small></div></div>)}</div>}</div></article>)}
      </div>
    </section>
    <footer className="support-transcript-footer"><div><strong>Need another review?</strong><p>A closed transcript cannot receive replies. Start a new support ticket and reference {ticket.ticket_reference}.</p></div><Link className="button button-secondary" href="/support#submit-ticket">Open a new ticket</Link></footer>
  </div></main></PageShell>;
}

function categoryLabel(id: string) { return ({ "account-access": "Account & Access", "billing-payments": "Billing & Payments", "creator-developer": "Creator & Developer Support", "safety-abuse": "Safety & Abuse", "technical-issues": "Technical Issues", "something-else": "Something Else" } as Record<string,string>)[id] ?? id; }
function formatDate(value: string) { return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
function formatBytes(value: number) { return value < 1024 * 1024 ? `${Math.max(1, Math.round(value / 1024))} KB` : `${(value / 1024 / 1024).toFixed(1)} MB`; }
function initials(value: string) { return value.split(/\s+/).filter(Boolean).slice(0,2).map((part) => part[0]?.toUpperCase()).join("") || "ES"; }
