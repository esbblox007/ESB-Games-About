import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import ArticleCard from "@/components/ArticleCard";
import { getPublishedArticles } from "@/lib/content/news";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Official ESB Games product, creator, platform and technical documentation.",
  alternates: { canonical: "/documentation" },
  openGraph: { title: "Documentation | ESB Games", description: "Official ESB Games product, creator, platform and technical documentation.", url: "/documentation", type: "website" },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
function single(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }

export default async function DocumentationPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = single(params.q) || "";
  const page = Math.max(1, Number(single(params.page) || 1));
  const result = await getPublishedArticles({ tag: "documentation", query: query || undefined, page, pageSize: 12 });
  const totalPages = Math.max(1, Math.ceil(result.total / 12));

  return (
    <PageShell>
      <div className="documentation-page">
        <section className="documentation-hero"><div className="news-index-container"><span className="page-eyebrow">ESB Games Documentation</span><h1>Build, create and understand <span className="gradient-text">ESB Games.</span></h1><p>Official guides, product documentation, creator resources, release notes and technical information published by the ESB Games team.</p></div></section>
        <section className="news-index-content"><div className="news-index-container">
          <div className="news-filter-toolbar"><form className="news-search-form" action="/documentation" role="search"><label htmlFor="docs-search">Search documentation</label><div><input id="docs-search" name="q" defaultValue={query} placeholder="Search documentation"/><button className="button button-primary" type="submit">Search</button></div></form></div>
          <div className="documentation-explainer"><strong>Official resources</strong><span>Browse guides, technical notes, creator resources and product information published by the ESB Games team.</span></div>
          {result.unavailable ? <div className="content-state content-state-error"><h2>Documentation is temporarily unavailable.</h2><p>We couldn&apos;t load documentation right now. Please try again shortly.</p></div>
          : result.articles.length === 0 ? <div className="content-state"><h2>{query ? "No matching documentation found." : "No documentation has been published yet."}</h2><p>{query ? "Try a broader search." : "Official documentation will appear here when it is published."}</p><div><Link className="button button-secondary" href="/documentation">View all documentation</Link></div></div>
          : <><div className="article-grid documentation-grid">{result.articles.map((article) => <ArticleCard article={article} href={`/documentation/${article.slug}`} key={article.id}/>)}</div>{totalPages > 1 && <nav className="news-pagination" aria-label="Documentation pages">{page > 1 && <Link href={`/documentation?page=${page-1}${query?`&q=${encodeURIComponent(query)}`:""}`}>← Previous</Link>}<span>Page {page} of {totalPages}</span>{page < totalPages && <Link href={`/documentation?page=${page+1}${query?`&q=${encodeURIComponent(query)}`:""}`}>Next →</Link>}</nav>}</>}
        </div></section>
      </div>
    </PageShell>
  );
}
