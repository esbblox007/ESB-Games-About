import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const INDEXNOW_KEY = "7411ca539f9f4e65a2e6098580cb425d";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
// Public publishing notifications use host-local key verification.

interface RevalidationPayload {
  type?: "news" | "downloads" | "all";
  slug?: string;
  downloads?: boolean;
  search?: boolean;
}

async function notifyIndexNow(urls: string[]) {
  const uniqueUrls = [...new Set(urls)].filter(Boolean);
  if (!uniqueUrls.length) return [];

  const byHost = new Map<string, string[]>();
  for (const url of uniqueUrls) {
    try {
      const parsed = new URL(url);
      const existing = byHost.get(parsed.host) ?? [];
      existing.push(parsed.toString());
      byHost.set(parsed.host, existing);
    } catch {
      // Ignore malformed URLs rather than failing a CMS revalidation request.
    }
  }

  return Promise.all(
    [...byHost.entries()].map(async ([host, urlList]) => {
      try {
        const response = await fetch(INDEXNOW_ENDPOINT, {
          method: "POST",
          headers: { "content-type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            host,
            key: INDEXNOW_KEY,
            keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
            urlList,
          }),
          cache: "no-store",
        });

        return { host, ok: response.ok, status: response.status };
      } catch {
        return { host, ok: false, status: 0 };
      }
    }),
  );
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-esb-revalidate-secret");
  if (!process.env.REVALIDATION_SECRET || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }

  let payload: RevalidationPayload = {};
  try { payload = await request.json(); } catch { /* an empty body refreshes News */ }

  const refreshDownloads = payload.type === "downloads" || payload.type === "all" || payload.downloads === true;
  const refreshNews = payload.type === undefined || payload.type === "news" || payload.type === "all" || Boolean(payload.slug);
  const refreshSearch = payload.search !== false;
  const paths: string[] = [];
  const indexNowUrls: string[] = [];

  if (refreshNews) {
    revalidateTag("news");
    revalidateTag("news-categories");
    revalidateTag("news-index");
    revalidatePath("/news");
    revalidatePath("/news/rss.xml");
    revalidatePath("/sitemap.xml");
    paths.push("/news", "/news/rss.xml", "/sitemap.xml");
    indexNowUrls.push("https://about.esbgames.com/news");

    if (payload.slug) {
      const safeSlug = payload.slug.replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 180);
      if (safeSlug) {
        revalidateTag(`news:${safeSlug}`);
        revalidatePath(`/news/${safeSlug}`);
        paths.push(`/news/${safeSlug}`);
        indexNowUrls.push(`https://about.esbgames.com/news/${safeSlug}`);
      }
    }
  }

  if (refreshDownloads) {
    revalidateTag("downloads");
    revalidatePath("/download");
    paths.push("/download");
    indexNowUrls.push("https://about.esbgames.com/download");
  }

  if (refreshSearch) revalidateTag("search-index");

  // IndexNow is best-effort. Publishing/revalidation must still succeed if a search engine is unavailable.
  const indexNow = await notifyIndexNow(indexNowUrls);

  return NextResponse.json({
    revalidated: true,
    paths: [...new Set(paths)],
    indexNow,
  });
}
