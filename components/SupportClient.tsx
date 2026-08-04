"use client";

import { useEffect, useRef, useState } from "react";
import { BookIcon, CloseIcon, SearchIcon, ShieldIcon, TicketIcon } from "./Icons";

type SupportMode = "general" | "safety";

export default function SupportClient() {
  const [mode, setMode] = useState<SupportMode | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!mode) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeButtonRef.current?.focus(), 20);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMode(null);
      if (event.key === "Tab") {
        const focusable = Array.from(modalRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])") || []);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      previousFocusRef.current?.focus();
    };
  }, [mode]);

  const selectedCategory = mode === "safety" ? "Safety & Abuse" : "Account & Access";

  function openForm(nextMode: SupportMode) {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setMode(nextMode);
  }

  return (
    <>
      <div className="support-action-grid">
        <article className="card support-card"><span className="card-icon"><BookIcon /></span><h3>Help Centre</h3><p>Browse guidance covering accounts, billing, creator tools, safety and more.</p><a className="card-link" href="#quick-help">Browse help articles →</a></article>
        <article className="card support-card" id="contact-support"><span className="card-icon cyan"><TicketIcon /></span><h3>Contact Support</h3><p>Preview the full support form that will connect to the ESB Games support backend.</p><button className="card-link support-link-button" type="button" onClick={() => openForm("general")}>Open support form →</button></article>
        <article className="card support-card"><span className="card-icon green"><ShieldIcon /></span><h3>Report a Safety Concern</h3><p>Use a dedicated form for harassment, abuse, dangerous content or other safety concerns.</p><button className="card-link support-link-button" type="button" onClick={() => openForm("safety")}>Open safety form →</button></article>
        <article className="card support-card"><span className="card-icon orange"><SearchIcon /></span><h3>Service Status</h3><p>View the separate ESB Games status page for current service information and incidents.</p><a className="card-link" href="https://status.esbgames.com">View service status →</a></article>
      </div>

      <div className="support-frontend-notice" role="note">
        <strong>Frontend preview</strong>
        <span>Online support submissions and ticket tracking are not connected yet. No information entered into the preview form is sent or stored.</span>
      </div>

      {mode && (
        <div className="modal-backdrop" onMouseDown={() => setMode(null)}>
          <section ref={modalRef} className="form-modal support-form-modal" role="dialog" aria-modal="true" aria-labelledby="support-form-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-heading">
              <div><span className="eyebrow">ESB Games Support</span><h2 id="support-form-title">{mode === "safety" ? "Report a safety concern" : "Contact support"}</h2></div>
              <button ref={closeButtonRef} className="icon-button" aria-label="Close support form" onClick={() => setMode(null)}><CloseIcon /></button>
            </div>

            <div className="support-modal-warning">
              <strong>This form is not connected yet.</strong>
              <p>Completing it will not send a report. Do not assume ESB Games has received a safety or support request until a confirmed submission reference is shown after the backend is connected.</p>
            </div>

            <form className="form-grid support-preview-form" onSubmit={(event) => event.preventDefault()}>
              <div className="field"><label htmlFor="support-category">Category</label><select className="input" id="support-category" name="category" defaultValue={selectedCategory}><option>Account & Access</option><option>Billing & Payments</option><option>Creator & Developer Support</option><option>Safety & Abuse</option><option>Technical Issues</option><option>Something Else</option></select></div>
              <div className="field"><label htmlFor="support-product">Product or service</label><select className="input" id="support-product" name="product" defaultValue="Play Platform"><option>Play Platform</option><option>ESB Studio</option><option>Creator Hub</option><option>Family Centre</option><option>About Website</option><option>Account & Authentication</option><option>Other</option></select></div>
              <div className="field"><label htmlFor="support-name">Full name</label><input className="input" id="support-name" name="name" autoComplete="name" /></div>
              <div className="field"><label htmlFor="support-email">Email address</label><input className="input" id="support-email" name="email" type="email" autoComplete="email" /></div>
              <div className="field"><label htmlFor="support-username">Username or account ID <small>(optional)</small></label><input className="input" id="support-username" name="username" autoComplete="username" /></div>
              <div className="field"><label htmlFor="support-device">Device and operating system</label><input className="input" id="support-device" name="device" placeholder="For example: Windows 11 · Edge" /></div>
              <div className="field full"><label htmlFor="support-subject">Subject</label><input className="input" id="support-subject" name="subject" maxLength={120} /></div>
              <div className="field full"><label htmlFor="support-message">What happened?</label><textarea className="input" id="support-message" name="message" maxLength={5000} placeholder="Include the relevant usernames, dates, pages, error messages or other details. Never include passwords or full payment-card information." /></div>
              <label className="support-upload-field field full"><span>Attachments</span><input type="file" multiple accept="image/*,.pdf,.txt,.log" /><b>Add screenshots or supporting files</b><small>Visual preview only. Files are not uploaded.</small></label>
              <label className="support-consent field full"><input type="checkbox" /><span>I understand this frontend preview does not submit or store my information.</span></label>
              <div className="field full support-form-actions"><button className="button button-primary" type="submit" disabled aria-disabled="true">Online submissions opening soon</button><button className="button button-secondary" type="button" onClick={() => setMode(null)}>Close</button></div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
