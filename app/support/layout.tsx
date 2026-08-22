import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    title: "Support | ESB Games",
    description: "Browse ESB Games help resources, start a private support conversation and view pre-launch service-status information.",
    url: "/support",
    type: "website",
    images: [{ url: "/hero-discover-platform.png", alt: "ESB Games Support" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Support | ESB Games",
    description: "Browse ESB Games help resources and support routes.",
    images: ["/hero-discover-platform.png"],
  },
};

export default function SupportLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
