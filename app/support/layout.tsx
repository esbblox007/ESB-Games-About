import type { Metadata } from "next";
import "./support-fixes.css";
import "./support-ticket-lanes.css";
import "./support-account-live.css";
import "./support-unified-inbox.css";
import "./support-ticket-scale.css";
import "./support-private-mobile-compact.css";
import "./support-appeals-qa-fixes.css";
import SupportFlowEnhancements from "@/components/SupportFlowEnhancements";

export const metadata: Metadata = {
  openGraph: {
    title: "Support | ESB Games",
    description: "Browse ESB Games help resources, start a private support conversation and view pre-launch service-status information.",
    url: "/support",
    type: "website",
    images: [{ url: "/og-preview", alt: "ESB Games Support" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Support | ESB Games",
    description: "Browse ESB Games help resources and support routes.",
    images: ["/og-preview"],
  },
};

export default function SupportLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><SupportFlowEnhancements />{children}</>;
}
