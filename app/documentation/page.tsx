import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import ArticleCard from "@/components/ArticleCard";
import { getPublishedArticles } from "@/lib/content/news";
import { searchStaticDocumentation, staticDocumentationSlugs } from "@/lib/content/static-documentation";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Official ESB Games product, creator, ESB Studio, scripting and publishing documentation.",
  alternates: { canonical: "/documentation" },
  openGraph: { title: "Documentation | ESB Games", description: "Official ESB Games product, creator, ESB Studio, scripting and publishing documentation.", url: "/documentation", type: "website", images: [{ url: "/hero-studio-platform.png", alt: "ESB Games Documentation" }] },
  twitter: { card: "summary_large_image", title: "Documentation | ESB Games", description: "Official ESB Games product, creator, ESB Studio, scripting and publishing documentation.", images: ["/hero-studio-platform.png"] },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
function single(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }

export default async function DocumentationPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = single(params.q) || "";
  const page = Math.max(1, Number(single(params.page) || 1));
  const result = await getPublishedArticles({ tag: "documentation", query: query || undefined, page, pageSize: 12 });
  const starterDocs = page === 1 ? searchStaticDocumentation(query) : [];
  const cmsArticles = result.articles.filter((article) => !staticDocumentationSlugs.has(article.slug));
  const totalPages = Math.max(1, Math.ceil(result.total / 12));
  const hasResults = starterDocs.length > 0 || cmsArticles.length > 0;

  return (
    <PageShell>
      <div className="documentation-page">
        <section className="documentation-hero"><div className="news-index-container"><span className="page-eyebrow">ESB Games Documentation</span><h1>Build, create and understand <span className="gradient-text">ESB Games.</span></h1><p>Start with the public foundation guides below. Detailed API references will be added only when the corresponding runtime and product contracts are stable enough to document accurately.</p></div></section>
        <section className="news-index-content"><div className="news-index-container">
          <div className="news-filter-toolbar"><form className="news-search-form" action="/documentation" role="search"><label htmlFor="docs-search">Search documentation</label><div><input id="docs-search" name="q" defaultValue={query} placeholder="Search platform, Studio, Lua, publishing..."/><button className="button button-primary" type="submit">Search</button></div></form></div>

          <div className="documentation-explainer"><strong>One documentation home</strong><span>Product and creator guidance lives here. Help Centre handles common user tasks, Support handles private cases, and Trust Centre handles safety, privacy and policy information.</span></div>

          {starterDocs.length > 0 && <section className="documentation-foundation" aria-labelledby="foundation-docs-heading"><header><span className="eyebrow">Foundation guides</span><h2 id="foundation-docs-heading">Start with what is stable enough to document.</h2><p>These guides are maintained with the website and are deliberately conservative about features that are still testing or planned.</p></header><div className="article-grid documentation-grid">{starterDocs.map((article) => <ArticleCard article={article} href={`/documentation/${article.slug}`} key={article.id}/>)}</div></section>}

          {result.unavailable && <div className="documentation-feed-notice" role="status"><strong>Published documentation feed unavailable</strong><span>The foundation guides above are still available. Additional CMS-managed documentation could not be loaded right now.</span></div>}

          {!result.unavailable && cmsArticles.length > 0 && <section className="documentation-published-section" aria-labelledby="published-docs-heading"><header><span className="eyebrow">Published resources</span><h2 id="published-docs-heading">Additional documentation</h2></header><div className="article-grid documentation-grid">{cmsArticles.map((article) => <ArticleCard article={article} href={`/documentation/${article.slug}`} key={article.id}/>)}</div></section>}

          {!hasResults && !result.unavailable && <div className="content-state"><h2>No matching documentation found.</h2><p>Try a broader search or return to the documentation home.</p><div><Link className="button button-secondary" href="/documentation">Clear search</Link></div></div>}

          {!result.unavailable && totalPages > 1 && <nav className="news-pagination" aria-label="Documentation pages">{page > 1 && <Link href={`/documentation?page=${page-1}${query?`&q=${encodeURIComponent(query)}`:""}`}>← Previous</Link>}<span>Page {page} of {totalPages}</span>{page < totalPages && <Link href={`/documentation?page=${page+1}${query?`&q=${encodeURIComponent(query)}`:""}`}>Next →</Link>}</nav>}
        </div></section>
      </div>
    </PageShell>
  );
}
