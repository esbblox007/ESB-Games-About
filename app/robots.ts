import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://about.esbgames.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/support/ticket/", "/support/transcript/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
