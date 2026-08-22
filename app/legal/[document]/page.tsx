import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { ArrowIcon, ShieldIcon } from "@/components/Icons";
import { legalDocuments } from "@/lib/content/trust";

export function generateStaticParams() {
  return Object.keys(legalDocuments).map((document) => ({ document }));
}

export async function generateMetadata({ params }: { params: Promise<{ document: string }> }): Promise<Metadata> {
  const { document } = await params;
  const item = legalDocuments[document];
  return item
    ? { title: item.title, description: item.description, alternates: { canonical: `/legal/${document}` }, robots: { index: false, follow: true } }
    : { title: "Document not found", robots: { index: false, follow: false } };
}

export default async function LegalDocumentPage({ params }: { params: Promise<{ document: string }> }) {
  const { document } = await params;
  const item = legalDocuments[document];
  if (!item) notFound();

  return (
    <PageShell>
      <div className="legal-prelaunch-page">
        <section className="legal-prelaunch-hero">
          <div className="trust-container">
            <Link href="/trust" className="trust-back-link"><ArrowIcon size={15} /> Trust, Safety &amp; Legal</Link>
            <span className="eyebrow">Pre-launch document</span>
            <h1>{item.title}</h1>
            <p>{item.description}</p>
          </div>
        </section>
        <section className="legal-prelaunch-content">
          <div className="trust-container">
            <article className="legal-review-card legal-prelaunch-card">
              <span className="legal-prelaunch-icon"><ShieldIcon size={24} /></span>
              <div>
                <strong>{item.title} is being finalised ahead of public launch.</strong>
                <p>This page is intentionally not publishing ESB Games&apos; internal draft text. The final public document will replace this pre-launch state after legal, safety and operational details are confirmed.</p>
                <p>Until then, no unfinished dates, legal-entity details, regional representatives, reporting routes or internal implementation notes will be presented as final.</p>
              </div>
            </article>
            <div className="legal-prelaunch-actions"><Link href="/trust" className="button button-primary">Return to Trust Centre</Link><Link href="/support" className="button button-secondary">Contact Support</Link></div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
