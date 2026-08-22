import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import HelpCentreBrowser from "@/components/HelpCentreBrowser";
import { SearchIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Help Centre",
  description: "Find ESB Games help for Accounts, safety, payments, Creator tools, families and technical issues.",
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
              <h1>How can we <span className="gradient-text">help?</span></h1>
              <p>Start with the area that best matches what you need. Search across Account help, safety, payments, Creator support, family controls, privacy and service information.</p>
              <div className="help-quick-actions">
                <Link className="button button-secondary" href="/support/help/reset-password">Reset password</Link>
                <Link className="button button-secondary" href="/support/help/report-player-or-game">Report a problem</Link>
                <a className="button button-secondary" href="https://status.esbgames.com" target="_blank" rel="noreferrer">Service status</a>
                <Link className="button button-primary" href="/support#contact-support">Contact Support</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="help-centre-section">
          <div className="help-centre-container">
            <header className="help-browser-intro">
              <span className="eyebrow">Browse Help</span>
              <h2>Find the right route without the clutter.</h2>
              <p>Help is grouped by the type of problem rather than one long list. Open a section, choose the closest task, or search across everything.</p>
            </header>
            <HelpCentreBrowser />
          </div>
        </section>

        <section className="help-contact-band help-contact-band-compact">
          <div className="help-centre-container">
            <div className="help-contact-card">
              <div><span className="eyebrow">Still need help?</span><h2>Contact the right team.</h2><p>Send a private support request and ESB Games will route it using the category and details you provide.</p></div>
              <Link className="button button-primary" href="/support#contact-support"><SearchIcon size={17} /> Contact Support</Link>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
