import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    title: "About ESB Games",
    description: "Learn about the ESB Games mission, principles and current pre-launch development direction.",
    url: "/about",
    type: "website",
    images: [{ url: "/og-preview", alt: "ESB Games platform interface" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About ESB Games",
    description: "Learn about the ESB Games mission and current development direction.",
    images: ["/og-preview"],
  },
};

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
