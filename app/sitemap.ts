import type { MetadataRoute } from "next";
import { getPublishedArticleIndex } from "@/lib/content/news";
import { supportArticles } from "@/lib/content/support";
import { getLiveJobs } from "@/lib/content/careers-live";

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
  ];

  const staticEntries: MetadataRoute.Sitemap = paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/news" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/news" || path === "/download" ? 0.9 : 0.8,
  }));

  const [news, careers] = await Promise.all([getPublishedArticleIndex(), getLiveJobs()]);
  const articleEntries: MetadataRoute.Sitemap = news.map((article) => ({
    url: `${base}/news/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.publishedAt),
    changeFrequency: "monthly",
    priority: article.featured ? 0.85 : 0.75,
  }));

  const supportEntries: MetadataRoute.Sitemap = supportArticles.map((article) => ({
    url: `${base}/support/help/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  const careerEntries: MetadataRoute.Sitemap = careers.jobs.map((job) => ({
    url: `${base}/careers/${job.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticEntries, ...articleEntries, ...supportEntries, ...careerEntries];
}
