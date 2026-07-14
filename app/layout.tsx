import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ESB Games — Play. Create. Connect.", template: "%s | ESB Games" },
  description: "Discover ESB Games, a creator-first gaming ecosystem for playing, building and connecting.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://about.esbgames.com"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
