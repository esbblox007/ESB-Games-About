import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import HelpCentreBrowser from "@/components/HelpCentreBrowser";
import ServicePathways from "@/components/ServicePathways";
import { SearchIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Help Centre",
  description: "Self-service ESB Games guidance for accounts, safety, policies, payments, creator tools, families and technical issues. Private cases belong in Support.",
  alternates: { canonical: "/help" },
};

export default function HelpCentrePage() {
  return (
    <PageShell>
      <div className="help-centre-page help-centre-page-structured">
        <section className="help-centre-hero">
          <div className="help-centre-container">
            <div className="help-centre-hero-copy">
              <span className="eyebrow">ESB Games Help Centre</span>
              <h1>Find help fast.<br/><span className="gradient-text">Get support when you need it.</span></h1>
              <p>Use Help Centre for step-by-step guidance, safety information, policies and common questions. If your issue needs account-specific investigation, evidence review or an authorised staff response, open a private Support case.</p>
              <div className="help-quick-actions">
                <Link className="button button-secondary" href="/help/safety-reporting">Reporting &amp; safety</Link>
                <a className="button button-secondary" href="https://status.esbgames.com" target="_blank" rel="noreferrer">Service status</a>
                <Link className="button button-primary" href="/support#contact-support">Open private Support</Link>
              </div>
            </div>
          </div>
        </section>

        <div className="help-centre-container service-pathways-wrap"><ServicePathways current="help" title="Choose the right place for help" /></div>

        <section className="help-centre-section">
          <div className="help-centre-container">
            <header className="help-browser-intro">
              <span className="eyebrow">Browse Help</span>
              <h2>Browse by topic.</h2>
              <p>Choose a topic to open its own Help Centre page, or search for the subject you need. Guidance is kept separate so you are not faced with one long page of links.</p>
            </header>
            <HelpCentreBrowser />
          </div>
        </section>

        <section className="help-contact-band help-contact-band-compact">
          <div className="help-centre-container">
            <div className="help-contact-card">
              <div><span className="eyebrow">Still need staff help?</span><h2>Open a private case.</h2><p>Support creates a private conversation and routes the case using the category and details you provide. Staff access is controlled by role and department.</p></div>
              <Link className="button button-primary" href="/support#contact-support"><SearchIcon size={17} /> Contact Support</Link>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
