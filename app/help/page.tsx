import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import HelpCentreBrowser from "@/components/HelpCentreBrowser";
import ServicePathways from "@/components/ServicePathways";
import { SearchIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Help Centre",
  description: "Self-service ESB Games guidance for accounts, safety, payments, creator tools, families and technical issues. Private cases belong in Support.",
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
              <h1>Find the answer.<br/><span className="gradient-text">Then escalate only if needed.</span></h1>
              <p>Help Centre is the self-service knowledge base for common tasks and questions. It does not hold private case conversations; if an issue needs account-specific investigation or evidence review, open Support instead.</p>
              <div className="help-quick-actions">
                <Link className="button button-secondary" href="/support/help/reset-password">Reset password</Link>
                <Link className="button button-secondary" href="/support/help/report-player-or-game">Reporting guide</Link>
                <a className="button button-secondary" href="https://status.esbgames.com" target="_blank" rel="noreferrer">Service status</a>
                <Link className="button button-primary" href="/support#contact-support">Open private Support</Link>
              </div>
            </div>
          </div>
        </section>

        <div className="help-centre-container service-pathways-wrap"><ServicePathways current="help" title="Use the right ESB Games help surface" /></div>

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
              <div><span className="eyebrow">Still need staff help?</span><h2>Open a private case.</h2><p>Support creates a private conversation and routes the case using the category and details you provide. Staff access is controlled by role and department.</p></div>
              <Link className="button button-primary" href="/support#contact-support"><SearchIcon size={17} /> Contact Support</Link>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
