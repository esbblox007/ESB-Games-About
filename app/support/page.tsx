import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SupportClient from "@/components/SupportClient";
import SupportFAQ from "@/components/SupportFAQ";
import SupportPageFreshness from "@/components/SupportPageFreshness";
import ServicePathways from "@/components/ServicePathways";
import { ArrowIcon, CheckIcon, SearchIcon, ShieldIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Support",
  description: "Open a private ESB Games support case when an account, payment, safety, creator or technical issue needs authorised staff review.",
  alternates: { canonical: "/support" },
  openGraph: {
    title: "Support | ESB Games",
    description: "Private, category-routed support for account, payment, safety, creator and technical cases.",
    url: "/support",
    type: "website",
    images: [{ url: "/hero-discover-platform.png", alt: "ESB Games Support" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Support | ESB Games",
    description: "Private, category-routed support for account, payment, safety, creator and technical cases.",
    images: ["/hero-discover-platform.png"],
  },
};

const quickHelpLinks = [
  ["Reset your password", "/support/help/reset-password"],
  ["Cancel or change a subscription", "/support/help/manage-subscription"],
  ["Request a refund", "/support/help/request-refund"],
  ["Appeal an account action", "/support/help/appeal-account-action"],
  ["Report a player or game", "/support/help/report-player-or-game"],
  ["Creator payout planning guide", "/support/help/creator-payout-guide"],
] as const;

const statusUrl = "https://status.esbgames.com";

export default function SupportPage() {
  return (
    <PageShell>
      <SupportPageFreshness />
      <section className="support-page-hero">
        <div className="support-page-container">
          <span className="eyebrow">ESB Games Support</span>
          <h1>Private help when an issue <span className="gradient-text">needs staff.</span></h1>
          <p>Support is for account-specific or evidence-based cases that need an authorised ESB Games staff member. For common how-to questions, start in Help Centre; for rules and safety guidance, use Trust Centre.</p>
          <div className="support-page-trust"><span><SearchIcon size={15} /> Category-based routing</span><span><ShieldIcon size={15} /> Department-restricted access</span><span><CheckIcon size={15} /> Private ticket conversations</span></div>
        </div>
      </section>

      <div className="support-page-container service-pathways-wrap"><ServicePathways current="support" title="Support is the private case-handling route" /></div>

      <section className="support-page-section support-page-main">
        <div className="support-page-container">
          <SupportClient />

          <div className="support-routing-note">
            <ShieldIcon size={20} />
            <div><strong>Your ticket is a private support conversation.</strong><p>When you submit a ticket, ESB Games routes it to the appropriate authorised team. Once an eligible staff member claims the case, the conversation is between you and the authorised staff handling it. Access is restricted by staff permissions; for example, safety and abuse cases are routed to authorised Trust &amp; Safety staff.</p></div>
          </div>

          <div className="support-info-grid" id="quick-help">
            <article className="support-quick-panel">
              <h2>Quick Help</h2>
              <p className="support-panel-intro">These self-service routes may solve the issue without opening a private case.</p>
              <div className="support-quick-links" role="list">
                {quickHelpLinks.map(([label, href]) => (
                  <a key={label} href={href} role="listitem" className="support-quick-link"><span>{label}</span><ArrowIcon size={16} /></a>
                ))}
              </div>
            </article>

            <div className="support-side-stack">
              <article className="support-status-panel">
                <div><h2>Service Status</h2><span>Official live status is maintained separately</span></div>
                <p>Current availability, maintenance and incident updates are published on the dedicated ESB Games Status site rather than duplicated inside Support.</p>
                <a className="button button-secondary" href={statusUrl} target="_blank" rel="noopener noreferrer">View current service status <ArrowIcon size={15} /></a>
              </article>
              <article className="support-community-panel">
                <span><CheckIcon size={19} /></span>
                <div><h3>Need guidance instead?</h3><p>Use Help Centre for how-to articles and Trust Centre for policies, Safety Centre guidance, reporting principles and privacy information.</p><a href="/help">Open Help Centre <ArrowIcon size={15} /></a></div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="support-page-section support-faq-section" id="faq"><div className="support-page-container"><header><span className="eyebrow">Frequently asked</span><h2>Common <span className="gradient-text">questions.</span></h2></header><SupportFAQ /></div></section>
    </PageShell>
  );
}
