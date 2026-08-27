import type { Metadata } from "next";
import "./support-fixes.css";
import "./support-ticket-lanes.css";
import "./support-account-live.css";
import "./support-unified-inbox.css";
import "./support-ticket-scale.css";
import SupportFlowEnhancements from "@/components/SupportFlowEnhancements";

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
  return <><SupportFlowEnhancements />{children}</>;
}
