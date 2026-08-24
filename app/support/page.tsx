import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SupportAccountBridge from "@/components/SupportAccountBridge";
import SupportClient from "@/components/SupportClient";
import SupportFAQ from "@/components/SupportFAQ";
import SupportPageFreshness from "@/components/SupportPageFreshness";
import { ArrowIcon, CheckIcon, SearchIcon, ShieldIcon, TicketIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Support",
  description: "Browse ESB Games help resources, start a private support conversation and visit the official service status website.",
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
  ["Appeal a warning, restriction or ban", "/support/appeal"],
  ["Report a player or game", "/support/help/report-player-or-game"],
  ["Creator payout planning guide", "/support/help/creator-payout-guide"],
] as const;

const statusUrl = "https://status.esbgames.com";

export default function SupportPage() {
  return (
    <PageShell>
      <SupportPageFreshness />
      <SupportAccountBridge />
      <section className="support-page-hero">
        <div className="support-page-container">
          <Link href="/help" className="help-back-link"><ArrowIcon size={15} /> Back to Help</Link>
          <span className="eyebrow">ESB Games Support</span>
          <h1>How can we <span className="gradient-text">help?</span></h1>
          <p>Support for players, parents and creators. Browse help options, open a private ticket conversation or check the official service status website.</p>
          <div className="support-page-trust"><span><SearchIcon size={15} /> Help organised by topic</span><span><ShieldIcon size={15} /> Safety concerns routed securely</span><span><CheckIcon size={15} /> Private ticket conversations</span></div>
        </div>
      </section>

      <section className="support-page-section support-page-main">
        <div className="support-page-container">
          <article className="support-appeal-banner">
            <span className="support-appeal-icon"><ShieldIcon size={22} /></span>
            <div>
              <span className="eyebrow">Enforcement review</span>
              <h2>Appeal a warning, restriction or ban</h2>
              <p>Request a review of warnings, temporary or permanent bans, account restrictions, communication restrictions, content removals and other disciplinary actions.</p>
            </div>
            <Link className="button button-primary" href="/support/appeal">Start an appeal <ArrowIcon size={15} /></Link>
          </article>

          <SupportClient />

          <div className="support-info-grid" id="quick-help">
            <article className="support-quick-panel">
              <h2>Quick Help</h2>
              <div className="support-quick-links" role="list">
                {quickHelpLinks.map(([label, href]) => (
                  <a key={label} href={href} role="listitem" className="support-quick-link"><span>{label}</span><ArrowIcon size={16} /></a>
                ))}
              </div>
            </article>

            <div className="support-side-stack">
              <article className="support-status-panel">
                <div><h2>Service Status</h2><span>Official live status is maintained separately</span></div>
                <p>Current availability, maintenance and active incident updates are published on the dedicated ESB Games Status site so there is one reliable live source.</p>
                <a className="button button-secondary" href={statusUrl} target="_blank" rel="noopener noreferrer">View current service status <ArrowIcon size={15} /></a>
              </article>
              <article className="support-community-panel support-direct-help-panel">
                <span><TicketIcon size={19} /></span>
                <div><h3>Need direct help?</h3><p>Start a private support conversation and route your issue to the appropriate ESB Games team.</p><a href="#submit-ticket">Open a support ticket <ArrowIcon size={15} /></a></div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="support-page-section support-faq-section" id="faq"><div className="support-page-container"><header><span className="eyebrow">Frequently asked</span><h2>Common <span className="gradient-text">questions.</span></h2></header><SupportFAQ /></div></section>
    </PageShell>
  );
}
