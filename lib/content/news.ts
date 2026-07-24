import "server-only";
import { previewNewsArticles } from "./previewNews";
import { contentBackendConfigured, contentSelect, contentSelectPage } from "./supabase";
import type { ArticleBlock, NewsArticle, NewsListResult, PublicationState, RichText } from "./types";

interface ArticleRow {
  id: string | number;
  title: string;
  slug: string;
  subtitle?: string | null;
  excerpt: string;
  body?: unknown;
  cover_image?: string | null;
  cover_image_alt?: string | null;
  cover_video?: string | null;
  author?: string | null;
  category?: string | null;
  tags?: string[] | null;
  publication_state?: PublicationState | null;
  featured?: boolean | null;
  seo_title?: string | null;
  seo_description?: string | null;
  social_image?: string | null;
  canonical_url?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
  related_slugs?: string[] | null;
  locale?: string | null;
  translation_group_id?: string | null;
  reading_time?: number | null;
}

const previewEnabled = process.env.NEXT_PUBLIC_CONTENT_PREVIEW === "true";

function cleanText(value: unknown, maxLength = 12000) {
  return typeof value === "string" ? value.slice(0, maxLength) : "";
}

function cleanStringArray(value: unknown, maxItems = 100, maxLength = 1000) {
  return Array.isArray(value) ? value.slice(0, maxItems).map((item) => cleanText(item, maxLength)).filter(Boolean) : [];
}

function cleanUrl(value: unknown) {
  if (typeof value !== "string") return undefined;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? value : undefined;
  } catch {
    return undefined;
  }
}

function cleanRichText(value: unknown): RichText {
  if (typeof value === "string") return cleanText(value);
  if (!Array.isArray(value)) return "";
  return value.slice(0, 500).flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const candidate = item as Record<string, unknown>;
    const text = cleanText(candidate.text, 4000);
    if (!text) return [];
    const href = cleanUrl(candidate.href);
    return [{ text, bold: candidate.bold === true || undefined, italic: candidate.italic === true || undefined, underline: candidate.underline === true || undefined, href }];
  });
}

function normaliseBlock(value: unknown): ArticleBlock | null {
  if (!value || typeof value !== "object") return null;
  const block = value as Record<string, unknown>;
  switch (block.type) {
    case "paragraph":
      return {
        type: "paragraph",
        text: cleanRichText(block.text),
        size: ["small", "normal", "large"].includes(String(block.size)) ? block.size as "small" | "normal" | "large" : undefined,
        align: ["left", "center", "right"].includes(String(block.align)) ? block.align as "left" | "center" | "right" : undefined,
        spacing: ["compact", "normal", "roomy"].includes(String(block.spacing)) ? block.spacing as "compact" | "normal" | "roomy" : undefined,
      };
    case "heading": {
      const level = Number(block.level);
      const text = cleanText(block.text, 500);
      return text && [2, 3, 4].includes(level) ? { type: "heading", level: level as 2 | 3 | 4, text, id: cleanText(block.id, 120) || undefined, align: ["left", "center", "right"].includes(String(block.align)) ? block.align as "left" | "center" | "right" : undefined } : null;
    }
    case "list": {
      const items = cleanStringArray(block.items, 100, 2000);
      return items.length ? { type: "list", ordered: block.ordered === true, items } : null;
    }
    case "quote": {
      const text = cleanText(block.text, 5000);
      return text ? { type: "quote", text, attribution: cleanText(block.attribution, 500) || undefined } : null;
    }
    case "divider": return { type: "divider" };
    case "image": {
      const src = cleanUrl(block.src);
      return src ? { type: "image", src, alt: cleanText(block.alt, 500), caption: cleanText(block.caption, 1000) || undefined, width: ["content", "wide", "full"].includes(String(block.width)) ? block.width as "content" | "wide" | "full" : undefined } : null;
    }
    case "gallery": {
      const images = Array.isArray(block.images) ? block.images.slice(0, 12).flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const image = item as Record<string, unknown>;
        const src = cleanUrl(image.src);
        return src ? [{ src, alt: cleanText(image.alt, 500), caption: cleanText(image.caption, 1000) || undefined }] : [];
      }) : [];
      return images.length ? { type: "gallery", images } : null;
    }
    case "video": {
      const provider = String(block.provider);
      const url = cleanUrl(block.url);
      return url && ["youtube", "vimeo", "file"].includes(provider) ? { type: "video", provider: provider as "youtube" | "vimeo" | "file", url, title: cleanText(block.title, 500) || "ESB Games video", caption: cleanText(block.caption, 1000) || undefined } : null;
    }
    case "callout": {
      const text = cleanText(block.text, 5000);
      return text ? { type: "callout", tone: ["info", "success", "warning"].includes(String(block.tone)) ? block.tone as "info" | "success" | "warning" : undefined, title: cleanText(block.title, 500) || undefined, text } : null;
    }
    case "code": {
      const code = cleanText(block.code, 50000);
      return code ? { type: "code", language: cleanText(block.language, 50) || undefined, code, caption: cleanText(block.caption, 1000) || undefined } : null;
    }
    case "table": {
      const headers = cleanStringArray(block.headers, 20, 500);
      const rows = Array.isArray(block.rows) ? block.rows.slice(0, 100).map((row) => cleanStringArray(row, 20, 2000)) : [];
      return headers.length && rows.length ? { type: "table", headers, rows, caption: cleanText(block.caption, 1000) || undefined } : null;
    }
    case "button": {
      const href = cleanUrl(block.href);
      const label = cleanText(block.label, 200);
      return href && label ? { type: "button", label, href, variant: block.variant === "secondary" ? "secondary" : "primary" } : null;
    }
    default: return null;
  }
}

