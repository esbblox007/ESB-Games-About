"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { BookIcon, CloseIcon, SearchIcon, TicketIcon } from "./Icons";

export default function SupportClient() {
  const [open, setOpen] = useState(false);
  const [trackingMessage, setTrackingMessage] = useState<string | null>(null);
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
    setOpen(true);
  }

  function trackTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTrackingMessage("Ticket tracking will become available when the support backend is connected.");
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
          <p>Can&apos;t find an answer? Preview the request form being prepared for the ESB Games support team.</p>
          <button className="card-link support-link-button" type="button" onClick={openTicketForm}>Open a ticket →</button>
        </article>

        <article className="card support-card">
          <span className="card-icon green"><SearchIcon /></span>
          <h3>Track a Ticket</h3>
          <p>Ticket tracking will be available once the support backend has been connected.</p>
          <form className="track-form" onSubmit={trackTicket}>
            <input className="input" placeholder="ESB-XXXXXX" aria-label="Ticket ID" />
            <button className="button button-primary" type="submit">Go</button>
          </form>
        </article>
      </div>

      {trackingMessage && <div className="success-box support-preview-message" role="status">{trackingMessage}</div>}

      {open && (
        <div className="modal-backdrop" onMouseDown={() => setOpen(false)}>
          <section ref={modalRef} className="form-modal" role="dialog" aria-modal="true" aria-labelledby="support-ticket-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-heading">
              <div><span className="eyebrow">ESB Games Support</span><h2 id="support-ticket-title">Submit a ticket</h2></div>
              <button ref={closeButtonRef} className="icon-button" aria-label="Close" onClick={() => setOpen(false)}><CloseIcon /></button>
            </div>

            <div className="support-modal-warning">
              <strong>Frontend preview</strong>
              <p>This form is not connected to the support backend yet. Information entered here is not sent or stored.</p>
            </div>

            <form className="form-grid" onSubmit={(event) => event.preventDefault()}>
              <div className="field"><label htmlFor="support-name">Name</label><input className="input" id="support-name" name="name" autoComplete="name" /></div>
              <div className="field"><label htmlFor="support-email">Email address</label><input className="input" id="support-email" name="email" type="email" autoComplete="email" /></div>
              <div className="field"><label htmlFor="support-category">Category</label><select className="input" id="support-category" name="category" defaultValue="Account & Access"><option>Account & Access</option><option>Billing & Payments</option><option>Creator & Developer Support</option><option>Safety & Abuse</option><option>Technical Issues</option><option>Something Else</option></select></div>
              <div className="field"><label htmlFor="support-subject">Subject</label><input className="input" id="support-subject" name="subject" maxLength={120} /></div>
              <div className="field full"><label htmlFor="support-message">How can we help?</label><textarea className="input" id="support-message" name="message" maxLength={5000} placeholder="Do not include passwords or full payment-card information." /></div>
              <div className="field full support-form-actions"><button className="button button-primary" type="submit" disabled aria-disabled="true">Online submissions opening soon</button><button className="button button-secondary" type="button" onClick={() => setOpen(false)}>Close</button></div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
