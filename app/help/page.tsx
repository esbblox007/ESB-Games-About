import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ServicePathways from "@/components/ServicePathways";

const description = "Choose between the ESB Games Help Centre, private Support, Trust & Safety guidance and Family Centre.";

export const metadata: Metadata = {
  title: "Help",
  description,
  alternates: { canonical: "/help" },
  openGraph: {
    title: "Help | ESB Games",
    description,
    url: "/help",
    type: "website",
    images: [{ url: "/hero-discover-platform.png", alt: "ESB Games Help" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Help | ESB Games",
    description,
    images: ["/hero-discover-platform.png"],
  },
};

export default function HelpPage() {
  return (
    <PageShell>
      <div className="help-hub-page">
        <section className="help-hub-hero">
          <div className="help-hub-container">
            <span className="eyebrow">ESB Games Help</span>
            <h1>What do you need help with?</h1>
            <p>Choose one area below. The next page focuses only on that area, without repeating this menu.</p>
          </div>
        </section>
        <div className="help-hub-container help-hub-pathways"><ServicePathways title="Choose an area" /></div>
      </div>
    </PageShell>
  );
}
