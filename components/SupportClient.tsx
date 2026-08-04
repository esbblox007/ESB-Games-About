"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { authHeaders } from "@/lib/client-auth";
import { BookIcon, CloseIcon, SearchIcon, TicketIcon } from "./Icons";

const categories = [
  ["account-access", "Account & Access"],
  ["billing-payments", "Billing & Payments"],
  ["creator-developer", "Creator & Developer Support"],
  ["safety-abuse", "Safety & Abuse"],
  ["technical-issues", "Technical Issues"],
  ["something-else", "Something Else"],
] as const;

type CreatedTicket = {
  ticketReference: string;
  privatePath: string;
  requiresEmailVerification: boolean;
  emailSent: boolean;
};

export default function SupportClient() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedTicket | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const modalRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeButtonRef.current?.focus(), 20);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const focusable = Array.from(modalRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])") || []);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      previousFocusRef.current?.focus();
    };
  }, [open]);

  function openTicketForm() {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setCreated(null);
    setError(null);
    setSelectedFiles([]);
    setOpen(true);
  }

  async function submitTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const form = new FormData(event.currentTarget);
      selectedFiles.forEach((file) => form.append("files", file));
      const response = await fetch("/api/support/tickets", { method: "POST", headers: authHeaders(), body: form });
      const body = await response.json() as CreatedTicket & { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Your support ticket could not be created.");
      setCreated(body);
      event.currentTarget.reset();
      setSelectedFiles([]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Your support ticket could not be created.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="grid-3 support-cards">
        <article className="card support-card">
          <span className="card-icon"><BookIcon /></span>
          <h3>Help Centre</h3>
          <p>Browse answers covering accounts, billing, creator tools, safety and more.</p>
          <a className="card-link" href="#quick-help">Browse articles →</a>
        </article>

        <article className="card support-card" id="submit-ticket">
          <span className="card-icon cyan"><TicketIcon /></span>
          <h3>Submit a Ticket</h3>
          <p>Start a private conversation with the ESB Games support team and attach supporting evidence.</p>
          <button className="card-link support-link-button" type="button" onClick={openTicketForm}>Open a ticket →</button>
        </article>

        <article className="card support-card">
          <span className="card-icon green"><SearchIcon /></span>
          <h3>View Your Tickets</h3>
          <p>Signed-in users can access linked tickets from their ESB Games account. Guests use the private link sent by email.</p>
          <a className="card-link" href="https://esbgames.com/login">Sign in to ESB Games →</a>
        </article>
      </div>

      {open && (
        <div className="modal-backdrop" onMouseDown={() => setOpen(false)}>
          <section ref={modalRef} className="form-modal support-ticket-modal" role="dialog" aria-modal="true" aria-labelledby="support-ticket-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-heading">
              <div><span className="eyebrow">ESB Games Support</span><h2 id="support-ticket-title">{created ? "Ticket created" : "Start a support conversation"}</h2></div>
              <button ref={closeButtonRef} className="icon-button" aria-label="Close" onClick={() => setOpen(false)}><CloseIcon /></button>
            </div>

            {created ? (
              <div className="support-ticket-created" role="status">
                <span className="support-success-mark">✓</span>
                <h3>{created.ticketReference}</h3>
                <p>Your ticket has been securely recorded. {created.requiresEmailVerification ? "Use the private link below and request a one-time code sent to your email to enter the conversation." : "It is linked to your signed-in ESB Games account."}</p>
                {!created.emailSent && created.requiresEmailVerification && <p className="form-alert warning">The confirmation email could not be delivered. Save the private link below now so you do not lose access.</p>}
                <Link className="button button-primary" href={created.privatePath}>Open private ticket</Link>
                <p className="support-private-link-note">Do not forward the private ticket link. A ticket reference alone cannot be used to access the conversation.</p>
              </div>
            ) : (
              <form className="form-grid" onSubmit={submitTicket}>
                <input name="website" tabIndex={-1} autoComplete="off" className="support-honeypot" aria-hidden="true" />
                <div className="field"><label htmlFor="support-name">Name</label><input className="input" id="support-name" name="name" autoComplete="name" required maxLength={120} /></div>
                <div className="field"><label htmlFor="support-email">Email address</label><input className="input" id="support-email" name="email" type="email" autoComplete="email" required /><small>Required for guest verification. Signed-in users are linked to their account.</small></div>
                <div className="field"><label htmlFor="support-category">Category</label><select className="input" id="support-category" name="category" defaultValue="account-access" required>{categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
                <div className="field"><label htmlFor="support-subject">Subject</label><input className="input" id="support-subject" name="subject" required maxLength={160} /></div>
                <div className="field full"><label htmlFor="support-description">What happened?</label><textarea className="input" id="support-description" name="description" required minLength={10} maxLength={20000} placeholder="Explain what happened, when it happened, and what help you need. Do not include passwords or full payment-card information." /></div>
                <div className="field full">
                  <label htmlFor="support-files">Evidence and attachments <span>(optional)</span></label>
                  <input className="input support-file-input" id="support-files" type="file" multiple accept="image/*,video/mp4,video/webm,video/quicktime,audio/*,.pdf,.txt,.csv,.json,.zip" onChange={(event) => setSelectedFiles(Array.from(event.currentTarget.files ?? []).slice(0, 8))} />
                  <small>Up to eight files, 100 MB each. Safety evidence may contain upsetting material and is kept private for authorised review.</small>
                  {selectedFiles.length > 0 && <ul className="support-file-list">{selectedFiles.map((file) => <li key={`${file.name}-${file.lastModified}`}>{file.name} · {formatBytes(file.size)}</li>)}</ul>}
                </div>
                <label className="support-consent full"><input type="checkbox" required /> <span>I understand that my ticket and attachments will be stored securely and viewed by authorised ESB Games staff to investigate and respond.</span></label>
                {error && <div className="form-alert error full" role="alert">{error}</div>}
                <div className="field full support-form-actions"><button className="button button-primary" type="submit" disabled={submitting}>{submitting ? "Creating ticket…" : "Create private ticket"}</button><button className="button button-secondary" type="button" onClick={() => setOpen(false)}>Cancel</button></div>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
