import type { MetadataRoute } from "next";
import { getPublishedArticleIndex } from "@/lib/content/news";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://about.esbgames.com";
  const paths = [
    "",
    "/about",
    "/developer-hub",
    "/parental-controls",
    "/news",
    "/download",
    "/careers",
    "/support",
    "/subscriptions",
    "/early-access",
    "/login",
    "/signup",
  ];

  const staticEntries: MetadataRoute.Sitemap = paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/news" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/news" || path === "/download" ? 0.9 : path === "/login" || path === "/signup" ? 0.6 : 0.8,
  }));

  const news = await getPublishedArticleIndex();
  const articleEntries: MetadataRoute.Sitemap = news.map((article) => ({
    url: `${base}/news/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.publishedAt),
    changeFrequency: "monthly",
    priority: article.featured ? 0.85 : 0.75,
  }));

  return [...staticEntries, ...articleEntries];
}
