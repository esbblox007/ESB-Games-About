import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SupportClient from "@/components/SupportClient";
import SupportFAQ from "@/components/SupportFAQ";
import { ArrowIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Support",
  description: "Browse ESB Games help resources, submit a support ticket or track an existing request.",
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
          <p>Real support for players, parents and creators. Browse help options, submit a ticket or track an existing request.</p>
          <div className="support-page-trust"><span>◷ Response targets by priority</span><span>● Safety reports prioritised</span><span>◎ Support built for global access</span></div>
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
                <div><h2>Platform Status</h2><span>● Pre launch systems</span></div>
                <p><span>Public platform</span><strong>In development</strong></p>
                <p><span>ESB Studio and publishing</span><strong>In development</strong></p>
                <p><span>Payments and billing</span><strong>Not live</strong></p>
                <p><span>Authentication</span><strong>Prototype ready</strong></p>
                <p><span>Support tickets</span><strong>Available</strong></p>
              </article>
              <article className="support-community-panel"><span>◉</span><div><h3>Community support</h3><p>Connect with the ESB Games community and staff through the official server.</p><a href="/support/help/reset-password">Join the community <ArrowIcon size={15} /></a></div></article>
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
