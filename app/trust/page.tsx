import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { ArrowIcon, BookIcon, PrivacyIcon, ShieldIcon, UsersIcon } from "@/components/Icons";
import { trustSections } from "@/lib/content/trust";
import { getPolicyPublicationState, isKnownPolicySlug } from "@/lib/content/policy-publication";
import styles from "./TrustOverview.module.css";

export const metadata: Metadata = {
  title: "Trust, Safety & Legal",
  description: "ESB Games policies, safety guidance, family resources, creator rules and privacy information in one Trust Centre.",
  alternates: { canonical: "/trust" },
  openGraph: {
    title: "Trust, Safety & Legal | ESB Games",
    description: "Policies, safety guidance, family resources and privacy information for the ESB Games ecosystem.",
    url: "/trust",
    type: "website",
    images: [{ url: "/hero-discover-platform.png", alt: "ESB Games Trust, Safety and Legal Centre" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trust, Safety & Legal | ESB Games",
    description: "Policies, safety guidance, family resources and privacy information for the ESB Games ecosystem.",
    images: ["/hero-discover-platform.png"],
  },
};

function publicationStatus(href: string) {
  if (!href.startsWith("/")) return null;
  const slug = href.split(/[?#]/)[0].replace(/^\/+/, "");
  if (!isKnownPolicySlug(slug)) return null;
  return getPolicyPublicationState(slug) === "published" ? "Published" : "In final review";
}

const featured = [
  { title: "Safety Centre", description: "Understand the safety principles, reporting routes and family safeguards being built into ESB Games.", href: "/trust/safety", icon: <ShieldIcon size={20} /> },
  { title: "For parents & families", description: "Find Family Centre information, parental guidance and age-appropriate control resources.", href: "/parental-controls", icon: <UsersIcon size={20} /> },
  { title: "Privacy & data", description: "See privacy, data-request, retention and security information in one place.", href: "#privacy-security", icon: <PrivacyIcon size={20} /> },
] as const;

export default function TrustPage() {
  return (
    <PageShell>
      <div className="trust-page">
        <section className="trust-hero">
          <div className="trust-container trust-hero-grid-compact">
            <div>
              <span className="eyebrow">ESB Games Trust Centre</span>
              <h1>Clear rules.<br /><span className="gradient-text">Safer experiences.</span></h1>
              <p>Find legal terms, safety guidance, family resources, creator policies, privacy information and support routes for the ESB Games ecosystem.</p>
              <div className="trust-hero-actions"><Link href="/trust/safety" className="button button-primary"><ShieldIcon size={17} /> Safety Centre</Link><Link href="/help" className="button button-secondary">Help Centre <ArrowIcon size={16} /></Link></div>
            </div>
            <aside className={styles.heroVisual} aria-label="ESB Games trust framework">
              <div className={styles.core}><ShieldIcon /><strong>ESB Trust</strong><small>Built into the ecosystem</small></div>
              <span className={`${styles.node} ${styles.nodeOne}`}><ShieldIcon size={16} /> Safety</span>
              <span className={`${styles.node} ${styles.nodeTwo}`}><UsersIcon size={16} /> Families</span>
              <span className={`${styles.node} ${styles.nodeThree}`}><PrivacyIcon size={16} /> Privacy</span>
              <span className={`${styles.node} ${styles.nodeFour}`}><BookIcon size={16} /> Rules & rights</span>
              <span className={styles.status}><strong>Pre-launch:</strong> approved policies publish here when final review is complete.</span>
            </aside>
          </div>
        </section>

        <section className="trust-resource-section">
          <div className="trust-container">
            <header className="trust-section-heading"><span className="eyebrow">Start here</span><h2>Find the right route first.</h2><p>Use the priority routes below for practical guidance, then browse the full policy library by subject.</p></header>
            <div className={styles.featuredGrid}>{featured.map((item) => <Link key={item.title} href={item.href} className={styles.featuredCard}><span className={styles.featuredIcon}>{item.icon}</span><span><strong>{item.title}</strong><p>{item.description}</p></span></Link>)}</div>

            <header className="trust-section-heading"><span className="eyebrow">Policies & resources</span><h2>Browse by subject.</h2><p>Each policy route shows whether the document is published or still in final review before presenting it as effective policy.</p></header>
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

        <section className="trust-final-band"><div className="trust-container"><div className="trust-final-card"><div><span className="eyebrow">Need practical help?</span><h2>Go straight to the Help Centre.</h2><p>Account, billing, safety and creator questions are easier to solve through task-based help than through policy documents.</p></div><Link href="/help" className="button button-primary">Open Help Centre <ArrowIcon size={16} /></Link></div></div></section>
      </div>
    </PageShell>
  );
}
