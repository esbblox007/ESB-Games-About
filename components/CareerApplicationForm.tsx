"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import type { ApplicationField, LiveJob } from "@/lib/content/careers-live";

type SubmissionState = { tone: "success" | "error" | "info"; message: string; reference?: string } | null;

function makeIdempotencyKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function fieldKey(field: ApplicationField, index: number) {
  return String(field.internalKey ?? field.key ?? field.id ?? `field-${index}`);
}

function fieldTitle(field: ApplicationField) {
  return String(field.title ?? field.label ?? "Application question");
}

function isStandardField(field: ApplicationField) {
  const value = `${fieldKey(field, 0)} ${fieldTitle(field)}`.toLowerCase();
  return ["full name", "email", "country", "location", "timezone", "portfolio", "linkedin", "availability", "experience", "motivation", "additional information", "cv", "résumé", "resume"].some((needle) => value.includes(needle));
}

export default function CareerApplicationForm({ job }: { job: LiveJob }) {
  const idempotencyRef = useRef(makeIdempotencyKey());
  const [cv, setCv] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<SubmissionState>(null);
  const [acceptedConsents, setAcceptedConsents] = useState<string[]>([]);
  const extraFields = useMemo(() => job.applicationFields.filter((field) => !isStandardField(field)), [job.applicationFields]);
  const liveReady = Boolean(job.applicationFormVersionId);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!liveReady || busy) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const requiredConsentIds = job.consents.filter((consent) => consent.required).map((consent) => consent.id);
    if (requiredConsentIds.some((id) => !acceptedConsents.includes(id))) {
      setState({ tone: "error", message: "Accept the required application privacy statements before submitting." });
      return;
    }

    setBusy(true);
    setState({ tone: "info", message: "Submitting your application securely…" });
    try {
      const data = new FormData(form);
      const fileReferences: string[] = [];
      if (cv) {
        const upload = new FormData();
        upload.set("file", cv);
        upload.set("publicSlug", job.slug);
        upload.set("category", "CV or résumé");
        upload.set("idempotencyKey", idempotencyRef.current);
        const response = await fetch("/api/careers/uploads", { method: "POST", body: upload });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error ?? "Your CV could not be uploaded.");
        fileReferences.push(String(body.fileReference));
      }

      const answers: Record<string, unknown> = {
        country: data.get("country"),
        timezone: data.get("timezone"),
        portfolioUrl: data.get("portfolioUrl"),
        availability: data.get("availability"),
        experience: data.get("experience"),
        motivation: data.get("motivation"),
        additionalInformation: data.get("additionalInformation"),
      };
      extraFields.forEach((field, index) => { answers[fieldKey(field, index)] = data.get(`extra:${fieldKey(field, index)}`); });

      const response = await fetch("/api/careers/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicSlug: job.slug,
          formVersionId: job.applicationFormVersionId,
          consentVersionIds: acceptedConsents,
          answers,
          fileReferences,
          candidate: {
            fullName: String(data.get("fullName") ?? ""),
            email: String(data.get("email") ?? ""),
            location: String(data.get("country") ?? ""),
            timezone: String(data.get("timezone") ?? ""),
          },
          idempotencyKey: idempotencyRef.current,
          website: String(data.get("website") ?? ""),
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error ?? "Your application could not be submitted.");
      setState({ tone: "success", message: body.emailSent ? "Your application has been submitted. A confirmation email is on its way." : "Your application has been submitted successfully.", reference: body.applicationId });
      form.reset();
      setCv(null);
      setAcceptedConsents([]);
      idempotencyRef.current = makeIdempotencyKey();
    } catch (error) {
      setState({ tone: "error", message: error instanceof Error ? error.message : "Your application could not be submitted." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="career-role-application" id="application" aria-labelledby="application-heading">
      <div className="career-role-application-heading">
        <span className="eyebrow">Application</span>
        <h2 id="application-heading">Apply for {job.title}</h2>
        <p>{liveReady ? "Complete the form below. Your application and files are sent securely to the ESB Games recruitment workspace." : "Online applications for this role are not currently available."}</p>
      </div>

      <form className="career-role-form" onSubmit={submit}>
        <input className="career-honeypot" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <input type="hidden" name="roleId" value={job.slug} />
        <div className="career-role-form-grid">
          <label><span>Full name *</span><input required type="text" name="fullName" autoComplete="name" maxLength={120} placeholder="Your full name" /></label>
          <label><span>Email address *</span><input required type="email" name="email" autoComplete="email" maxLength={254} placeholder="you@example.com" /></label>
          <label><span>Country *</span><input required type="text" name="country" autoComplete="country-name" maxLength={100} placeholder="United Kingdom" /></label>
          <label><span>Timezone *</span><input required type="text" name="timezone" maxLength={80} placeholder="Europe/London" /></label>
          <label><span>Portfolio or LinkedIn</span><input type="url" name="portfolioUrl" placeholder="https://" /></label>
          <label><span>Current availability *</span><input required type="text" name="availability" maxLength={250} placeholder="For example: full-time from September" /></label>
          <label className="full"><span>Relevant experience *</span><textarea required name="experience" maxLength={6000} placeholder="Tell us about work, projects or responsibilities relevant to this role." /></label>
          <label className="full"><span>Why are you a strong fit? *</span><textarea required name="motivation" maxLength={6000} placeholder={job.applicationPrompt} /></label>
          <label className="full"><span>Additional information</span><textarea name="additionalInformation" maxLength={4000} placeholder="Share anything else that would help us understand your application." /></label>

          {extraFields.map((field, index) => {
            const key = fieldKey(field, index);
            const title = fieldTitle(field);
            const type = String(field.type ?? "Long Text").toLowerCase();
            if (type.includes("select") || type.includes("choice")) return (
              <label className="full" key={key}><span>{title}{field.required ? " *" : ""}</span><select name={`extra:${key}`} required={field.required} defaultValue=""><option value="" disabled>Select an option</option>{(field.options ?? []).map((option) => <option key={option}>{option}</option>)}</select>{field.helpText && <small>{field.helpText}</small>}</label>
            );
            if (type.includes("long") || type.includes("textarea")) return <label className="full" key={key}><span>{title}{field.required ? " *" : ""}</span><textarea name={`extra:${key}`} required={field.required} maxLength={6000} placeholder={field.placeholder} />{field.helpText && <small>{field.helpText}</small>}</label>;
            return <label key={key}><span>{title}{field.required ? " *" : ""}</span><input name={`extra:${key}`} required={field.required} type={type.includes("url") ? "url" : type.includes("number") ? "number" : "text"} maxLength={1000} placeholder={field.placeholder} />{field.helpText && <small>{field.helpText}</small>}</label>;
          })}

          <label className="career-upload-field full"><span>CV or résumé *</span><input required type="file" name="cv" accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp" onChange={(event) => setCv(event.target.files?.[0] ?? null)} /><b>{cv?.name || "Choose a PDF, DOC, DOCX, TXT or image file"}</b><small>Maximum 15 MB. Files are stored privately and are only available to authorised recruitment staff.</small></label>

          {job.consents.map((consent) => (
            <label className="career-consent full" key={consent.id}><input type="checkbox" required={consent.required} checked={acceptedConsents.includes(consent.id)} onChange={(event) => setAcceptedConsents((current) => event.target.checked ? [...current, consent.id] : current.filter((id) => id !== consent.id))} /><span><strong>{consent.title}{consent.required ? " *" : ""}</strong>{typeof consent.content === "string" ? ` ${consent.content}` : " I have read and accept this application privacy statement."}</span></label>
          ))}
        </div>

        {state && <div className={`career-submission-state ${state.tone}`} role="status"><strong>{state.message}</strong>{state.reference && <span>Application reference: {state.reference}</span>}</div>}
        <div className="career-role-form-actions"><button className="button button-primary" type="submit" disabled={!liveReady || busy}>{busy ? "Submitting…" : liveReady ? "Submit application" : "Online applications unavailable"}</button><p>Need help with your application? <a href={`mailto:careers@esbgames.com?subject=${encodeURIComponent(`Question about ${job.title}`)}`}>Contact careers@esbgames.com</a>.</p></div>
      </form>
    </section>
  );
}
