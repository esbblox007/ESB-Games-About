import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { ArrowIcon } from "@/components/Icons";
import { helpCategories } from "@/lib/content/help-centre";

function getCategory(id: string) {
  return helpCategories.find((category) => category.id === id);
}

export function generateStaticParams() {
  return helpCategories.map((category) => ({ category: category.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: id } = await params;
  const category = getCategory(id);
  if (!category) return { title: "Help topic unavailable", robots: { index: false, follow: false } };
  return {
    title: `${category.title} | Help Centre`,
    description: category.description,
    alternates: { canonical: `/help/centre/${category.id}` },
  };
}

export default async function HelpCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: id } = await params;
  const category = getCategory(id);
  if (!category) notFound();

  return (
    <PageShell>
      <div className="help-category-page">
        <section className="help-category-hero">
          <div className="help-centre-container">
            <Link href="/help/centre" className="help-back-link"><ArrowIcon size={15} /> Back to Help Centre</Link>
            {category.badge && <span className="eyebrow">{category.badge}</span>}
            <h1>{category.title}</h1>
            <p>{category.description}</p>
          </div>
        </section>
        <section className="help-category-content">
          <div className="help-centre-container">
            <header className="help-category-content-heading">
              <span className="eyebrow">Guides & routes</span>
              <h2>What do you need to do?</h2>
            </header>
            <div className="help-category-link-list">
              {category.articles.map((article) => (
                article.external ? (
                  <a className="help-category-link-card" href={article.href} target="_blank" rel="noreferrer" key={article.title}>
                    <span><strong>{article.title}</strong><small>Opens an external ESB Games service</small></span><ArrowIcon size={16} />
                  </a>
                ) : (
                  <Link className="help-category-link-card" href={article.href} key={article.title}>
                    <span><strong>{article.title}</strong><small>Open this guide or route</small></span><ArrowIcon size={16} />
                  </Link>
                )
              ))}
            </div>
            <div className="help-category-support-band">
              <div><strong>Still need staff help?</strong><p>Open a private Support case when the issue needs an authorised staff member to investigate or review evidence.</p></div>
              <Link className="button button-primary" href="/support#contact-support">Open Support</Link>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
