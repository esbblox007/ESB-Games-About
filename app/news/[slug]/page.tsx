import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import ArticleCard from "@/components/ArticleCard";
import ArticleRenderer, { ArticleVideoEmbed } from "@/components/ArticleRenderer";
import ShareActions from "@/components/ShareActions";
import { getAllPublishedArticleSlugs, getArticleBySlug, getPublishedArticles, getRelatedArticles } from "@/lib/content/news";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://about.esbgames.com";

function inferVideoProvider(url: string): "youtube" | "vimeo" | "file" | null {
  try {
    const hostname = new URL(url, siteUrl).hostname.toLowerCase();
    if (["youtube.com", "www.youtube.com", "youtu.be"].includes(hostname)) return "youtube";
    if (["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(hostname)) return "vimeo";
    return url.startsWith("/") || /^https?:\/\//.test(url) ? "file" : null;
  } catch {
    return null;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

export async function generateStaticParams() {
  const slugs = await getAllPublishedArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { article } = await getArticleBySlug(slug);
  if (!article) return { title: "Article unavailable", robots: { index: false, follow: false } };
  const canonical = article.canonicalUrl || `${siteUrl}/news/${article.slug}`;
  const image = article.socialImage || article.coverImage;
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
      url: canonical,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      images: image ? [{ url: image, alt: article.coverImageAlt || article.title }] : undefined,
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.excerpt, images: image ? [image] : undefined },
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { article, unavailable } = await getArticleBySlug(slug);

  if (unavailable) {
    return (
      <PageShell>
        <div className="article-state-page"><div className="content-state content-state-error"><h1>News is temporarily unavailable.</h1><p>This article could not be loaded from the publishing service.</p><div><Link className="button button-primary" href={`/news/${slug}`}>Retry</Link><Link className="button button-secondary" href="/news">Back to News</Link></div></div></div>
      </PageShell>
    );
  }
  if (!article) notFound();

  const related = await getRelatedArticles(article);
  const all = await getPublishedArticles({ locale: article.locale, pageSize: 24 });
  const index = all.articles.findIndex((item) => item.slug === article.slug);
  const previous = index >= 0 ? all.articles[index + 1] : undefined;
  const next = index > 0 ? all.articles[index - 1] : undefined;
  const canonical = article.canonicalUrl || `${siteUrl}/news/${article.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage ? [new URL(article.coverImage, siteUrl).toString()] : undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: "ESB Games", logo: { "@type": "ImageObject", url: `${siteUrl}/esb-blue-logo.png` } },
    mainEntityOfPage: canonical,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "News", item: `${siteUrl}/news` },
      { "@type": "ListItem", position: 3, name: article.title, item: canonical },
    ],
  };

  return (
    <PageShell>
      <article className="news-article-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
        <header className="article-header">
          <div className="article-container article-header-inner">
            <nav className="article-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/news">News</Link><span>/</span><span aria-current="page">{article.category}</span></nav>
            {article.preview && <span className="article-preview-banner">Content preview, not a live Backend article</span>}
            <span className="article-category">{article.category}</span>
            <h1>{article.title}</h1>
            {article.subtitle && <p className="article-subtitle">{article.subtitle}</p>}
            <div className="article-meta"><span>{article.author}</span><span>Published {formatDate(article.publishedAt)}</span>{article.updatedAt && article.updatedAt !== article.publishedAt && <span>Updated {formatDate(article.updatedAt)}</span>}<span>{article.readingTime} min read</span></div>
          </div>
        </header>

        {article.coverImage ? (
          <figure className="article-cover article-container"><img src={article.coverImage} alt={article.coverImageAlt || ""} /></figure>
        ) : article.coverVideo && inferVideoProvider(article.coverVideo) ? (
          <figure className="article-cover article-cover-video article-container">
            <div><ArticleVideoEmbed block={{ type: "video", provider: inferVideoProvider(article.coverVideo)!, url: article.coverVideo, title: `${article.title} cover video` }} /></div>
          </figure>
        ) : null}

        <div className="article-container article-content-layout">
          <aside className="article-side"><ShareActions title={article.title} url={canonical} /><Link href="/news" className="article-back-link">← Back to News</Link></aside>
          <ArticleRenderer blocks={article.body} />
        </div>

        {article.tags.length > 0 && <div className="article-container article-tags" aria-label="Article tags">{article.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}

        {(previous || next) && <nav className="article-container article-prev-next" aria-label="Previous and next articles">{previous ? <Link href={`/news/${previous.slug}`}><span>Previous article</span><strong>{previous.title}</strong></Link> : <span />}{next && <Link href={`/news/${next.slug}`}><span>Next article</span><strong>{next.title}</strong></Link>}</nav>}

        {related.length > 0 && <section className="article-related"><div className="article-container"><h2>Related articles</h2><div className="article-grid">{related.map((item) => <ArticleCard article={item} key={item.id} />)}</div></div></section>}
      </article>
    </PageShell>
  );
}
