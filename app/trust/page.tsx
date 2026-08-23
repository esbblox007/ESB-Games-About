import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { ArrowIcon, ShieldIcon } from "@/components/Icons";
import { trustSections } from "@/lib/content/trust";
import { getPolicyPublicationState, isKnownPolicySlug } from "@/lib/content/policy-publication";

export const metadata: Metadata = {
  title: "Trust, Safety & Legal",
  description: "ESB Games policies, safety guidance, family resources, creator rules and privacy information in one Trust Centre.",
  alternates: { canonical: "/trust" },
  openGraph: {
    title: "Trust, Safety & Legal | ESB Games",
    description: "Policies, safety and rights information for the ESB Games ecosystem.",
    url: "/trust",
    type: "website",
    images: [{ url: "/trust-hero-framework.svg", alt: "ESB Games Trust Centre safety framework illustration" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trust, Safety & Legal | ESB Games",
    description: "Policies, safety and rights information for the ESB Games ecosystem.",
    images: ["/trust-hero-framework.svg"],
  },
};

function publicationStatus(href: string) {
  if (!href.startsWith("/")) return null;
  const slug = href.split(/[?#]/)[0].replace(/^\/+/, "");
  if (!isKnownPolicySlug(slug)) return null;
  return getPolicyPublicationState(slug) === "published" ? "Published" : "Review draft";
}

function TrustSectionIcon({ id }: { id: string }) {
  if (id === "legal") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h8l3 3V20.5H7V3.5Z"/><path d="M15 3.5v4h4M10 11h5M10 14.5h5M10 18h3"/></svg>;
  if (id === "safety") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8 20 6v5.5c0 5.1-3 8.6-8 10.7-5-2.1-8-5.6-8-10.7V6l8-3.2Z"/><path d="m8.5 12.2 2.2 2.2 4.8-5"/></svg>;
  if (id === "families") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.3"/><path d="M3.5 19c.4-3.8 2.5-5.8 5.5-5.8s5.1 2 5.5 5.8M14 14.4c1-.8 2-1.1 3.1-1.1 2.2 0 3.7 1.4 4 4.2"/></svg>;
  if (id === "creators") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8.2 7-4.5 5 4.5 5M15.8 7l4.5 5-4.5 5M13.8 4.5l-3.6 15"/></svg>;
  if (id === "privacy-security") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10M12 14v2.5"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13a8 8 0 0 1 16 0v4.5a2 2 0 0 1-2 2h-2.5v-6H20M4 13h4.5v6H6a2 2 0 0 1-2-2v-4Z"/><path d="M12 21h3"/></svg>;
}

const framework = [
  { icon: "shield", title: "Safety by design", text: "Safety requirements are intended to be built into product, moderation, reporting and creator workflows rather than added after launch." },
  { icon: "family", title: "Families in the loop", text: "Family Centre and parental-control work is designed around clearer visibility, age-appropriate settings and practical parent or guardian controls." },
  { icon: "review", title: "Clear decisions & review", text: "Rules, enforcement and appeals are being documented together so users can understand expectations and how eligible decisions can be reviewed." },
] as const;

const process = [
  ["01", "Set expectations", "Publish clear rules, age guidance and creator requirements before users are expected to follow them."],
  ["02", "Reduce risk", "Use product controls, permissions, moderation systems and family safeguards to reduce foreseeable harm."],
  ["03", "Report & review", "Route safety, support and policy concerns into the appropriate human-reviewed workflow."],
  ["04", "Act & improve", "Apply proportionate decisions, preserve audit history and use incidents or appeals to improve systems and policy."],
] as const;

export default function TrustPage() {
  return (
    <PageShell>
      <div className="trust-page trust-page-expanded">
        <section className="trust-hero trust-hero-expanded">
          <div className="trust-container trust-hero-layout">
            <div className="trust-hero-copy">
              <span className="eyebrow">ESB Games Trust Centre</span>
              <h1>Clear rules.<br /><span className="gradient-text">Safer play.</span></h1>
              <p>One place for ESB Games safety guidance, family resources, legal terms, creator rules, privacy information and support routes.</p>
              <div className="trust-hero-actions">
                <Link href="/trust/safety" className="button button-primary"><ShieldIcon size={17} /> Safety Centre</Link>
                <Link href="/help" className="button button-secondary">Help Centre <ArrowIcon size={16} /></Link>
              </div>
              <div className="trust-hero-status"><span /><div><strong>Pre-launch review</strong><small>Policy drafts are available for review but are not treated as effective terms until explicitly approved and published.</small></div></div>
            </div>
            <div className="trust-hero-visual" aria-label="Trust and safety framework illustration">
              <img src="/trust-hero-framework.svg" alt="A shield connected to legal, family, privacy and support safeguards" />
              <div className="trust-visual-label"><span>TRUST FRAMEWORK</span><strong>Rules · Safety · Privacy · Review</strong></div>
            </div>
          </div>
        </section>

        <section className="trust-framework-section">
          <div className="trust-container">
            <header className="trust-section-heading trust-heading-narrow"><span className="eyebrow">How we are building trust</span><h2>Safety is a system, not a single page.</h2><p>The Trust Centre connects the rules users see with the product, family, moderation and review processes being built behind them.</p></header>
            <div className="trust-framework-grid">
              {framework.map((item) => <article key={item.title}><span className={`trust-framework-icon ${item.icon}`}><TrustSectionIcon id={item.icon === "family" ? "families" : item.icon === "review" ? "legal" : "safety"}/></span><h3>{item.title}</h3><p>{item.text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="trust-process-section">
          <div className="trust-container trust-process-layout">
            <div className="trust-process-copy"><span className="eyebrow">Trust lifecycle</span><h2>From a rule to a real decision.</h2><p>Policies should describe how the platform actually works. This is the operating model ESB Games is aligning policy and product work around before public launch.</p><Link href="/reporting-enforcement-policy" className="trust-text-link">Review Reporting &amp; Enforcement <ArrowIcon size={15}/></Link></div>
            <ol className="trust-process-list">{process.map(([number,title,text]) => <li key={number}><span>{number}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol>
          </div>
        </section>

        <section className="trust-resource-section">
          <div className="trust-container">
            <header className="trust-section-heading"><span className="eyebrow">Policies & resources</span><h2>Everything in one place.</h2><p>Browse by subject. Every policy shows whether it is an approved publication or a review draft before you rely on it.</p></header>
            <div className="trust-section-grid">
              {trustSections.map((section) => (
                <article className="trust-section-card trust-section-card-professional" key={section.id} id={section.id}>
                  <header><span className="trust-section-icon trust-section-icon-svg"><TrustSectionIcon id={section.id}/></span><div><h3>{section.title}</h3><p>{section.description}</p></div></header>
                  <div className="trust-resource-list">
                    {section.resources.map((item) => {
                      const status = publicationStatus(item.href);
                      return (
                        <Link key={item.slug} href={item.href} className="trust-resource-row">
                          <span><strong>{item.title}</strong><small>{item.description}</small>{status && <small className={`trust-resource-status ${status === "Published" ? "published" : "review"}`}>{status}</small>}</span>
                          <ArrowIcon size={15} />
                        </Link>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="trust-final-band"><div className="trust-container"><div className="trust-final-card"><div><span className="eyebrow">Need practical help?</span><h2>Use the right route for the problem.</h2><p>Account, billing, safety and creator questions belong in the Help Centre or Support workflow. Policy pages explain the rules; support routes help resolve individual cases.</p></div><div className="trust-final-actions"><Link href="/help" className="button button-primary">Open Help Centre <ArrowIcon size={16} /></Link><Link href="/support" className="button button-secondary">Contact Support</Link></div></div></div></section>
      </div>
    </PageShell>
  );
}
