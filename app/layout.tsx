import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./layout-fixes.css";
import "./careers-empty-state.css";
import "./trust-polish.css";
import SiteTranslator from "@/components/SiteTranslator";
import { ESB_BRAND } from "@/lib/site-config";

export const metadata: Metadata = {
  title: { default: `ESB Games — ${ESB_BRAND.tagline}`, template: "%s | ESB Games" },
  description: "Discover ESB Games, a connected gaming and creator ecosystem being built for players, creators, families and communities.",
  metadataBase: new URL(ESB_BRAND.siteUrl),
  alternates: { canonical: ESB_BRAND.siteUrl },
  icons: { icon: "/esb-blue-logo.png", apple: "/esb-blue-logo.png" },
  openGraph: {
    type: "website",
    siteName: "ESB Games",
    title: `ESB Games — ${ESB_BRAND.tagline}`,
    description: "A connected gaming and creator ecosystem where people can discover, belong and build.",
    url: ESB_BRAND.siteUrl,
    images: [{ url: "/hero-discover-platform.png", alt: "ESB Games platform interface" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `ESB Games — ${ESB_BRAND.tagline}`,
    description: "A connected gaming and creator ecosystem where people can discover, belong and build.",
    images: ["/hero-discover-platform.png"],
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#040711", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ESB_BRAND.name,
    url: ESB_BRAND.siteUrl,
    slogan: ESB_BRAND.tagline,
    logo: `${ESB_BRAND.siteUrl}/esb-blue-logo.png`,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        <SiteTranslator />
        {children}
      </body>
    </html>
  );
}
