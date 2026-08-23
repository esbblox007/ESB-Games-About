import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import ServicePathways from "@/components/ServicePathways";
import { ArrowIcon, BookIcon, CubeIcon, LockIcon, ScaleIcon, ShieldIcon, TicketIcon, UsersIcon } from "@/components/Icons";
import { trustSections } from "@/lib/content/trust";
import { getPolicyPublicationState, isKnownPolicySlug } from "@/lib/content/policy-publication";

export const metadata: Metadata = {
  title: "Trust, Safety & Legal",
  description: "The ESB Games home for policies, Safety Centre guidance, privacy information, family resources and governance—not a replacement for private Support.",
  alternates: { canonical: "/trust" },
  openGraph: { title: "Trust, Safety & Legal | ESB Games", description: "Policies, safety and rights information for the ESB Games ecosystem.", url: "/trust", type: "website", images: [{ url: "/hero-discover-platform.png", alt: "ESB Games Trust Centre" }] },
  twitter: { card: "summary_large_image", title: "Trust, Safety & Legal | ESB Games", description: "Policies, safety and rights information for the ESB Games ecosystem.", images: ["/hero-discover-platform.png"] },
};

function publicationStatus(href: string) {
  if (!href.startsWith("/")) return null;
  const slug = href.split(/[?#]/)[0].replace(/^\/+/, "");
  if (!isKnownPolicySlug(slug)) return null;
  return getPolicyPublicationState(slug) === "published" ? "Published" : "In final review";
}

function sectionIcon(id: string) {
  switch (id) {
    case "legal": return <ScaleIcon />;
    case "safety": return <ShieldIcon />;
    case "families": return <UsersIcon />;
    case "creators": return <CubeIcon />;
    case "privacy-security": return <LockIcon />;
    case "support": return <TicketIcon />;
    default: return <BookIcon />;
  }
}

export default function TrustPage() {
  return (
    <PageShell>
      <div className="trust-page">
        <section className="trust-hero trust-hero-compact">
          <div className="trust-container trust-hero-grid-compact">
            <div>
              <span className="eyebrow">ESB Games Trust Centre</span>
              <h1>Clear rules.<br /><span className="gradient-text">Safer systems.</span></h1>
              <p>Trust Centre is the source of truth for policies, safety guidance, privacy information and governance. For step-by-step fixes use Help Centre; for a private case that needs staff, use Support.</p>
              <div className="trust-hero-actions"><Link href="/trust/safety" className="button button-primary"><ShieldIcon size={17} /> Safety Centre</Link><Link href="/help" className="button button-secondary">Help Centre <ArrowIcon size={16} /></Link></div>
            </div>
            <aside className="trust-system-visual" aria-label="ESB Games Trust system overview">
              <div className="trust-system-centre"><ShieldIcon size={30} /><strong>ESB Trust</strong><span>Safety, rights and governance</span></div>
              <div className="trust-system-nodes">
                <span><ShieldIcon size={16} /> Safety</span>
                <span><UsersIcon size={16} /> Families</span>
                <span><LockIcon size={16} /> Privacy</span>
                <span><CubeIcon size={16} /> Creators</span>
                <span><ScaleIcon size={16} /> Rules</span>
              </div>
              <p>Public guidance and policy information live here. Account-specific investigations stay inside private Support.</p>
            </aside>
          </div>
        </section>

        <div className="trust-container service-pathways-wrap"><ServicePathways current="trust" title="Trust, Help, Support and Family Centre have different jobs" /></div>

        <section className="trust-resource-section trust-resource-section-compact">
          <div className="trust-container">
            <header className="trust-section-heading trust-section-heading-compact"><span className="eyebrow">Policies & resources</span><h2>Everything in one place.</h2><p>Browse by subject and see whether a document is published or still in review before opening it.</p></header>
            <div className="trust-section-grid">
              {trustSections.map((section) => (
                <article className="trust-section-card trust-section-card-compact" key={section.id} id={section.id}>
                  <header><span className="trust-section-icon">{sectionIcon(section.id)}</span><div><h3>{section.title}</h3><p>{section.description}</p></div></header>
                  <div className="trust-resource-list">
                    {section.resources.map((item) => {
                      const status = publicationStatus(item.href);
                      return (
                        <Link key={item.slug} href={item.href} className="trust-resource-row trust-resource-row-compact">
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

        <section className="trust-final-band trust-final-band-compact"><div className="trust-container"><div className="trust-final-card"><div><span className="eyebrow">Need something resolved?</span><h2>Choose self-service or a private case.</h2><p>Use Help Centre for task-based guidance. If the issue needs account-specific investigation, evidence review or an authorised department, open a private Support ticket.</p></div><div className="trust-hero-actions"><Link href="/help" className="button button-secondary">Open Help Centre</Link><Link href="/support#contact-support" className="button button-primary">Contact Support <ArrowIcon size={16} /></Link></div></div></div></section>
      </div>
    </PageShell>
  );
}
