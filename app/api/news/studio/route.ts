import { getPublishedArticles } from "@/lib/content/news";

const STUDIO_ORIGINS = new Set([
  "https://esbstudio.esbgames.com",
  "https://studio.app.esbgames.com",
  "https://studio.esbgames.com",
]);
const TAGS = ["studio", "development", "creator"];

function cors(origin: string | null) {
  return origin && STUDIO_ORIGINS.has(origin)
    ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" }
    : {};
}
export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || !STUDIO_ORIGINS.has(origin)) return new Response(null, { status: 403 });
  return new Response(null, {
    status: 204,
    headers: { ...cors(origin), "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "3600" },
  });
}

export async function GET(request: Request) {
  const origin = request.headers.get("origin");
  const headers = {
    ...cors(origin), "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, s-maxage=180, stale-while-revalidate=300",
  };
  try {
    // getPublishedArticles enforces Published + Public + date/locale constraints
    // on the server, so drafts, scheduled and Studio-only news never leak here.
    const results = await Promise.all(TAGS.map(tag =>
      getPublishedArticles({ tag, page: 1, pageSize: 24, excludeTag: "documentation-only" })
    ));
    if (results.some(result => result.unavailable))
      return Response.json({ error: "News is temporarily unavailable" }, { status: 503, headers });
    const bySlug = new Map<string, {
      title: string; slug: string; excerpt: string; category: string;
      tags: string[]; publishedAt: string; coverImage: string | null;
    }>();
    for (const result of results) for (const item of result.articles) {
      if (!bySlug.has(item.slug)) bySlug.set(item.slug, {
        title: item.title, slug: item.slug, excerpt: item.excerpt,
        category: item.category, tags: item.tags, publishedAt: item.publishedAt,
        coverImage: item.coverImage || null,
      });
    }
    const articles = [...bySlug.values()]
      .sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).slice(0,24);
    return Response.json({ articles, source: "ESB Games public newsroom" }, { headers });
  } catch {
    return Response.json({ error: "News is temporarily unavailable" }, { status: 503, headers });
  }
}
