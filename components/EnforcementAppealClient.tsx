"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Account = { id: string; username: string; displayName: string; email: string | null };
type AppealResult = {
  ticketReference: string;
  privatePath: string;
  requiresEmailVerification: boolean;
  reviewStatus: string;
  structuredRecordPending?: boolean;
  attachmentUploadFailed?: boolean;
};

const actionTypes = [
  "Warning",
  "Temporary ban",
  "Permanent ban",
  "Account restriction",
  "Communication restriction",
  "Content or asset removal",
  "Creator or marketplace enforcement",
  "Other disciplinary action",
] as const;

function localDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function EnforcementAppealClient() {
  const [account, setAccount] = useState<Account | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AppealResult | null>(null);
  const [dateBounds, setDateBounds] = useState({ today: "", tomorrow: "" });

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    setDateBounds({ today: localDateValue(today), tomorrow: localDateValue(tomorrow) });

    let active = true;
    fetch("/api/support/account-session", { credentials: "include", cache: "no-store" })
      .then((response) => response.json())
      .then((body: { authenticated?: boolean; account?: Account }) => {
        if (active && body.authenticated && body.account) setAccount(body.account);
      })
      .catch(() => {})
      .finally(() => { if (active) setSessionChecked(true); });
    return () => { active = false; };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSubmitting(true);
    setError(null);
    try {
      const form = new FormData(formElement);
      const response = await fetch("/api/support/appeals", {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const body = await response.json() as AppealResult & { error?: string; incidentReference?: string };
      if (!response.ok) {
        throw new Error(`${body.error ?? "Your appeal could not be submitted."}${body.incidentReference ? ` Reference: ${body.incidentReference}.` : ""}`);
      }
      setResult(body);
      formElement.reset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Your appeal could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    const appealInboxPath = `/support/tickets?lane=appeals&reference=${encodeURIComponent(result.ticketReference)}`;
    const primaryPath = result.requiresEmailVerification ? result.privatePath : appealInboxPath;
    return (
      <div className="support-ticket-created support-created-enterprise" role="status">
        <span className="support-success-mark">✓</span>
        <span className="support-created-label">Appeal submitted</span>
        <h2>{result.ticketReference}</h2>
        <p>Your appeal has been securely recorded and routed to the ESB Games Appeals review queue. Its current review status is <strong>{result.reviewStatus}</strong>.</p>
        {result.requiresEmailVerification && <p className="form-alert info">Because you submitted while signed out, verify your email when you open the private appeal ticket. After verification, the conversation remains available under Appeal Support.</p>}
        {result.structuredRecordPending && <p className="form-alert info">Your appeal is safely in the Appeals ticket queue. Its structured Appeals index is still catching up, but you do not need to submit it again.</p>}
        {result.attachmentUploadFailed && <p className="form-alert info">Your appeal was submitted, but one or more evidence files did not finish uploading. Open the private appeal ticket to add the files without creating another appeal.</p>}
        <div className="support-created-actions">
          <Link className="button button-primary" href={primaryPath}>{result.requiresEmailVerification ? "Verify and open appeal ticket" : "Open appeal conversation"}</Link>
          <Link className="button button-secondary" href={appealInboxPath}>Appeal Support</Link>
        </div>
      </div>
    );
  }

  return (
    <form className="support-appeal-form" onSubmit={submit}>
      <input name="website" tabIndex={-1} autoComplete="off" className="support-honeypot" aria-hidden="true" />

      <section className="support-field-group">
        <div className="support-group-heading"><strong>Identity</strong><span>Appeals are linked to the account where possible.</span></div>
        {!sessionChecked ? (
          <div className="form-alert info">Checking your ESB Games session…</div>
        ) : account ? (
          <>
            <div className="support-account-identity">
              <div><strong>Signed in as {account.username}</strong><span>{account.email ?? "No contact email is currently available for this account"}</span></div>
              <a href="https://esbgames.com/settings">Manage account</a>
            </div>
            {!account.email && <div className="field"><label htmlFor="appeal-email">Contact email</label><input id="appeal-email" className="input" name="email" type="email" required autoComplete="email" /><small>This is only required because the signed-in account does not currently expose a contact email.</small></div>}
          </>
        ) : (
          <>
            <div className="form-alert info">Sign in to link this appeal directly to your ESB Games account, or continue using a verified email address.</div>
            <div className="support-appeal-grid">
              <div className="field"><label htmlFor="appeal-name">Full name</label><input id="appeal-name" className="input" name="name" required maxLength={120} autoComplete="name" /></div>
              <div className="field"><label htmlFor="appeal-email">Email address</label><input id="appeal-email" className="input" name="email" type="email" required autoComplete="email" /></div>
            </div>
            <a className="button button-secondary support-appeal-signin-button" href={`https://esbgames.com/login?returnTo=${encodeURIComponent("https://about.esbgames.com/support/appeal")}`}>Sign in to ESB Games</a>
          </>
        )}
      </section>

      <section className="support-field-group">
        <div className="support-group-heading"><strong>Enforcement action</strong><span>Tell us exactly what decision you want reviewed.</span></div>
        <div className="support-appeal-grid">
          <div className="field"><label htmlFor="appeal-action">Action being appealed</label><select id="appeal-action" className="input" name="actionType" required defaultValue=""><option value="" disabled>Select an action</option>{actionTypes.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
          <div className="field"><label htmlFor="appeal-reference">Enforcement/action reference <span>Optional</span></label><input id="appeal-reference" className="input" name="enforcementReference" maxLength={200} placeholder="For example: moderation reference or case ID" /></div>
          <div className="field full"><label htmlFor="appeal-scope">Affected account, experience, asset or content <span>Optional</span></label><input id="appeal-scope" className="input" name="actionScope" maxLength={500} placeholder="Username, account ID, experience ID, asset ID or other relevant reference" /></div>
          <div className="field"><label htmlFor="appeal-issued">Date action was issued <span>Optional</span></label><input id="appeal-issued" className="input" name="actionIssuedAt" type="date" max={dateBounds.today || undefined} title="Choose today or an earlier date." /></div>
          <div className="field"><label htmlFor="appeal-expires">Restriction/ban end date <span>Optional</span></label><input id="appeal-expires" className="input" name="actionExpiresAt" type="date" min={dateBounds.tomorrow || undefined} title="Choose a future date." /></div>
        </div>
      </section>

      <section className="support-field-group">
        <div className="support-group-heading"><strong>Your appeal</strong><span>Give the reviewer enough information to reassess the decision.</span></div>
        <div className="support-appeal-grid">
          <div className="field full"><label htmlFor="appeal-reason">Why should this action be reviewed?</label><textarea id="appeal-reason" className="input" name="appealReason" required minLength={20} maxLength={10000} placeholder="Explain what you believe was incorrect or incomplete, including relevant context or evidence." /></div>
          <div className="field full"><label htmlFor="appeal-outcome">What outcome are you requesting?</label><textarea id="appeal-outcome" className="input" name="requestedOutcome" required minLength={5} maxLength={3000} placeholder="For example: remove the warning, shorten the restriction, restore the account, or reconsider the content decision." /></div>
          <div className="field full"><label htmlFor="appeal-files">Supporting evidence <span>Optional</span></label><input id="appeal-files" className="input" name="files" type="file" multiple accept="image/*,video/mp4,video/webm,video/quicktime,audio/*,.pdf,.txt,.csv,.json,.zip" /><small>Up to eight files, maximum 100 MB each. Do not upload passwords, one-time codes or backup codes.</small></div>
        </div>
      </section>

      <label className="support-consent support-enterprise-consent"><input type="checkbox" required /><span><strong>Confirmation</strong>I confirm the information provided is accurate to the best of my knowledge and understand that submitting an appeal does not guarantee the original action will be changed.</span></label>
      {error && <div className="form-alert error" role="alert">{error}</div>}
      <div className="support-wizard-actions"><button className="button button-primary" type="submit" disabled={submitting}>{submitting ? "Submitting appeal…" : "Submit appeal for review"}</button></div>
    </form>
  );
}
