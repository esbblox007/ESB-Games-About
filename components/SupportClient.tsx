"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { authHeaders } from "@/lib/client-auth";
import { getSupportCategoryDefinition, supportCategoryDefinitions, type SupportField } from "@/lib/support-intake";
import { BookIcon, CloseIcon, SearchIcon, TicketIcon } from "./Icons";

type CreatedTicket = {
  ticketReference: string;
  privatePath: string;
  requiresEmailVerification: boolean;
  emailSent: boolean;
};

type ServiceState = "checking" | "available" | "unavailable";

export default function SupportClient() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedTicket | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("account-access");
  const [serviceState, setServiceState] = useState<ServiceState>("checking");
  const [serviceMessage, setServiceMessage] = useState<string | null>(null);
  const modalRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const selectedCategory = useMemo(() => getSupportCategoryDefinition(selectedCategoryId) ?? supportCategoryDefinitions[0], [selectedCategoryId]);

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

  async function checkSupportService() {
    setServiceState("checking");
    setServiceMessage(null);
    try {
      const response = await fetch("/api/support/health", { cache: "no-store" });
      const body = await response.json() as { available?: boolean; message?: string };
      if (!response.ok || body.available !== true) {
        setServiceState("unavailable");
        setServiceMessage(body.message ?? "Online ticket creation is temporarily unavailable.");
        return;
      }
      setServiceState("available");
    } catch {
      setServiceState("unavailable");
      setServiceMessage("Online ticket creation is temporarily unavailable.");
    }
  }

  function openTicketForm() {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setCreated(null);
    setError(null);
    setSelectedFiles([]);
    setSelectedCategoryId("account-access");
    setOpen(true);
    void checkSupportService();
  }

  async function submitTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (serviceState !== "available") {
      setError("Online ticket creation is not currently available. Please try again shortly.");
      return;
    }
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
          <p>Browse guidance covering accounts, billing, creator tools, safety and technical support.</p>
          <a className="card-link" href="#quick-help">Browse articles →</a>
        </article>

        <article className="card support-card" id="submit-ticket">
          <span className="card-icon cyan"><TicketIcon /></span>
          <h3>Submit a Ticket</h3>
          <p>Open a secure support conversation, provide structured details and attach supporting evidence.</p>
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
              <div>
                <span className="eyebrow">ESB Games Support</span>
                <h2 id="support-ticket-title">{created ? "Ticket created" : "Start a support conversation"}</h2>
                {!created && <p className="support-modal-intro">Provide clear, accurate information so the correct team can review your request. Required questions change according to the category you select.</p>}
              </div>
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
              <form className="support-intake-form" onSubmit={submitTicket}>
                <input name="website" tabIndex={-1} autoComplete="off" className="support-honeypot" aria-hidden="true" />

                <fieldset className="support-form-section">
                  <legend>Contact details</legend>
                  <p>We use these details to identify the requester and provide secure access to the conversation.</p>
                  <div className="form-grid">
                    <div className="field"><label htmlFor="support-name">Full name</label><input className="input" id="support-name" name="name" autoComplete="name" required maxLength={120} /></div>
                    <div className="field"><label htmlFor="support-email">Email address</label><input className="input" id="support-email" name="email" type="email" autoComplete="email" required /><small>Guests receive a private ticket link and a three-minute verification code. Signed-in users are linked to their account where possible.</small></div>
                  </div>
                </fieldset>

                <fieldset className="support-form-section">
                  <legend>Request classification</legend>
                  <p>Select the closest category. Your answers will be included in the ticket exactly as structured information for the reviewing team.</p>
                  <div className="form-grid">
                    <div className="field">
                      <label htmlFor="support-category">Support category</label>
                      <select className="input" id="support-category" name="category" value={selectedCategoryId} onChange={(event) => setSelectedCategoryId(event.currentTarget.value)} required>
                        {supportCategoryDefinitions.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
                      </select>
                      <small>{selectedCategory.description}</small>
                    </div>
                    <div className="field"><label htmlFor="support-subject">Short subject</label><input className="input" id="support-subject" name="subject" required maxLength={160} placeholder="Summarise the request in one clear sentence" /></div>
                  </div>
                </fieldset>

                <fieldset className="support-form-section">
                  <legend>{selectedCategory.label} details</legend>
                  <p>Answer every required question. Do not include passwords, one-time codes, backup codes or full payment-card information.</p>
                  <div className="form-grid support-dynamic-fields" key={selectedCategory.id}>
                    {selectedCategory.fields.map((field) => <SupportIntakeField key={field.name} field={field} />)}
                  </div>
                </fieldset>

                <fieldset className="support-form-section">
                  <legend>Evidence and attachments</legend>
                  <p>Attach files only when they help explain or evidence the issue. Safety evidence may contain upsetting material and is kept private for authorised review.</p>
                  <div className="field full">
                    <label htmlFor="support-files">Files <span>(optional)</span></label>
                    <input className="input support-file-input" id="support-files" type="file" multiple accept="image/*,video/mp4,video/webm,video/quicktime,audio/*,.pdf,.txt,.csv,.json,.zip" onChange={(event) => setSelectedFiles(Array.from(event.currentTarget.files ?? []).slice(0, 8))} />
                    <small>Up to eight files, 100 MB each. Files remain private and are subject to security scanning and restricted staff access.</small>
                    {selectedFiles.length > 0 && <ul className="support-file-list">{selectedFiles.map((file) => <li key={`${file.name}-${file.lastModified}`}>{file.name} · {formatBytes(file.size)}</li>)}</ul>}
                  </div>
                </fieldset>

                <label className="support-consent"><input type="checkbox" required /> <span>I confirm that the information is accurate to the best of my knowledge and understand that my ticket and attachments will be stored securely and reviewed by authorised ESB Games staff to investigate and respond.</span></label>

                {serviceState === "checking" && <div className="form-alert neutral" role="status">Checking the secure support service…</div>}
                {serviceState === "unavailable" && <div className="form-alert error" role="alert">{serviceMessage ?? "Online ticket creation is temporarily unavailable."} Please try again shortly or contact <a href="mailto:support@esbgames.com">support@esbgames.com</a>.</div>}
                {error && <div className="form-alert error" role="alert">{error}</div>}

                <div className="modal-actions">
                  <button className="button button-primary" disabled={submitting || serviceState !== "available"}>{submitting ? "Creating secure ticket…" : "Create private ticket"}</button>
                  <button className="button button-secondary" type="button" onClick={() => setOpen(false)}>Cancel</button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}

function SupportIntakeField({ field }: { field: SupportField }) {
  const id = `support-${field.name}`;
  const className = `field${field.fullWidth ? " full" : ""}`;
  return (
    <div className={className}>
      <label htmlFor={id}>{field.label}{!field.required && <span> (optional)</span>}</label>
      {field.type === "textarea" ? (
        <textarea className="input" id={id} name={field.name} required={field.required} maxLength={field.maxLength} placeholder={field.placeholder} />
      ) : field.type === "select" ? (
        <select className="input" id={id} name={field.name} required={field.required} defaultValue="">
          <option value="" disabled>Select an option</option>
          {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : (
        <input className="input" id={id} name={field.name} type={field.type} required={field.required} maxLength={field.maxLength} placeholder={field.placeholder} />
      )}
      {field.help && <small>{field.help}</small>}
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}
