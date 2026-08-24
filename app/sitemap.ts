import type { MetadataRoute } from "next";
import { getPublishedArticleIndex, getPublishedDocumentationIndex } from "@/lib/content/news";
import { publishedPolicyDocuments } from "@/lib/content/policy-publication";
import { supportArticles } from "@/lib/content/support";
import { getLiveJobs } from "@/lib/content/careers-live";
import { staticDocumentationArticles, staticDocumentationSlugs } from "@/lib/content/static-documentation";
import { helpCategories } from "@/lib/content/help-centre";

const STATIC_CONTENT_LAST_REVIEWED = new Date("2026-08-24T22:15:00Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://about.esbgames.com";
  const paths = ["", "/about", "/press", "/developer-hub", "/game-creation-platform", "/parental-controls", "/news", "/documentation", "/download", "/careers", "/careers/privacy", "/support", "/help", "/help/centre", "/help/trust-safety", "/subscriptions"];
  const staticEntries: MetadataRoute.Sitemap = paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: STATIC_CONTENT_LAST_REVIEWED,
    changeFrequency: path === "" || path === "/news" || path === "/careers" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/news" || path === "/download" || path === "/developer-hub" || path === "/game-creation-platform" || path === "/press" ? 0.9 : 0.8,
  }));
  const helpEntries: MetadataRoute.Sitemap = helpCategories.map((category) => ({ url: `${base}/help/centre/${category.id}`, lastModified: STATIC_CONTENT_LAST_REVIEWED, changeFrequency: "monthly", priority: 0.68 }));
  const [news, documentation, careers] = await Promise.all([getPublishedArticleIndex(), getPublishedDocumentationIndex(), getLiveJobs()]);
  const articleEntries: MetadataRoute.Sitemap = news.map((article) => ({ url: `${base}/news/${article.slug}`, lastModified: new Date(article.updatedAt || article.publishedAt), changeFrequency: "monthly", priority: article.featured ? 0.85 : 0.75 }));
  const starterDocumentationEntries: MetadataRoute.Sitemap = staticDocumentationArticles.filter((article) => article.sitemap).map((article) => ({ url: `${base}/documentation/${article.slug}`, lastModified: new Date(article.updatedAt || article.publishedAt), changeFrequency: "monthly", priority: article.featured ? 0.82 : 0.72 }));
  const documentationEntries: MetadataRoute.Sitemap = documentation.filter((article) => !staticDocumentationSlugs.has(article.slug)).map((article) => ({ url: `${base}/documentation/${article.slug}`, lastModified: new Date(article.updatedAt || article.publishedAt), changeFrequency: "monthly", priority: article.featured ? 0.8 : 0.7 }));
  const supportEntries: MetadataRoute.Sitemap = supportArticles.map((article) => ({ url: `${base}/support/help/${article.slug}`, lastModified: STATIC_CONTENT_LAST_REVIEWED, changeFrequency: "monthly", priority: 0.65 }));
  const careerEntries: MetadataRoute.Sitemap = careers.jobs.map((job) => ({ url: `${base}/careers/${job.slug}`, lastModified: STATIC_CONTENT_LAST_REVIEWED, changeFrequency: "weekly", priority: 0.75 }));
  const policyEntries: MetadataRoute.Sitemap = publishedPolicyDocuments.map((policy) => ({ url: `${base}/${policy.slug}`, lastModified: STATIC_CONTENT_LAST_REVIEWED, changeFrequency: "monthly", priority: 0.7 }));
  return [...staticEntries, ...helpEntries, ...policyEntries, ...articleEntries, ...starterDocumentationEntries, ...documentationEntries, ...supportEntries, ...careerEntries];
}
