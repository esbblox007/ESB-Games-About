import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { ArrowIcon, SearchIcon } from "@/components/Icons";
import { helpCategories, helpSections } from "@/lib/content/help-centre";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://about.esbgames.com";

function getCategory(id: string) {
  const category = helpCategories.find((item) => item.id === id);
  if (!category) return null;
  const section = helpSections.find((item) => item.categories.some((entry) => entry.id === id));
  return { category, section };
}

export function generateStaticParams() {
  return helpCategories.map((category) => ({ category: category.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: categoryId } = await params;
  const result = getCategory(categoryId);
  if (!result) return { title: "Help topic unavailable", robots: { index: false, follow: false } };
  const { category } = result;
  const canonical = `${siteUrl}/help/${category.id}`;
  return {
    title: `${category.title} | Help Centre`,
    description: category.description,
    alternates: { canonical },
    openGraph: { title: `${category.title} | ESB Games Help Centre`, description: category.description, url: canonical, type: "website" },
  };
}

export default async function HelpCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryId } = await params;
  const result = getCategory(categoryId);
  if (!result) notFound();
  const { category, section } = result;

  return (
    <PageShell>
      <div className="help-category-page">
        <section className="help-category-hero">
          <div className="help-centre-container">
            <nav className="help-category-breadcrumb" aria-label="Breadcrumb"><Link href="/help">Help Centre</Link><span>/</span><span aria-current="page">{category.title}</span></nav>
            <span className="eyebrow">{section?.eyebrow || "ESB Games Help"}</span>
            <h1>{category.title}</h1>
            <p>{category.description}</p>
          </div>
        </section>

        <section className="help-category-content">
          <div className="help-centre-container">
            <header className="help-category-content-heading"><span className="eyebrow">Available guidance</span><h2>Choose what you need.</h2><p>Open the closest guide or route below. Private account-specific investigations still belong in Support.</p></header>
            <div className="help-category-link-list">
              {category.articles.map((article) => (
                article.external ? (
                  <a key={article.title} href={article.href} target="_blank" rel="noreferrer" className="help-category-link-card">
                    <span><strong>{article.title}</strong><small>Open guidance</small></span><ArrowIcon size={16} />
                  </a>
                ) : (
                  <Link key={article.title} href={article.href} className="help-category-link-card">
                    <span><strong>{article.title}</strong><small>Open guidance</small></span><ArrowIcon size={16} />
                  </Link>
                )
              ))}
            </div>
            <div className="help-category-support-band"><div><strong>Need an authorised staff member?</strong><p>Open a private Support case when the issue needs account-specific investigation, evidence review or a staff response.</p></div><Link className="button button-primary" href="/support#contact-support"><SearchIcon size={16}/> Open Support</Link></div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
