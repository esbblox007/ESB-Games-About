import type { Metadata } from "next";
import "./globals.css";
import SiteTranslator from "@/components/SiteTranslator";

export const metadata: Metadata = {
  title: { default: "ESB Games — Play. Create. Connect.", template: "%s | ESB Games" },
  description: "Discover ESB Games, a creator-first gaming ecosystem for playing, building and connecting.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://about.esbgames.com"),
  icons: {
    icon: "/esb-blue-logo.png",
    apple: "/esb-blue-logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteTranslator />{children}</body></html>;
}
