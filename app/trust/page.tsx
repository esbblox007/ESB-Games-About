import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import ServicePathways from "@/components/ServicePathways";
import { ArrowIcon, BookIcon, ShieldIcon } from "@/components/Icons";
import { trustSections } from "@/lib/content/trust";
import { getPolicyPublicationState, isKnownPolicySlug } from "@/lib/content/policy-publication";

export const metadata: Metadata = {
  title: "Trust, Safety & Legal",
  description: "The ESB Games home for policies, Safety Centre guidance, privacy information, family resources and governance—not a replacement for private Support.",
  alternates: { canonical: "/trust" },
  openGraph: { title: "Trust, Safety & Legal | ESB Games", description: "Policies, safety and rights information for the ESB Games ecosystem.", url: "/trust", type: "website" },
  twitter: { card: "summary_large_image", title: "Trust, Safety & Legal | ESB Games", description: "Policies, safety and rights information for the ESB Games ecosystem." },
};

function publicationStatus(href: string) {
  if (!href.startsWith("/")) return null;
  const slug = href.split(/[?#]/)[0].replace(/^\/+/, "");
  if (!isKnownPolicySlug(slug)) return null;
  return getPolicyPublicationState(slug) === "published" ? "Published" : "In final review";
}

export default function TrustPage() {
  return (
    <PageShell>
      <div className="trust-page">
        <section className="trust-hero">
          <div className="trust-container trust-hero-grid-compact">
            <div>
              <span className="eyebrow">ESB Games Trust Centre</span>
              <h1>Clear rules.<br /><span className="gradient-text">Safer play.</span></h1>
              <p>Trust Centre is the source of truth for policies, safety guidance, privacy information and governance. For step-by-step fixes use Help Centre; for a private case that needs staff, use Support.</p>
              <div className="trust-hero-actions"><Link href="/trust/safety" className="button button-primary"><ShieldIcon size={17} /> Safety Centre</Link><Link href="/help" className="button button-secondary">Help Centre <ArrowIcon size={16} /></Link></div>
            </div>
            <aside className="trust-compact-note"><strong>Policies and guidance, not a ticket queue</strong><p>Use this area to understand rules, safety systems, privacy and rights. Private reports and account-specific investigations belong in Support, where access can be restricted to the authorised team.</p></aside>
          </div>
        </section>

        <div className="trust-container service-pathways-wrap"><ServicePathways current="trust" title="Trust, Help, Support and Family Centre have different jobs" /></div>

        <section className="trust-resource-section">
          <div className="trust-container">
            <header className="trust-section-heading"><span className="eyebrow">Policies & resources</span><h2>Everything in one place.</h2><p>Browse by subject and see whether a document is published or still in review before opening it.</p></header>
            <div className="trust-section-grid">
              {trustSections.map((section, index) => (
                <article className="trust-section-card" key={section.id} id={section.id}>
                  <header><span className="trust-section-icon">{index % 2 === 0 ? <BookIcon /> : <ShieldIcon />}</span><div><h3>{section.title}</h3><p>{section.description}</p></div></header>
                  <div className="trust-resource-list">
                    {section.resources.map((item) => {
                      const status = publicationStatus(item.href);
                      return (
                        <Link key={item.slug} href={item.href} className="trust-resource-row">
                          <span><strong>{item.title}</strong><small>{item.description}</small>{status && <small className="trust-resource-status">{status}</small>}</span>
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

        <section className="trust-final-band"><div className="trust-container"><div className="trust-final-card"><div><span className="eyebrow">Need something resolved?</span><h2>Choose self-service or a private case.</h2><p>Use Help Centre for task-based guidance. If the issue needs account-specific investigation, evidence review or an authorised department, open a private Support ticket.</p></div><div className="trust-hero-actions"><Link href="/help" className="button button-secondary">Open Help Centre</Link><Link href="/support#contact-support" className="button button-primary">Contact Support <ArrowIcon size={16} /></Link></div></div></div></section>
      </div>
    </PageShell>
  );
}