function normaliseBlocks(body: unknown): ArticleBlock[] {
  if (!Array.isArray(body)) return [];
  return body.slice(0, 200).map(normaliseBlock).filter((block): block is ArticleBlock => Boolean(block));
}

function mapRow(row: ArticleRow): NewsArticle {
  return {
    id: String(row.id),
    title: row.title,
    slug: row.slug,
    subtitle: row.subtitle || undefined,
    excerpt: row.excerpt,
    body: normaliseBlocks(row.body),
    coverImage: cleanUrl(row.cover_image),
    coverImageAlt: row.cover_image_alt || undefined,
    coverVideo: cleanUrl(row.cover_video),
    author: row.author || "ESB Games Editorial",
    category: row.category || "Company News",
    tags: Array.isArray(row.tags) ? row.tags : [],
    publicationState: row.publication_state || "Published",
    featured: Boolean(row.featured),
    seoTitle: row.seo_title || undefined,
    seoDescription: row.seo_description || undefined,
    socialImage: cleanUrl(row.social_image),
    canonicalUrl: cleanUrl(row.canonical_url),
    publishedAt: row.published_at || new Date(0).toISOString(),
    updatedAt: row.updated_at || undefined,
    relatedSlugs: Array.isArray(row.related_slugs) ? row.related_slugs : [],
    locale: row.locale || "en",
    translationGroupId: row.translation_group_id || undefined,
    readingTime: Math.max(1, Number(row.reading_time || 1)),
  };
}

function previewFor(locale: string) {
  return previewNewsArticles.filter((article) => article.locale === locale || (locale !== "en" && article.locale === "en"));
}

