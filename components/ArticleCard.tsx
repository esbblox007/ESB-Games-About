import Link from "next/link";
import type { NewsArticle } from "@/lib/content/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

export default function ArticleCard({ article, featured = false }: { article: NewsArticle; featured?: boolean }) {
  return (
    <article className={`article-card${featured ? " article-card-featured" : ""}`}>
      <Link href={`/news/${article.slug}`} className="article-card-link" aria-label={`Open article: ${article.title}`}>
        <div className="article-card-media">
          {article.coverImage ? (
            <img src={article.coverImage} alt={article.coverImageAlt || ""} loading={featured ? "eager" : "lazy"} />
          ) : (
            <div className="article-card-placeholder" aria-hidden="true"><span>ESB</span></div>
          )}
          {article.featured && <span className="article-featured-label">Featured</span>}
          {article.preview && <span className="article-preview-label">Preview</span>}
        </div>
        <div className="article-card-body">
          <span className="article-card-category">{article.category}</span>
          <h2>{article.title}</h2>
          <p>{article.excerpt}</p>
          <div className="article-card-meta">
            <span>{article.author}</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span>{article.readingTime} min read</span>
          </div>
          <span className="article-card-action">Open article <span aria-hidden="true">→</span></span>
        </div>
      </Link>
    </article>
  );
}
