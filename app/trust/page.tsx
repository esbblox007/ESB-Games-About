import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { ArrowIcon, BookIcon, ShieldIcon } from "@/components/Icons";
import { trustSections } from "@/lib/content/trust";

export const metadata: Metadata = {
  title: "Trust, Safety & Legal",
  description: "ESB Games policies, safety guidance, family resources, creator rules and privacy information in one Trust Centre.",
  alternates: { canonical: "/trust" },
  openGraph: { title: "Trust, Safety & Legal | ESB Games", description: "Policies, safety and rights information for the ESB Games ecosystem.", url: "/trust" },
  twitter: { card: "summary_large_image", title: "Trust, Safety & Legal | ESB Games", description: "Policies, safety and rights information for the ESB Games ecosystem." },
};

export default function TrustPage() {
  return (
    <PageShell>
      <div className="trust-page">
        <section className="trust-hero">
          <div className="trust-container trust-hero-grid-compact">
            <div>
              <span className="eyebrow">ESB Games Trust Centre</span>
              <h1>Clear rules.<br /><span className="gradient-text">Safer play.</span></h1>
              <p>Find legal terms, safety guidance, family resources, creator policies, privacy information and support routes for ESB Games.</p>
              <div className="trust-hero-actions">
                <Link href="/trust/safety" className="button button-primary"><ShieldIcon size={17} /> Safety Centre</Link>
                <Link href="/help" className="button button-secondary">Help Centre <ArrowIcon size={16} /></Link>
              </div>
            </div>
            <aside className="trust-compact-note">
              <strong>Pre-launch policy review</strong>
              <p>Policy routes are available for discoverability, but draft wording is not presented as effective policy. Each document will be published only after its final review and approval.</p>
            </aside>
          </div>
        </section>

        <section className="trust-resource-section">
          <div className="trust-container">
            <header className="trust-section-heading">
              <span className="eyebrow">Policies & resources</span>
              <h2>Everything in one place.</h2>
              <p>Browse by subject rather than needing to know the exact name of a document.</p>
            </header>
            <div className="trust-section-grid">
              {trustSections.map((section, index) => (
                <article className="trust-section-card" key={section.id} id={section.id}>
                  <header><span className="trust-section-icon">{index % 2 === 0 ? <BookIcon /> : <ShieldIcon />}</span><div><h3>{section.title}</h3><p>{section.description}</p></div></header>
                  <div className="trust-resource-list">
                    {section.resources.map((item) => (
                      <Link key={item.slug} href={item.href} className="trust-resource-row"><span><strong>{item.title}</strong><small>{item.description}</small></span><ArrowIcon size={15} /></Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="trust-final-band">
          <div className="trust-container"><div className="trust-final-card"><div><span className="eyebrow">Need practical help?</span><h2>Go straight to the Help Centre.</h2><p>Account, billing, safety and creator questions are easier to solve through task-based help than through policy documents.</p></div><Link href="/help" className="button button-primary">Open Help Centre <ArrowIcon size={16} /></Link></div></div>
        </section>
      </div>
    </PageShell>
  );
}
