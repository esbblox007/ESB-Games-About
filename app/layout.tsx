import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteTranslator from "@/components/SiteTranslator";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://about.esbgames.com";

export const metadata: Metadata = {
  title: { default: "ESB Games — Play. Create. Connect.", template: "%s | ESB Games" },
  description: "Discover ESB Games, a creator-first gaming ecosystem for playing, building and connecting.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: siteUrl },
  icons: { icon: "/esb-blue-logo.png", apple: "/esb-blue-logo.png" },
  openGraph: {
    type: "website",
    siteName: "ESB Games",
    title: "ESB Games — Play. Create. Connect.",
    description: "A creator-first gaming ecosystem for playing, building and connecting.",
    url: siteUrl,
  },
  twitter: { card: "summary_large_image", title: "ESB Games", description: "Play. Create. Connect." },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#040711", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body><SiteTranslator />{children}</body></html>;
}
