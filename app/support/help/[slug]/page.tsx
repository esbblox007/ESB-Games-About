import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { getSupportArticle, supportArticles } from "@/lib/content/support";

export function generateStaticParams() {
  return supportArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getSupportArticle(slug);
  if (!article) return { title: "Support article" };
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/support/help/${article.slug}` },
  };
}

export default async function SupportHelpPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getSupportArticle(slug);
  if (!article) notFound();

  return (
    <PageShell>
      <main className="support-help-page">
        <div className="support-help-container">
          <nav className="support-help-breadcrumb" aria-label="Breadcrumb">
            <Link href="/support">Support</Link><span aria-hidden="true">›</span><span>{article.title}</span>
          </nav>
          <header className="support-help-header">
            <span className="eyebrow">Quick Help</span>
            <h1>{article.title}</h1>
            <p>{article.intro}</p>
          </header>
          <div className="support-help-content">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.steps && <ol>{section.steps.map((step) => <li key={step}>{step}</li>)}</ol>}
              </section>
            ))}
          </div>
          <aside className="support-help-cta">
            <div><strong>Still need help?</strong><p>Submit a ticket and include any relevant account or transaction details.</p></div>
            <Link className="button button-primary" href="/support#submit-ticket">Go to Support</Link>
          </aside>
        </div>
      </main>
    </PageShell>
  );
}
