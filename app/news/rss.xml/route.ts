import { getPublishedArticles } from "@/lib/content/news";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://about.esbgames.com";

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character] || character);
}

export async function GET() {
  const result = await getPublishedArticles({ pageSize: 24 });
  const items = result.articles.map((article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${siteUrl}/news/${encodeURIComponent(article.slug)}</link>
      <guid>${siteUrl}/news/${encodeURIComponent(article.slug)}</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <category>${escapeXml(article.category)}</category>
    </item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>ESB Games News &amp; Updates</title>
      <link>${siteUrl}/news</link>
      <description>Company announcements, platform updates and creator news from ESB Games.</description>
      <language>en-gb</language>
      ${items}
    </channel>
  </rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
}
