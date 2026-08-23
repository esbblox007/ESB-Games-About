import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import ArticleCard from "@/components/ArticleCard";
import ArticleRenderer from "@/components/ArticleRenderer";
import ShareActions from "@/components/ShareActions";
import { getArticleBySlug, getPublishedArticles } from "@/lib/content/news";
import type { NewsArticle } from "@/lib/content/types";
import { getStaticDocumentationBySlug, staticDocumentationArticles } from "@/lib/content/static-documentation";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://about.esbgames.com";
const hasTag = (tags: string[], tag: string) => tags.some((value) => value.toLowerCase() === tag);
function formatDate(value: string) { return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value)); }

function metadataForDocumentation(article: NewsArticle): Metadata {
  const canonical = article.canonicalUrl || `${siteUrl}/documentation/${article.slug}`;
  const image = article.socialImage || article.coverImage;
  return { title: article.seoTitle || article.title, description: article.seoDescription || article.excerpt, alternates: { canonical }, openGraph: { type: "article", title: article.title, description: article.excerpt, url: canonical, images: image ? [{ url: image, alt: article.coverImageAlt || article.title }] : undefined }, twitter: { card: "summary_large_image", title: article.title, description: article.excerpt, images: image ? [image] : undefined } };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const starter = getStaticDocumentationBySlug(slug);
  if (starter) return metadataForDocumentation(starter);
  const { article } = await getArticleBySlug(slug);
  if (!article || !hasTag(article.tags, "documentation")) return { title: "Documentation unavailable", robots: { index: false, follow: false } };
  const documentationOnly = hasTag(article.tags, "documentation-only");
  if (!documentationOnly && !article.canonicalUrl) return { ...metadataForDocumentation(article), alternates: { canonical: `${siteUrl}/news/${article.slug}` } };
  return metadataForDocumentation(article);
}

function DocumentationArticle({ article, related }: { article: NewsArticle; related: NewsArticle[] }) {
  const documentationOnly = hasTag(article.tags, "documentation-only");
  const canonical = article.canonicalUrl || (documentationOnly ? `${siteUrl}/documentation/${article.slug}` : `${siteUrl}/news/${article.slug}`);
  return <PageShell><article className="news-article-page documentation-article-page">
    <header className="article-header"><div className="article-container article-header-inner"><nav className="article-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/documentation">Documentation</Link><span>/</span><span aria-current="page">{article.category}</span></nav><span className="article-category">Documentation · {article.category}</span><h1>{article.title}</h1>{article.subtitle && <p className="article-subtitle">{article.subtitle}</p>}<div className="article-meta"><span>{article.author}</span><span>Published {formatDate(article.publishedAt)}</span>{article.updatedAt && article.updatedAt !== article.publishedAt && <span>Updated {formatDate(article.updatedAt)}</span>}<span>{article.readingTime} min read</span></div></div></header>
    {article.coverImage && <figure className="article-cover article-container"><img src={article.coverImage} alt={article.coverImageAlt || ""}/></figure>}
    <div className="article-container article-content-layout"><aside className="article-side"><ShareActions title={article.title} url={canonical}/><Link href="/documentation" className="article-back-link">← Back to Documentation</Link></aside><ArticleRenderer blocks={article.body}/></div>
    {article.tags.length > 0 && <div className="article-container article-tags" aria-label="Article tags">{article.tags.filter((tag) => !["documentation", "documentation-only"].includes(tag.toLowerCase())).map((tag) => <span key={tag}>{tag}</span>)}</div>}
    {related.length > 0 && <section className="article-related"><div className="article-container"><h2>Related documentation</h2><div className="article-grid">{related.map((item) => <ArticleCard article={item} href={`/documentation/${item.slug}`} key={item.id}/>)}</div></div></section>}
  </article></PageShell>;
}

export default async function DocumentationArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const starter = getStaticDocumentationBySlug(slug);
  if (starter) {
    const related = starter.relatedSlugs.map((relatedSlug) => getStaticDocumentationBySlug(relatedSlug)).filter((item): item is NewsArticle => Boolean(item)).slice(0, 3);
    return <DocumentationArticle article={starter} related={related}/>;
  }

  const { article, unavailable } = await getArticleBySlug(slug);
  if (unavailable) return <PageShell><div className="article-state-page"><div className="content-state content-state-error"><h1>Documentation is temporarily unavailable.</h1><p>We couldn&apos;t load this page right now.</p><div><Link className="button button-primary" href={`/documentation/${slug}`}>Retry</Link><Link className="button button-secondary" href="/documentation">Back to Documentation</Link></div></div></div></PageShell>;
  if (!article || !hasTag(article.tags, "documentation")) notFound();
  const relatedResult = await getPublishedArticles({ locale: article.locale, tag: "documentation", pageSize: 24 });
  const relatedCms = relatedResult.articles.filter((item) => item.slug !== article.slug && !getStaticDocumentationBySlug(item.slug));
  const related = [...staticDocumentationArticles.filter((item) => item.slug !== article.slug), ...relatedCms].slice(0, 3);
  return <DocumentationArticle article={article} related={related}/>;
}
