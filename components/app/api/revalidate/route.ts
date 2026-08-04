import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

interface RevalidationPayload {
  type?: "news" | "downloads" | "all";
  slug?: string;
  downloads?: boolean;
  search?: boolean;
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

  if (refreshNews) {
    revalidateTag("news");
    revalidateTag("news-categories");
    revalidateTag("news-index");
    revalidatePath("/news");
    revalidatePath("/news/rss.xml");
    revalidatePath("/sitemap.xml");
    paths.push("/news", "/news/rss.xml", "/sitemap.xml");
    if (payload.slug) {
      const safeSlug = payload.slug.replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 180);
      if (safeSlug) {
        revalidateTag(`news:${safeSlug}`);
        revalidatePath(`/news/${safeSlug}`);
        paths.push(`/news/${safeSlug}`);
      }
    }
  }

  if (refreshDownloads) {
    revalidateTag("downloads");
    revalidatePath("/download");
    paths.push("/download");
  }

  if (refreshSearch) revalidateTag("search-index");

  return NextResponse.json({ revalidated: true, paths: [...new Set(paths)] });
}
