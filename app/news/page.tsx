import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import ArticleCard from "@/components/ArticleCard";
import { getPublishedArticles } from "@/lib/content/news";

export const metadata: Metadata = {
  title: "News & Updates",
  description: "Company announcements, platform updates, creator news, engineering insights and stories from ESB Games.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "ESB Games News & Updates",
    description: "Read the latest company announcements, platform updates and creator news from ESB Games.",
    url: "/news",
    type: "website",
  },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const category = single(params.category) || "";
  const query = single(params.q) || "";
  const page = Math.max(1, Number(single(params.page) || 1));
  const result = await getPublishedArticles({ category: category || undefined, query: query || undefined, page, pageSize: 9 });
  const featured = page === 1 ? result.articles.find((article) => article.featured) : undefined;
  const standardArticles = featured ? result.articles.filter((article) => article.id !== featured.id) : result.articles;
  const totalPages = Math.max(1, Math.ceil(result.total / 9));

  return (
    <PageShell>
      <div className="news-index-page">
        <section className="news-index-hero">
          <div className="news-index-container">
            <div>
              <span className="page-eyebrow">ESB Games Newsroom</span>
              <h1>News, updates and ideas from <span className="gradient-text">across ESB Games.</span></h1>
              <p>Follow company announcements, product updates, creator stories, safety work and engineering insights.</p>
            </div>
            <form className="news-search-form" action="/news" role="search">
              <label htmlFor="news-search">Search news</label>
              <div>
                <input id="news-search" name="q" defaultValue={query} placeholder="Search articles, topics or teams" />
                <button className="button button-primary" type="submit">Search</button>
              </div>
            </form>
          </div>
        </section>

        <section className="news-index-content">
          <div className="news-index-container">
            <nav className="news-category-tabs" aria-label="News categories">
              <Link className={!category ? "active" : ""} href={query ? `/news?q=${encodeURIComponent(query)}` : "/news"}>All articles</Link>
              {result.categories.map((item) => {
                const href = `/news?category=${encodeURIComponent(item)}${query ? `&q=${encodeURIComponent(query)}` : ""}`;
                return <Link className={category === item ? "active" : ""} href={href} key={item}>{item}</Link>;
              })}
            </nav>

            {result.unavailable ? (
              <div className="content-state content-state-error">
                <h2>News is temporarily unavailable.</h2>
                <p>The newsroom could not connect to the publishing service. Please try again shortly.</p>
                <div><Link className="button button-primary" href="/news">Retry</Link><Link className="button button-secondary" href="/">Return Home</Link></div>
              </div>
            ) : result.articles.length === 0 ? (
              <div className="content-state">
                <h2>{query || category ? "We couldn’t find an exact match." : "No news articles have been published yet."}</h2>
                <p>{query || category ? "Try a broader search or return to all news." : "Published articles from the ESB Games Backend will appear here automatically."}</p>
                <div><Link className="button button-primary" href="/news">View all news</Link><Link className="button button-secondary" href="/support">Visit Support</Link></div>
              </div>
            ) : (
              <>
                {featured && <ArticleCard article={featured} featured />}
                <div className="article-grid">
                  {standardArticles.map((article) => <ArticleCard article={article} key={article.id} />)}
                </div>
                {totalPages > 1 && (
                  <nav className="news-pagination" aria-label="News pages">
                    {page > 1 && <Link href={`/news?page=${page - 1}${category ? `&category=${encodeURIComponent(category)}` : ""}${query ? `&q=${encodeURIComponent(query)}` : ""}`}>← Previous</Link>}
                    <span>Page {page} of {totalPages}</span>
                    {page < totalPages && <Link href={`/news?page=${page + 1}${category ? `&category=${encodeURIComponent(category)}` : ""}${query ? `&q=${encodeURIComponent(query)}` : ""}`}>Next →</Link>}
                  </nav>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
