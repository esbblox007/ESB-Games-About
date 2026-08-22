import type { MetadataRoute } from "next";
import { getPublishedArticleIndex, getPublishedDocumentationIndex } from "@/lib/content/news";
import { publishedPolicyDocuments } from "@/lib/content/policy-publication";
import { supportArticles } from "@/lib/content/support";
import { getLiveJobs } from "@/lib/content/careers-live";

const STATIC_CONTENT_LAST_REVIEWED = new Date("2026-08-22T00:00:00Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://about.esbgames.com";
  const paths = [
    "",
    "/about",
    "/developer-hub",
    "/parental-controls",
    "/news",
    "/documentation",
    "/download",
    "/careers",
    "/support",
    "/help",
    "/trust",
    "/trust/safety",
    "/subscriptions",
  ];

  const staticEntries: MetadataRoute.Sitemap = paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: STATIC_CONTENT_LAST_REVIEWED,
    changeFrequency: path === "" || path === "/news" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/news" || path === "/download" ? 0.9 : 0.8,
  }));

  const [news, documentation, careers] = await Promise.all([getPublishedArticleIndex(), getPublishedDocumentationIndex(), getLiveJobs()]);
  const articleEntries: MetadataRoute.Sitemap = news.map((article) => ({
    url: `${base}/news/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.publishedAt),
    changeFrequency: "monthly",
    priority: article.featured ? 0.85 : 0.75,
  }));

  const documentationEntries: MetadataRoute.Sitemap = documentation.map((article) => ({
    url: `${base}/documentation/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.publishedAt),
    changeFrequency: "monthly",
    priority: article.featured ? 0.8 : 0.7,
  }));

  const supportEntries: MetadataRoute.Sitemap = supportArticles.map((article) => ({
    url: `${base}/support/help/${article.slug}`,
    lastModified: STATIC_CONTENT_LAST_REVIEWED,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  const careerEntries: MetadataRoute.Sitemap = careers.jobs.map((job) => ({
    url: `${base}/careers/${job.slug}`,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const policyEntries: MetadataRoute.Sitemap = publishedPolicyDocuments.map((policy) => ({
    url: `${base}/${policy.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...policyEntries, ...articleEntries, ...documentationEntries, ...supportEntries, ...careerEntries];
}
