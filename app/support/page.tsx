import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SupportClient from "@/components/SupportClient";
import SupportFAQ from "@/components/SupportFAQ";
import SupportPageFreshness from "@/components/SupportPageFreshness";
import { ArrowIcon, CheckIcon, SearchIcon, ShieldIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Support",
  description: "Browse ESB Games help resources, start a private support conversation and visit the official service status website.",
  alternates: { canonical: "/support" },
  openGraph: { title: "Support | ESB Games", description: "Browse help resources and start a private ESB Games support conversation.", url: "/support", type: "website" },
  twitter: { card: "summary_large_image", title: "Support | ESB Games", description: "Browse help resources and start a private ESB Games support conversation." },
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
          <h1>How can we <span className="gradient-text">help?</span></h1>
          <p>Support for players, parents and creators. Browse help options, open a private ticket conversation or check the official service status website.</p>
          <div className="support-page-trust"><span><SearchIcon size={15} /> Help organised by topic</span><span><ShieldIcon size={15} /> Safety concerns routed securely</span><span><CheckIcon size={15} /> Private ticket conversations</span></div>
        </div>
      </section>

      <section className="support-page-section support-page-main">
        <div className="support-page-container">
          <div className="support-routing-note support-privacy-notice">
            <ShieldIcon size={20} />
            <div><strong>Before you submit: your ticket and evidence are private support records.</strong><p>ESB Games uses the information to authenticate, route, investigate and respond to the case. Access is permission-based and restricted to staff who need the information for the relevant function. Do not include passwords, one-time codes or full payment-card numbers. <Link href="/support/privacy">Read the Support Privacy Notice</Link>.</p></div>
          </div>

          <SupportClient />

          <div className="support-routing-note">
            <ShieldIcon size={20} />
            <div><strong>Your ticket is a private support conversation.</strong><p>When you submit a ticket, ESB Games routes it to the appropriate authorised team. Once an eligible staff member claims the case, the conversation is between you and the authorised staff handling it. Access is restricted by staff permissions; for example, safety and abuse cases are routed to authorised Trust &amp; Safety staff.</p></div>
          </div>

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
                <p>To avoid showing stale or duplicated service information here, current availability, maintenance and incident updates are published on the dedicated ESB Games Status site.</p>
                <a className="button button-secondary" href={statusUrl} target="_blank" rel="noopener noreferrer">View current service status <ArrowIcon size={15} /></a>
              </article>
              <article className="support-community-panel">
                <span><CheckIcon size={19} /></span>
                <div><h3>One source of truth</h3><p>The Status site is the official source for service availability, planned maintenance and active incident information.</p><a href={statusUrl} target="_blank" rel="noopener noreferrer">Open the status website <ArrowIcon size={15} /></a></div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="support-page-section support-faq-section" id="faq"><div className="support-page-container"><header><span className="eyebrow">Frequently asked</span><h2>Common <span className="gradient-text">questions.</span></h2></header><SupportFAQ /></div></section>
    </PageShell>
  );
}
