import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import ArticleCard from "@/components/ArticleCard";
import { BookIcon, CubeIcon, RocketIcon, ShieldIcon } from "@/components/Icons";
import { getPublishedArticles } from "@/lib/content/news";
import styles from "./DocumentationOverview.module.css";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Official ESB Games product, creator, platform and technical documentation.",
  alternates: { canonical: "/documentation" },
  openGraph: { title: "Documentation | ESB Games", description: "Official ESB Games product, creator, platform and technical documentation.", url: "/documentation", type: "website", images: [{ url: "/hero-studio-platform.png", alt: "ESB Games Documentation" }] },
  twitter: { card: "summary_large_image", title: "Documentation | ESB Games", description: "Official ESB Games product, creator, platform and technical documentation.", images: ["/hero-studio-platform.png"] },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
function single(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }

const prelaunchGuides = [
  {
    title: "Getting started",
    description: "ESB Games uses a connected account across the ecosystem. Public creator onboarding, supported platforms and installation steps will be documented once the relevant builds are approved for testing or release.",
    status: "Pre-launch overview",
    icon: <RocketIcon size={20} />,
  },
  {
    title: "ESB Studio overview",
    description: "ESB Studio is the creator environment being developed for building, scripting, testing and preparing experiences. Public feature references will be published only after those tools stabilise.",
    status: "In development",
    icon: <CubeIcon size={20} />,
  },
  {
    title: "Scripting overview",
    description: "The scripting and API model is still being stabilised. ESB Games will publish supported language, runtime and API references when they are ready; this site does not invent placeholder methods or unsupported examples.",
    status: "Reference not public yet",
    icon: <BookIcon size={20} />,
  },
  {
    title: "Publishing status",
    description: "Public experience publishing is not open yet. Creator review, release, safety and publishing requirements will be documented before public publishing becomes available.",
    status: "Publishing not public",
    icon: <ShieldIcon size={20} />,
  },
] as const;

export default async function DocumentationPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = single(params.q) || "";
  const page = Math.max(1, Number(single(params.page) || 1));
  const result = await getPublishedArticles({ tag: "documentation", query: query || undefined, page, pageSize: 12 });
  const totalPages = Math.max(1, Math.ceil(result.total / 12));
  const pristineEmptyState = !result.unavailable && result.total === 0 && !query && page === 1;

  return (
    <PageShell>
      <div className="documentation-page">
        <section className="documentation-hero"><div className="news-index-container"><span className="page-eyebrow">ESB Games Documentation</span><h1>Build, create and understand <span className="gradient-text">ESB Games.</span></h1><p>Official product, creator and technical documentation will be published here as public features stabilise. Pre-launch overviews below explain the current state without presenting unfinished systems as final.</p></div></section>
        <section className="news-index-content"><div className="news-index-container">
          {!pristineEmptyState && !result.unavailable && <div className="news-filter-toolbar"><form className="news-search-form" action="/documentation" role="search"><label htmlFor="docs-search">Search documentation</label><div><input id="docs-search" name="q" defaultValue={query} placeholder="Search documentation"/><button className="button button-primary" type="submit">Search</button></div></form></div>}
          {!pristineEmptyState && <div className="documentation-explainer"><strong>Official resources</strong><span>Browse guides, technical notes, creator resources and product information published by the ESB Games team.</span></div>}
          {result.unavailable ? <div className="content-state content-state-error"><h2>Documentation is temporarily unavailable.</h2><p>We couldn&apos;t load documentation right now. Please try again shortly.</p><div><Link className="button button-primary" href="/documentation">Retry</Link></div></div>
          : pristineEmptyState ? <div className={styles.overview}>
              <div className={styles.statusPanel}><div><strong>Documentation is in pre-launch publication.</strong><p>No final technical reference has been released yet. These overviews describe the current product state at a high level; detailed instructions will appear only when the relevant features and interfaces are stable enough to document accurately.</p></div><span className={styles.statusBadge}>Pre-launch</span></div>
              <div className={styles.grid}>{prelaunchGuides.map((guide) => <article className={styles.card} key={guide.title}><span className={styles.icon}>{guide.icon}</span><h3>{guide.title}</h3><p>{guide.description}</p><small>{guide.status}</small></article>)}</div>
              <div className={styles.actions}><Link className="button button-primary" href="/developer-hub">Visit Creator Hub</Link><Link className="button button-secondary" href="/download">Product release status</Link><Link className="button button-secondary" href="/trust/safety">Creator safety &amp; trust</Link></div>
            </div>
          : result.articles.length === 0 ? <div className="content-state"><h2>No matching documentation found.</h2><p>Try a broader search.</p><div><Link className="button button-secondary" href="/documentation">Clear search</Link></div></div>
          : <><div className="article-grid documentation-grid">{result.articles.map((article) => <ArticleCard article={article} href={`/documentation/${article.slug}`} key={article.id}/>)}</div>{totalPages > 1 && <nav className="news-pagination" aria-label="Documentation pages">{page > 1 && <Link href={`/documentation?page=${page-1}${query?`&q=${encodeURIComponent(query)}`:""}`}>← Previous</Link>}<span>Page {page} of {totalPages}</span>{page < totalPages && <Link href={`/documentation?page=${page+1}${query?`&q=${encodeURIComponent(query)}`:""}`}>Next →</Link>}</nav>}</>}
        </div></section>
      </div>
    </PageShell>
  );
}
