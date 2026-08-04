import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SupportClient from "@/components/SupportClient";
import SupportFAQ from "@/components/SupportFAQ";
import SupportPageFreshness from "@/components/SupportPageFreshness";
import { ArrowIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Support",
  description: "Browse ESB Games help resources, start a private support conversation and visit the official service status website.",
};

const quickHelpLinks = [
  ["Reset your password", "/support/help/reset-password"],
  ["Cancel or change a subscription", "/support/help/manage-subscription"],
  ["Request a refund", "/support/help/request-refund"],
  ["Appeal an account action", "/support/help/appeal-account-action"],
  ["Report a player or game", "/support/help/report-player-or-game"],
  ["Creator payout guide", "/support/help/creator-payout-guide"],
] as const;

const statusUrl = "https://status.esbgames.com";

export default function SupportPage() {
  return (
    <PageShell>
      <SupportPageFreshness />
      <section className="support-page-hero">
        <div className="support-page-container">
          <span className="eyebrow">ESB Games Support</span>
          <h1>How can we <span className="gradient-text">help?</span></h1>
          <p>Support for players, parents and creators. Browse help options, start a private support conversation or check the official service status website.</p>
          <div className="support-page-trust"><span>◷ Help organised by topic</span><span>● Safety concerns prioritised</span><span>◎ Official service updates</span></div>
        </div>
      </section>

      <section className="support-page-section support-page-main">
        <div className="support-page-container">
          <SupportClient />

          <div className="support-info-grid" id="quick-help">
            <article className="support-quick-panel">
              <h2>Quick Help</h2>
              <div className="support-quick-links" role="list">
                {quickHelpLinks.map(([label, href]) => (
                  <a key={label} href={href} role="listitem" className="support-quick-link">
                    <span>{label}</span>
                    <ArrowIcon size={16} />
                  </a>
                ))}
              </div>
            </article>

            <div className="support-side-stack">
              <article className="support-status-panel">
                <div><h2>Platform Status</h2><span>● Official status website</span></div>
                <p><span>Play Platform</span><a href={statusUrl} target="_blank" rel="noopener noreferrer">View live status</a></p>
                <p><span>ESB Studio</span><a href={statusUrl} target="_blank" rel="noopener noreferrer">View live status</a></p>
                <p><span>Authentication</span><a href={statusUrl} target="_blank" rel="noopener noreferrer">View live status</a></p>
                <p><span>Family Centre</span><a href={statusUrl} target="_blank" rel="noopener noreferrer">View live status</a></p>
                <p><span>Support services</span><a href={statusUrl} target="_blank" rel="noopener noreferrer">View live status</a></p>
              </article>
              <article className="support-community-panel">
                <span>◉</span>
                <div>
                  <h3>ESB Games Status</h3>
                  <p>View current service availability, planned maintenance and incident updates on the dedicated status website.</p>
                  <a href={statusUrl} target="_blank" rel="noopener noreferrer">Open the status website <ArrowIcon size={15} /></a>
                </div>
              </article>
            </div>
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
