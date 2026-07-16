import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://about.esbgames.com";
  const paths = [
    "",
    "/about",
    "/developer-hub",
    "/parental-controls",
    "/news",
    "/careers",
    "/support",
    "/subscriptions",
    "/early-access",
    "/login",
    "/signup",
  ];

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/news" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/login" || path === "/signup" ? 0.7 : 0.8,
  }));
}