export async function getPublishedArticles(options?: {
  locale?: string;
  category?: string;
  query?: string;
  page?: number;
  pageSize?: number;
}): Promise<NewsListResult> {
  const locale = options?.locale || "en";
  const page = Math.max(1, options?.page || 1);
  const pageSize = Math.min(24, Math.max(1, options?.pageSize || 9));

  if (!contentBackendConfigured) {
    const source = previewEnabled ? previewFor(locale) : [];
    const filtered = source.filter((article) => {
      const categoryMatches = !options?.category || article.category === options.category;
      const haystack = `${article.title} ${article.excerpt} ${article.category} ${article.tags.join(" ")}`.toLowerCase();
      const queryMatches = !options?.query || haystack.includes(options.query.toLowerCase());
      return categoryMatches && queryMatches;
    });
    const start = (page - 1) * pageSize;
    return {
      articles: filtered.slice(start, start + pageSize),
      total: filtered.length,
      categories: [...new Set(source.map((article) => article.category))],
      configured: false,
      unavailable: false,
    };
  }

  try {
    const now = encodeURIComponent(new Date().toISOString());
    const filters = [
      "select=*",
      "publication_state=eq.Published",
      "visibility=eq.Public",
      `published_at=lte.${now}`,
      `locale=eq.${encodeURIComponent(locale)}`,
      "order=featured.desc,published_at.desc",
    ];
    if (options?.category) filters.push(`category=eq.${encodeURIComponent(options.category)}`);
    if (options?.query) {
      const safe = options.query.replace(/[,*()]/g, " ").trim();
      if (safe) filters.push(`or=(title.ilike.*${encodeURIComponent(safe)}*,excerpt.ilike.*${encodeURIComponent(safe)}*)`);
    }

    const start = (page - 1) * pageSize;
    const [{ rows, total }, categoryRows] = await Promise.all([
      contentSelectPage<ArticleRow>("cms_articles", filters.join("&"), start, start + pageSize - 1, { revalidate: 300, tags: ["news"] }),
      contentSelect<Pick<ArticleRow, "category">>(
        "cms_articles",
        [
          "select=category",
          "publication_state=eq.Published",
          "visibility=eq.Public",
          `published_at=lte.${now}`,
          `locale=eq.${encodeURIComponent(locale)}`,
          "limit=500",
        ].join("&"),
        { revalidate: 300, tags: ["news-categories"] },
      ),
    ]);
    const mapped = rows.map(mapRow);
    if (mapped.length === 0 && locale !== "en") {
      return getPublishedArticles({ ...options, locale: "en" });
    }
    return {
      articles: mapped,
      total,
      categories: [...new Set(categoryRows.map((row) => row.category).filter((value): value is string => Boolean(value)))],
      configured: true,
      unavailable: false,
    };
  } catch {
    return { articles: [], total: 0, categories: [], configured: true, unavailable: true };
  }
}

export async function getArticleBySlug(slug: string, locale = "en"):
  Promise<{ article: NewsArticle | null; unavailable: boolean }> {
  if (!contentBackendConfigured) {
    const article = previewEnabled
      ? previewFor(locale).find((item) => item.slug === slug) || null
      : null;
    return { article, unavailable: false };
  }

  try {
    const now = encodeURIComponent(new Date().toISOString());
    const rows = await contentSelect<ArticleRow>(
      "cms_articles",
      [
        "select=*",
        `slug=eq.${encodeURIComponent(slug)}`,
        "publication_state=eq.Published",
        "visibility=eq.Public",
        `published_at=lte.${now}`,
        `locale=eq.${encodeURIComponent(locale)}`,
        "limit=1",
      ].join("&"),
      { revalidate: 300, tags: ["news", `news:${slug}`] },
    );
    if (!rows[0] && locale !== "en") return getArticleBySlug(slug, "en");
    return { article: rows[0] ? mapRow(rows[0]) : null, unavailable: false };
  } catch {
    return { article: null, unavailable: true };
  }
}

export async function getRelatedArticles(article: NewsArticle, limit = 3): Promise<NewsArticle[]> {
  const result = await getPublishedArticles({ locale: article.locale, pageSize: 24 });
  const preferred = result.articles.filter((candidate) =>
    candidate.slug !== article.slug &&
    (article.relatedSlugs.includes(candidate.slug) || candidate.category === article.category),
  );
  return preferred.slice(0, limit);
}


export async function getPublishedArticleIndex(locale = "en"): Promise<Array<{ slug: string; publishedAt: string; updatedAt?: string; featured: boolean }>> {
  if (!contentBackendConfigured) {
    return (previewEnabled ? previewFor(locale) : []).map((article) => ({ slug: article.slug, publishedAt: article.publishedAt, updatedAt: article.updatedAt, featured: article.featured }));
  }
  try {
    const now = encodeURIComponent(new Date().toISOString());
    const rows = await contentSelect<Pick<ArticleRow, "slug" | "published_at" | "updated_at" | "featured">>(
      "cms_articles",
      ["select=slug,published_at,updated_at,featured", "publication_state=eq.Published", "visibility=eq.Public", `published_at=lte.${now}`, `locale=eq.${encodeURIComponent(locale)}`, "order=published_at.desc", "limit=500"].join("&"),
      { revalidate: 300, tags: ["news-index"] },
    );
    if (rows.length === 0 && locale !== "en") return getPublishedArticleIndex("en");
    return rows.map((row) => ({ slug: row.slug, publishedAt: row.published_at || new Date(0).toISOString(), updatedAt: row.updated_at || undefined, featured: Boolean(row.featured) }));
  } catch {
    return [];
  }
}
export async function getAllPublishedArticleSlugs(locale = "en") {
  const index = await getPublishedArticleIndex(locale);
  return index.map((article) => article.slug);
}
