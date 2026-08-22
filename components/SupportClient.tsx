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
  verificationEmailOnDemand?: boolean;
};

type ServiceState = "checking" | "available" | "unavailable";
type IntakeStep = 1 | 2 | 3;

const steps: ReadonlyArray<{ id: IntakeStep; label: string; description: string }> = [
  { id: 1, label: "Request", description: "Contact and classification" },
  { id: 2, label: "Details", description: "Information for the reviewing team" },
  { id: 3, label: "Evidence", description: "Attachments and confirmation" },
];

export default function SupportClient() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<IntakeStep>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedTicket | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("account-access");
  const [serviceState, setServiceState] = useState<ServiceState>("checking");
  const modalRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const selectedCategory = useMemo(
    () => getSupportCategoryDefinition(selectedCategoryId) ?? supportCategoryDefinitions[0],
    [selectedCategoryId],
  );

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeButtonRef.current?.focus(), 20);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const focusableNodes = modalRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
      );
      const focusable: HTMLElement[] = focusableNodes
        ? Array.from(focusableNodes).filter((element: HTMLElement) => element.offsetParent !== null)
        : [];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
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
    try {
      const response = await fetch("/api/support/health", { cache: "no-store" });
      const body = (await response.json()) as { available?: boolean };
      setServiceState(response.ok && body.available === true ? "available" : "unavailable");
    } catch {
      setServiceState("unavailable");
    }
  }

  function openTicketForm() {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setCreated(null);
    setError(null);
    setFileError(null);
    setSelectedFiles([]);
    setSelectedCategoryId("account-access");
    setStep(1);
    setOpen(true);
    void checkSupportService();
  }

  function validateStep(stepToValidate: IntakeStep) {
    const panel = formRef.current?.querySelector<HTMLElement>(`[data-support-step="${stepToValidate}"]`);
    if (!panel) return true;
    const controls: Array<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> = Array.from(
      panel.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea"),
    );
    for (const control of controls) {
      if (!control.checkValidity()) {
        control.reportValidity();
        control.focus();
        return false;
      }
    }
    if (stepToValidate === 3 && fileError) return false;
    return true;
  }

  function continueTo(nextStep: IntakeStep) {
    if (!validateStep(step)) return;
    setError(null);
    setStep(nextStep);
    window.setTimeout(() => modalRef.current?.querySelector<HTMLElement>(`[data-support-step="${nextStep}"] input, [data-support-step="${nextStep}"] select, [data-support-step="${nextStep}"] textarea`)?.focus(), 40);
  }

  function changeFiles(files: File[]) {
    const limited = files.slice(0, 8);
    const oversized = limited.find((file: File) => file.size > 100 * 1024 * 1024);
    if (files.length > 8) {
      setFileError("You can attach a maximum of eight files to the initial ticket.");
    } else if (oversized) {
      setFileError(`${oversized.name} is larger than the 100 MB file limit.`);
    } else {
      setFileError(null);
    }
    setSelectedFiles(limited);
  }

  async function submitTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateStep(3)) return;

    setSubmitting(true);
    setError(null);
    try {
      const form = new FormData(event.currentTarget);
      selectedFiles.forEach((file) => form.append("files", file));
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: authHeaders(),
        body: form,
      });
      const body = (await response.json()) as CreatedTicket & { error?: string; incidentReference?: string };
      if (!response.ok) {
        const reference = body.incidentReference ? ` Reference: ${body.incidentReference}.` : "";
        throw new Error(`${body.error ?? "Your support ticket could not be created."}${reference}`);
      }
      setCreated(body);
      event.currentTarget.reset();
      setSelectedFiles([]);
      setFileError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Your support ticket could not be created.");
      void checkSupportService();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="grid-3 support-cards" id="contact-support">
        <article className="card support-card">
          <span className="card-icon"><BookIcon /></span>
          <h3>Help Centre</h3>
          <p>Browse guidance covering accounts, billing, creator tools, safety and technical support.</p>
          <a className="card-link" href="/help">Browse articles →</a>
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
        <div className="modal-backdrop support-modal-backdrop" onMouseDown={() => setOpen(false)}>
          <section
            ref={modalRef}
            className="form-modal support-ticket-modal support-enterprise-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="support-ticket-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="support-modal-header">
              <div>
                <span className="eyebrow">ESB Games Support</span>
                <h2 id="support-ticket-title">{created ? "Your ticket is ready" : "Start a support conversation"}</h2>
                {!created && <p>Complete the guided request so the correct ESB Games team receives the information needed to investigate and respond.</p>}
              </div>
              <button ref={closeButtonRef} className="icon-button support-modal-close" type="button" aria-label="Close support form" onClick={() => setOpen(false)}><CloseIcon /></button>
            </header>

            {created ? (
              <div className="support-ticket-created support-created-enterprise" role="status">
                <span className="support-success-mark">✓</span>
                <span className="support-created-label">Ticket reference</span>
                <h3>{created.ticketReference}</h3>
                <p>Your support conversation has been securely recorded. {created.requiresEmailVerification ? "Open the private ticket and request the three-minute verification code sent to your email." : "The ticket is linked to your signed-in ESB Games account."}</p>
                {created.requiresEmailVerification && created.verificationEmailOnDemand && <p className="form-alert info">For security, the combined confirmation and verification email is sent only after you open the private ticket and request a code.</p>}
                <div className="support-created-actions">
                  <Link className="button button-primary" href={created.privatePath}>Open private ticket</Link>
                  <button className="button button-secondary" type="button" onClick={() => setOpen(false)}>Close</button>
                </div>
                <p className="support-private-link-note">Keep the private ticket link and any verification code confidential. A ticket reference alone cannot be used to access the conversation.</p>
              </div>
            ) : (
              <form ref={formRef} className="support-intake-form support-wizard" noValidate onSubmit={submitTicket}>
                <input name="website" tabIndex={-1} autoComplete="off" className="support-honeypot" aria-hidden="true" />

                <nav className="support-stepper" aria-label="Support ticket progress">
                  {steps.map((item) => {
                    const state = item.id === step ? "active" : item.id < step ? "complete" : "upcoming";
                    return (
                      <button
                        key={item.id}
                        className={`support-step ${state}`}
                        type="button"
                        aria-current={item.id === step ? "step" : undefined}
                        onClick={() => {
                          if (item.id < step) setStep(item.id);
                          else if (item.id === step + 1) continueTo(item.id);
                        }}
                      >
                        <span className="support-step-number">{item.id < step ? "✓" : item.id}</span>
                        <span><strong>{item.label}</strong><small>{item.description}</small></span>
                      </button>
                    );
                  })}
                </nav>

                <div className="support-wizard-body">
                  <section className="support-step-panel" data-support-step="1" hidden={step !== 1} aria-labelledby="support-step-one-title">
                    <div className="support-panel-heading">
                      <span>Step 1 of 3</span>
                      <h3 id="support-step-one-title">Tell us who you are and where to route the request</h3>
                      <p>Guest requests use email verification. Signed-in users are linked to their ESB Games account where possible.</p>
                    </div>

                    <div className="support-field-group">
                      <div className="support-group-heading"><strong>Contact details</strong><span>Used only to manage and respond to this ticket.</span></div>
                      <div className="form-grid support-primary-grid">
                        <div className="field">
                          <label htmlFor="support-name">Full name</label>
                          <input className="input" id="support-name" name="name" autoComplete="name" required maxLength={120} placeholder="Enter your full name" />
                        </div>
                        <div className="field">
                          <label htmlFor="support-email">Email address</label>
                          <input className="input" id="support-email" name="email" type="email" autoComplete="email" required placeholder="name@example.com" />
                          <small>Guests receive a private link and an on-demand verification code.</small>
                        </div>
                      </div>
                    </div>

                    <div className="support-field-group">
                      <div className="support-group-heading"><strong>Request classification</strong><span>Select the closest category so it reaches the correct team.</span></div>
                      <div className="form-grid support-primary-grid">
                        <div className="field">
                          <label htmlFor="support-category">Support category</label>
                          <select className="input" id="support-category" name="category" value={selectedCategoryId} onChange={(event) => setSelectedCategoryId(event.currentTarget.value)} required>
                            {supportCategoryDefinitions.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
                          </select>
                          <small>{selectedCategory.description}</small>
                        </div>
                        <div className="field">
                          <label htmlFor="support-subject">Subject</label>
                          <input className="input" id="support-subject" name="subject" required maxLength={160} placeholder="Summarise the request in one clear sentence" />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="support-step-panel" data-support-step="2" hidden={step !== 2} aria-labelledby="support-step-two-title">
                    <div className="support-panel-heading">
                      <span>Step 2 of 3</span>
                      <h3 id="support-step-two-title">Provide the information the reviewing team needs</h3>
                      <p>Questions are tailored to <strong>{selectedCategory.label}</strong>. Do not include passwords, one-time codes, backup codes or full payment-card information.</p>
                    </div>
                    <div className="form-grid support-dynamic-fields support-detail-grid" key={selectedCategory.id}>
                      {selectedCategory.fields.map((field) => <SupportIntakeField key={field.name} field={field} />)}
                    </div>
                  </section>

                  <section className="support-step-panel" data-support-step="3" hidden={step !== 3} aria-labelledby="support-step-three-title">
                    <div className="support-panel-heading">
                      <span>Step 3 of 3</span>
                      <h3 id="support-step-three-title">Add evidence and confirm your request</h3>
                      <p>Attachments are private and intended only for authorised ESB Games staff reviewing the ticket.</p>
                    </div>

                    <div className="support-upload-card">
                      <div className="support-upload-copy">
                        <span className="support-upload-icon" aria-hidden="true">↑</span>
                        <div><strong>Supporting evidence</strong><p>Screenshots, videos, audio, PDFs, text logs and ZIP files can be attached when relevant.</p></div>
                      </div>
                      <label className="button button-secondary support-file-button" htmlFor="support-files">Choose files</label>
                      <input className="support-native-file" id="support-files" type="file" multiple accept="image/*,video/mp4,video/webm,video/quicktime,audio/*,.pdf,.txt,.csv,.json,.zip" onChange={(event) => changeFiles(Array.from(event.currentTarget.files ?? []))} />
                      <small>Maximum eight files, up to 100 MB each. Potentially sensitive evidence is stored privately and access-restricted.</small>
                    </div>

                    {selectedFiles.length > 0 && (
                      <ul className="support-file-list support-file-list-enterprise">
                        {selectedFiles.map((file) => (
                          <li key={`${file.name}-${file.lastModified}`}>
                            <span><strong>{file.name}</strong><small>{file.type || "File"}</small></span>
                            <span>{formatBytes(file.size)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {fileError && <div className="form-alert error" role="alert">{fileError}</div>}

                    <div className="support-review-card">
                      <div><span>Category</span><strong>{selectedCategory.label}</strong></div>
                      <div><span>Attachments</span><strong>{selectedFiles.length || "None"}</strong></div>
                      <div><span>Access</span><strong>Private ticket</strong></div>
                    </div>

                    <label className="support-consent support-enterprise-consent">
                      <input type="checkbox" required />
                      <span><strong>Confirmation</strong>I confirm that the information is accurate to the best of my knowledge and understand that the ticket and attachments will be securely stored and reviewed by authorised ESB Games staff.</span>
                    </label>

                    {error && <div className="form-alert error" role="alert">{error}</div>}
                  </section>
                </div>

                <footer className="support-wizard-footer">
                  <div className={`support-service-indicator ${serviceState}`} role="status" aria-live="polite">
                    <span aria-hidden="true" />
                    {serviceState === "available" ? "Secure submission service ready" : serviceState === "checking" ? "Checking secure submission service" : "Connection will be confirmed when you submit"}
                  </div>
                  <div className="support-wizard-actions">
                    {step > 1 && <button className="button button-secondary" type="button" onClick={() => setStep((step - 1) as IntakeStep)}>Back</button>}
                    {step < 3 ? (
                      <button className="button button-primary" type="button" onClick={() => continueTo((step + 1) as IntakeStep)}>Continue</button>
                    ) : (
                      <button className="button button-primary" type="submit" disabled={submitting}>{submitting ? "Creating secure ticket…" : "Create private ticket"}</button>
                    )}
                  </div>
                </footer>
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
      <label htmlFor={id}>{field.label}{!field.required && <span>Optional</span>}</label>
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
