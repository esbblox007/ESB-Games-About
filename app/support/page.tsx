import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SupportClient from "@/components/SupportClient";
import SupportFAQ from "@/components/SupportFAQ";
import { ArrowIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Support",
  description: "Browse ESB Games help resources and preview the support routes being prepared for launch.",
};

const quickHelpLinks = [
  ["Reset your password", "/support/help/reset-password"],
  ["Cancel or change a subscription", "/support/help/manage-subscription"],
  ["Request a refund", "/support/help/request-refund"],
  ["Appeal an account action", "/support/help/appeal-account-action"],
  ["Report a player or game", "/support/help/report-player-or-game"],
  ["Creator payout guide", "/support/help/creator-payout-guide"],
] as const;

export default function SupportPage() {
  return (
    <PageShell>
      <section className="support-page-hero">
        <div className="support-page-container">
          <span className="eyebrow">ESB Games Support</span>
          <h1>How can we <span className="gradient-text">help?</span></h1>
          <p>Explore help articles, preview the support forms being prepared for launch, or check the current ESB Games service status.</p>
          <div className="support-page-trust"><span>Structured support categories</span><span>Safety concerns prioritised</span><span>Backend connection in progress</span></div>
        </div>
      </section>

      <section className="support-page-section support-page-main">
        <div className="support-page-container">
          <SupportClient />

          <div className="support-info-grid support-info-grid-clean" id="quick-help">
            <article className="support-quick-panel">
              <h2>Quick Help</h2>
              <p>These guides explain planned and available account, billing, safety and creator processes.</p>
              <div className="support-quick-links" role="list">
                {quickHelpLinks.map(([label, href]) => (
                  <a key={label} href={href} role="listitem" className="support-quick-link"><span>{label}</span><ArrowIcon size={16} /></a>
                ))}
              </div>
            </article>

            <aside className="support-status-link-panel">
              <span className="eyebrow">Live service information</span>
              <h2>Check the official status page.</h2>
              <p>Service availability should come from the dedicated ESB Games status system rather than hard-coded claims on this website.</p>
              <a className="button button-secondary" href="https://status.esbgames.com">Open status.esbgames.com <ArrowIcon size={15} /></a>
            </aside>
          </div>
        </div>
      </section>

      <section className="support-page-section support-faq-section" id="faq">
        <div className="support-page-container">
          <header><span className="eyebrow">Frequently asked</span><h2>Common <span className="gradient-text">questions.</span></h2></header>
          <SupportFAQ />
        </div>
      </section>
    </PageShell>
  );
}
