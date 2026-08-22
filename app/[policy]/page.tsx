import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import PolicyMarkdown from "@/components/PolicyMarkdown";
import { policyBySlug, policyDocuments } from "@/lib/content/policies-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return policyDocuments.map(({ slug }) => ({ policy: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ policy: string }> }): Promise<Metadata> {
  const { policy: slug } = await params;
  const item = policyBySlug[slug];
  if (!item) return { title: "Policy not found", robots: { index: false, follow: false } };
  return {
    title: item.title,
    description: `${item.title} for the ESB Games ecosystem.`,
    alternates: { canonical: `/${item.slug}` },
    openGraph: { title: `${item.title} | ESB Games`, description: `${item.title} for the ESB Games ecosystem.`, url: `/${item.slug}`, type: "article" },
  };
}

export default async function PolicyPage({ params }: { params: Promise<{ policy: string }> }) {
  const { policy: slug } = await params;
  const item = policyBySlug[slug];
  if (!item) notFound();
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
            <PolicyMarkdown markdown={item.markdown} />
            <div className="policy-end-actions"><Link href="/trust" className="button button-secondary">Back to Trust Centre</Link><Link href="/support" className="button button-primary">Contact Support</Link></div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
