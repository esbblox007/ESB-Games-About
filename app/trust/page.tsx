import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { ArrowIcon, BookIcon, GlobeIcon, ShieldIcon, UsersIcon } from "@/components/Icons";
import { PRODUCT_STATE } from "@/lib/site-config";
import { trustSections } from "@/lib/content/trust";

export const metadata: Metadata = {
  title: "Trust, Safety & Legal",
  description: "Explore ESB Games safety, family, privacy, creator and legal resources being prepared for public launch.",
  alternates: { canonical: "/trust" },
  openGraph: {
    title: "Trust, Safety & Legal | ESB Games",
    description: "Building an environment where everyone can discover, belong and build safely.",
    url: "/trust",
  },
};

const icons = [<BookIcon key="legal" />, <ShieldIcon key="safety" />, <UsersIcon key="families" />, <GlobeIcon key="creators" />, <ShieldIcon key="privacy" />, <BookIcon key="support" />];

export default function TrustPage() {
  return (
    <PageShell>
      <div className="trust-page">
        <section className="trust-hero">
          <div className="trust-container trust-hero-grid">
            <div>
              <span className="eyebrow">ESB Games Trust Centre</span>
              <h1>Trust, Safety<br />&amp; <span className="gradient-text">Legal.</span></h1>
              <p>Building an environment where everyone can discover, belong and build safely. This centre brings together the public resources being prepared for the ESB Games ecosystem.</p>
              <div className="trust-hero-actions"><Link href="/trust/safety" className="button button-primary"><ShieldIcon size={17} /> Safety Centre</Link><Link href="/parental-controls" className="button button-secondary">Family Centre <ArrowIcon size={16} /></Link></div>
            </div>
            <aside className="trust-truth-card" aria-label="Document availability guide">
              <span className="eyebrow">Pre-launch truth model</span>
              <h2>Clear about what is ready.</h2>
              <dl>
                <div><dt><i className="trust-state-dot available" /> Available now</dt><dd>Public resources or services that can be used today.</dd></div>
                <div><dt><i className="trust-state-dot development" /> In development</dt><dd>Active work that is not yet a final public release.</dd></div>
                <div><dt><i className="trust-state-dot planned" /> Planned</dt><dd>Future capability that should not be treated as available yet.</dd></div>
              </dl>
            </aside>
          </div>
        </section>

        <section className="trust-resource-section">
          <div className="trust-container">
            <header className="trust-section-heading"><span className="eyebrow">Public resources</span><h2>Everything in one <span className="gradient-text">trusted place.</span></h2><p>Unfinished policy drafts are not published here. Pre-launch documents use a clear temporary state until final text is approved.</p></header>
            <div className="trust-section-grid">
              {trustSections.map((section, index) => (
                <article className="trust-section-card" key={section.id} id={section.id}>
                  <header><span className="trust-section-icon">{icons[index]}</span><div><h3>{section.title}</h3><p>{section.description}</p></div></header>
                  <div className="trust-resource-list">
                    {section.resources.map((resource) => {
                      const content = <><span><strong>{resource.title}</strong><small>{resource.description}</small></span><span className={`trust-state-pill ${resource.state}`}>{PRODUCT_STATE[resource.state]}</span><ArrowIcon size={15} /></>;
                      return resource.external ? <a key={resource.slug} href={resource.href} target="_blank" rel="noreferrer" className="trust-resource-row">{content}</a> : <Link key={resource.slug} href={resource.href || `/legal/${resource.slug}`} className="trust-resource-row">{content}</Link>;
                    })}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="trust-final-band">
          <div className="trust-container"><div className="trust-final-card"><div><span className="eyebrow">Need help now?</span><h2>Support and safety concerns have a clear route.</h2><p>Use ESB Games Support for account, billing, technical or safety requests. Emergency situations should be reported to the appropriate local emergency service.</p></div><Link href="/support" className="button button-primary">Go to Support <ArrowIcon size={16} /></Link></div></div>
        </section>
      </div>
    </PageShell>
  );
}
