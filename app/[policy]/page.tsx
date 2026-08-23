import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import PolicyMarkdown from "@/components/PolicyMarkdown";
import { policyBySlug, policyDocuments } from "@/lib/content/policies-data";
import { isPublishedPolicy } from "@/lib/content/policy-publication";

export const dynamicParams = false;

export function generateStaticParams() {
  return policyDocuments.map(({ slug }) => ({ policy: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ policy: string }> }): Promise<Metadata> {
  const { policy: slug } = await params;
  const item = policyBySlug[slug];
  if (!item) return { title: "Policy not found", robots: { index: false, follow: false } };
  const published = isPublishedPolicy(slug);
  const description = published
    ? `${item.title} for the ESB Games ecosystem.`
    : `${item.title} review draft for ESB Games. This draft is not currently in effect.`;
  return {
    title: item.title,
    description,
    alternates: { canonical: `/${item.slug}` },
    robots: published ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: { title: `${item.title} | ESB Games`, description, url: `/${item.slug}`, type: "article" },
    twitter: { card: "summary_large_image", title: `${item.title} | ESB Games`, description },
  };
}

export default async function PolicyPage({ params }: { params: Promise<{ policy: string }> }) {
  const { policy: slug } = await params;
  const item = policyBySlug[slug];
  if (!item) notFound();
  const published = isPublishedPolicy(slug);

  return (
    <PageShell>
      <div className={`policy-page ${published ? "policy-page-published" : "policy-page-review"}`}>
        <header className="policy-hero">
          <div className="policy-container">
            <nav className="policy-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/trust">Trust, Safety &amp; Legal</Link><span>/</span><span aria-current="page">{item.title}</span></nav>
            <span className="page-eyebrow">{item.category}</span>
            <h1>{item.title}</h1>
            {!published && <p className="policy-hero-review-label"><span /> Review draft · not currently in effect</p>}
          </div>
        </header>
        <section className="policy-content-section">
          <div className="policy-container policy-document-card">
            {!published && (
              <div className="policy-review-banner" role="status">
                <div className="policy-review-banner-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 3.5h8l3 3V20.5H7V3.5Z"/><path d="M15 3.5v4h4M10 11h5M10 14.5h5M10 18h3"/></svg></div>
                <div>
                  <span className="page-eyebrow">Review draft · not in effect</span>
                  <h2>This is the working website draft for review.</h2>
                  <p>The text below has been loaded so it can be reviewed in the same format visitors will eventually see. It is <strong>not an approved or effective ESB Games policy yet</strong>, is excluded from search indexing, and should not be relied on as final legal terms.</p>
                  <p>Dates, entity details, regulatory wording and operational promises remain subject to final factual, leadership and legal review before this document can be marked Published.</p>
                </div>
              </div>
            )}

            <div className={!published ? "policy-review-document" : undefined}>
              <PolicyMarkdown markdown={item.markdown} />
            </div>

            {!published && (
              <div className="policy-review-end-note">
                <strong>End of review draft</strong>
                <p>This document remains non-effective until ESB Games explicitly approves it for publication and its policy status is changed to Published.</p>
              </div>
            )}

            <div className="policy-end-actions"><Link href="/trust" className="button button-secondary">Back to Trust Centre</Link><Link href="/support" className="button button-primary">Contact Support</Link></div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
