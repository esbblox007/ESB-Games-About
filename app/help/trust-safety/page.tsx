import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { ArrowIcon, BookIcon, CubeIcon, LockIcon, ScaleIcon, ShieldIcon, TicketIcon, UsersIcon } from "@/components/Icons";
import { trustSections } from "@/lib/content/trust";
import { getPolicyPublicationState, isKnownPolicySlug } from "@/lib/content/policy-publication";

const description = "ESB Games safety guidance, platform rules, privacy information, family resources and policy documents.";

export const metadata: Metadata = {
  title: "Trust & Safety",
  description,
  alternates: { canonical: "/help/trust-safety" },
  openGraph: {
    title: "Trust & Safety | ESB Games",
    description: "Safety guidance, policies and rights information for the ESB Games ecosystem.",
    url: "/help/trust-safety",
    type: "website",
    images: [{ url: "/hero-discover-platform.png", alt: "ESB Games Trust & Safety" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trust & Safety | ESB Games",
    description,
    images: ["/hero-discover-platform.png"],
  },
};

const pillars = [
  ["Prevention", "Safer product design, privacy controls and age-aware systems are considered as ESB Games is built."],
  ["Detection", "Reports, automated systems and appropriately authorised human review are intended to help identify harmful content and behaviour."],
  ["Enforcement", "Warnings, restrictions, content removal and account action are designed to scale with the severity and context of a violation."],
  ["Appeals", "Eligible moderation decisions can be challenged through the documented appeals route as that process becomes available."],
] as const;

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

export default function TrustSafetyPage() {
  return (
    <PageShell>
      <div className="trust-page help-trust-page">
        <section className="trust-hero trust-hero-compact">
          <div className="trust-container help-trust-hero-copy">
            <Link href="/help" className="help-back-link"><ArrowIcon size={15} /> Back to Help</Link>
            <span className="eyebrow">Trust &amp; Safety</span>
            <h1>Clear rules.<br /><span className="gradient-text">Safer systems.</span></h1>
            <p>Find ESB Games safety guidance, rules, privacy information and policy resources here. If a specific account, message, purchase or safety concern needs staff review, use private Support.</p>
            <div className="trust-hero-actions"><Link href="#safety-framework" className="button button-primary"><ShieldIcon size={17} /> Safety framework</Link><Link href="/support#contact-support" className="button button-secondary">Open Support <ArrowIcon size={16} /></Link></div>
          </div>
        </section>

        <section className="safety-centre-content help-safety-framework" id="safety-framework">
          <div className="trust-container">
            <header className="trust-section-heading trust-section-heading-compact"><span className="eyebrow">Safety framework</span><h2>How safety is designed to work.</h2><p>High-level safety principles for prevention, review, enforcement and appeals across the ESB Games ecosystem.</p></header>
            <div className="safety-pillar-grid">{pillars.map(([title, text]) => <article key={title}><span><ShieldIcon /></span><h2>{title}</h2><p>{text}</p></article>)}</div>
          </div>
        </section>

        <section className="trust-resource-section trust-resource-section-compact">
          <div className="trust-container">
            <header className="trust-section-heading trust-section-heading-compact"><span className="eyebrow">Policies &amp; resources</span><h2>Rules, rights and guidance.</h2><p>Browse by subject and see whether a policy is published or still being reviewed.</p></header>
            <div className="trust-section-grid">
              {trustSections.map((section) => (
                <article className="trust-section-card trust-section-card-compact" key={section.id} id={section.id}>
                  <header><span className="trust-section-icon">{sectionIcon(section.id)}</span><div><h3>{section.title}</h3><p>{section.description}</p></div></header>
                  <div className="trust-resource-list">
                    {section.resources.map((item) => {
                      const status = publicationStatus(item.href);
                      const content = <><span><strong>{item.title}</strong><small>{item.description}</small>{status && <small className="trust-resource-status">{status}</small>}</span><ArrowIcon size={15} /></>;
                      return item.external ? <a key={item.slug} href={item.href} target="_blank" rel="noreferrer" className="trust-resource-row trust-resource-row-compact">{content}</a> : <Link key={item.slug} href={item.href} className="trust-resource-row trust-resource-row-compact">{content}</Link>;
                    })}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
