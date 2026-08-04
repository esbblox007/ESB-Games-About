import { NextRequest, NextResponse } from "next/server";
import { staticSearchDocuments } from "@/lib/search/static-index";
import { rankSearchResults } from "@/lib/search/search";
import { getPublishedArticles } from "@/lib/content/news";
import { getDownloadProducts } from "@/lib/content/downloads";
import { contentBackendConfigured, contentSelect } from "@/lib/content/supabase";
import type { SearchDocument } from "@/lib/content/types";

const searchTypes = new Set<SearchDocument["type"]>(["Page", "News", "Help", "Download", "Careers", "Legal", "Support", "Creator"]);

function safeSearchRoute(value: unknown) {
  const route = String(value || "/");
  if (route.startsWith("/") && !route.startsWith("//")) return route;
  try {
    const url = new URL(route);
    return url.protocol === "https:" || url.protocol === "http:" ? route : "/";
  } catch {
    return "/";
  }
}

function stringList(value: unknown) {
  return Array.isArray(value) ? value.slice(0, 100).map((item) => String(item).slice(0, 500)).filter(Boolean) : [];
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() || "";
  const locale = request.nextUrl.searchParams.get("locale") || "en";

  if (!query) {
    return NextResponse.json({ query, results: [], state: "idle" });
  }

  try {
    const [news, downloads, indexedRows] = await Promise.all([
      getPublishedArticles({ locale, query, pageSize: 12 }),
      getDownloadProducts(),
      contentBackendConfigured
        ? contentSelect<Record<string, unknown>>(
            "site_search_documents",
            `select=*&published=eq.true&locale=eq.${encodeURIComponent(locale)}&limit=80`,
            { revalidate: 300, tags: ["search-index"] },
          ).catch(() => [])
        : Promise.resolve([]),
    ]);

    const dynamicDocuments: SearchDocument[] = [
      ...news.articles.map((article) => ({
        id: `news:${article.id}`,
        type: "News" as const,
        title: article.title,
        description: article.excerpt,
        route: `/news/${article.slug}`,
        category: article.category,
        locale: article.locale,
        keywords: article.tags,
        synonyms: [],
        questions: [],
        content: `${article.subtitle || ""} ${article.excerpt} ${article.body.map((block) => { if ("text" in block) return typeof block.text === "string" ? block.text : block.text.map((span) => span.text).join(" "); if ("items" in block) return block.items.join(" "); if ("code" in block) return block.code; return ""; }).join(" ")}`,
        priority: article.featured ? 96 : 82,
      })),
      ...downloads.products.flatMap((product) => product.releases.map((release) => ({
        id: `download:${release.id}`,
        type: "Download" as const,
        title: `${product.name} for ${release.platform}`,
        description: release.fileUrl ? `Download version ${release.version || "current"}.` : "No public download is currently available for this platform.",
        route: "/download",
        category: "Downloads",
        locale: "en",
        keywords: [product.name, release.platform, release.version || "", "download", "install"].filter(Boolean),
        synonyms: ["launcher", "client", "creator software"],
        questions: [`How do I download ${product.name}?`],
        content: `${product.description} ${release.minimumRequirements?.join(" ") || ""}`,
        priority: 94,
      }))),
      ...indexedRows.map((row) => ({
        id: `index:${String(row.id || row.route || row.title)}`,
        type: searchTypes.has(String(row.document_type) as SearchDocument["type"]) ? String(row.document_type) as SearchDocument["type"] : "Page",
        title: String(row.title || "Untitled"),
        description: String(row.description || ""),
        route: safeSearchRoute(row.route),
        category: String(row.category || "Website"),
        locale: String(row.locale || locale),
        keywords: stringList(row.keywords),
        synonyms: stringList(row.synonyms),
        questions: stringList(row.questions),
        content: String(row.content || "").slice(0, 100000),
        priority: Number(row.priority || 50),
      })),
    ];

    const results = rankSearchResults([...staticSearchDocuments, ...dynamicDocuments], query);
    return NextResponse.json({ query, results, state: results.length ? "ready" : "empty" });
  } catch {
    const results = rankSearchResults(staticSearchDocuments, query);
    return NextResponse.json({ query, results, state: results.length ? "partial" : "unavailable" }, { status: 200 });
  }
}
