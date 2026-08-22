import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { ArrowIcon, BookIcon, ShieldIcon } from "@/components/Icons";
import { trustSections } from "@/lib/content/trust";

export const metadata: Metadata = {
  title: "Trust, Safety & Legal",
  description: "The essential ESB Games policies, safety guidance and rights information in one clear Trust Centre.",
  alternates: { canonical: "/trust" },
  openGraph: {
    title: "Trust, Safety & Legal | ESB Games",
    description: "Essential policies and safety information for ESB Games.",
    url: "/trust",
  },
};

const icons = [<BookIcon key="rules" />, <ShieldIcon key="safety" />];

export default function TrustPage() {
  return (
    <PageShell>
      <div className="trust-page trust-page-compact">
        <section className="trust-hero trust-hero-compact">
          <div className="trust-container trust-hero-grid-compact">
            <div>
              <span className="eyebrow">ESB Games Trust Centre</span>
              <h1>Clear rules.<br /><span className="gradient-text">Safer play.</span></h1>
              <p>The essential rules, privacy information and safety routes in one place.</p>
              <div className="trust-hero-actions">
                <Link href="/trust/safety" className="button button-primary"><ShieldIcon size={17} /> Safety Centre</Link>
                <Link href="/help" className="button button-secondary">Help Centre <ArrowIcon size={16} /></Link>
              </div>
            </div>
            <aside className="trust-compact-note">
              <strong>Need a specialist document?</strong>
              <p>Use site search by policy name. Account, payment, Creator and technical questions belong in the Help Centre.</p>
            </aside>
          </div>
        </section>

        <section className="trust-resource-section trust-resource-section-compact">
          <div className="trust-container">
            <header className="trust-section-heading trust-section-heading-compact">
              <span className="eyebrow">Core resources</span>
              <h2>The essentials.</h2>
            </header>
            <div className="trust-section-grid">
              {trustSections.map((section, index) => (
                <article className="trust-section-card trust-section-card-compact" key={section.id} id={section.id}>
                  <header><span className="trust-section-icon">{icons[index]}</span><div><h3>{section.title}</h3><p>{section.description}</p></div></header>
                  <div className="trust-resource-list">
                    {section.resources.map((item) => (
                      <Link key={item.slug} href={item.href} className="trust-resource-row trust-resource-row-compact"><span><strong>{item.title}</strong><small>{item.description}</small></span><ArrowIcon size={15} /></Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="trust-final-band trust-final-band-compact">
          <div className="trust-container"><div className="trust-final-card"><div><span className="eyebrow">Need practical help?</span><h2>Go straight to the Help Centre.</h2><p>Account, payment, safety and Creator questions are easier to solve through task-based help than through policy documents.</p></div><Link href="/help" className="button button-primary">Open Help Centre <ArrowIcon size={16} /></Link></div></div>
        </section>
      </div>
    </PageShell>
  );
}
