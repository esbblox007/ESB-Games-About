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
    : `${item.title} is being finalised ahead of the public launch of ESB Games.`;
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
      <div className="policy-page">
        <header className="policy-hero">
          <div className="policy-container">
            <nav className="policy-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/trust">Trust, Safety &amp; Legal</Link><span>/</span><span aria-current="page">{item.title}</span></nav>
            <span className="page-eyebrow">{item.category}</span>
            <h1>{item.title}</h1>
          </div>
        </header>
        <section className="policy-content-section">
          <div className="policy-container policy-document-card">
            {published ? (
              <PolicyMarkdown markdown={item.markdown} />
            ) : (
              <div className="content-state policy-prelaunch-state" role="status">
                <span className="page-eyebrow">Pre-launch document</span>
                <h2>This document is being finalised.</h2>
                <p>ESB Games is completing the final review of this document ahead of public launch. Draft wording, internal implementation notes and incomplete legal details are not published as effective policy.</p>
                <p>Once the document has completed the required review and approval process, the approved version will be published here with its version and effective date.</p>
              </div>
            )}
            <div className="policy-end-actions"><Link href="/trust" className="button button-secondary">Back to Trust Centre</Link><Link href="/support" className="button button-primary">Contact Support</Link></div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
