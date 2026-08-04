"use client";

import { useState } from "react";
import type { Job } from "@/lib/content/careers";

export default function CareerApplicationForm({ job }: { job: Job }) {
  const [cvName, setCvName] = useState("");

  return (
    <section className="career-role-application" id="application" aria-labelledby="application-heading">
      <div className="career-role-application-heading">
        <span className="eyebrow">Application preview</span>
        <h2 id="application-heading">Apply for {job.title}</h2>
        <p>
          The application interface is ready for the ESB Games recruitment backend. Online submissions are not enabled yet,
          so completing this preview will not send or store your information.
        </p>
      </div>

      <form className="career-role-form" onSubmit={(event) => event.preventDefault()}>
        <input type="hidden" name="roleId" value={job.slug} />
        <div className="career-role-form-grid">
          <label><span>Full name</span><input type="text" name="fullName" autoComplete="name" placeholder="Your full name" /></label>
          <label><span>Email address</span><input type="email" name="email" autoComplete="email" placeholder="you@example.com" /></label>
          <label><span>Country</span><input type="text" name="country" autoComplete="country-name" placeholder="United Kingdom" /></label>
          <label><span>Timezone</span><input type="text" name="timezone" placeholder="GMT / UTC+1" /></label>
          <label><span>Portfolio or LinkedIn</span><input type="url" name="portfolioUrl" placeholder="https://" /></label>
          <label><span>Current availability</span><input type="text" name="availability" placeholder="For example: evenings, weekends or full-time" /></label>
          <label className="full"><span>Relevant experience</span><textarea name="experience" placeholder="Tell us about the work, projects or responsibilities most relevant to this role." /></label>
          <label className="full"><span>Why are you a strong fit?</span><textarea name="motivation" placeholder={job.applicationPrompt} /></label>
          <label className="full"><span>Additional information</span><textarea name="additionalInformation" placeholder="Share anything else that would help us understand your application." /></label>
          <label className="career-upload-field full">
            <span>CV or résumé</span>
            <input
              type="file"
              name="cv"
              accept=".pdf,.doc,.docx"
              onChange={(event) => setCvName(event.target.files?.[0]?.name || "")}
            />
            <b>{cvName || "Choose a PDF, DOC or DOCX file"}</b>
            <small>Visual preview only. Files are not uploaded until the recruitment backend is connected.</small>
          </label>
          <label className="career-consent full">
            <input type="checkbox" name="consent" />
            <span>I understand this is a frontend preview and no application will be submitted or stored.</span>
          </label>
        </div>

        <div className="career-role-form-actions">
          <button className="button button-primary" type="submit" disabled aria-disabled="true">Online applications opening soon</button>
          <p>Need help with your application? <a href={`mailto:careers@esbgames.com?subject=${encodeURIComponent(`Question about ${job.title}`)}`}>Contact careers@esbgames.com</a>.</p>
        </div>
      </form>
    </section>
  );
}
