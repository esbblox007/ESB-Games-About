import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import HelpCentreBrowser from "@/components/HelpCentreBrowser";
import { ArrowIcon, SearchIcon } from "@/components/Icons";

const description = "Self-service ESB Games guidance for accounts, safety, payments, creator tools, families and technical issues.";

export const metadata: Metadata = {
  title: "Help Centre",
  description,
  alternates: { canonical: "/help/centre" },
  openGraph: {
    title: "Help Centre | ESB Games",
    description,
    url: "/help/centre",
    type: "website",
    images: [{ url: "/hero-discover-platform.png", alt: "ESB Games Help Centre" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Help Centre | ESB Games",
    description,
    images: ["/hero-discover-platform.png"],
  },
};

export default function HelpCentrePage() {
  return (
    <PageShell>
      <div className="help-centre-page help-centre-page-structured">
        <section className="help-centre-hero help-centre-detail-hero">
          <div className="help-centre-container">
            <Link href="/help" className="help-back-link"><ArrowIcon size={15} /> Back to Help</Link>
            <div className="help-centre-hero-copy">
              <span className="eyebrow">ESB Games Help Centre</span>
              <h1>Find answers and guides.</h1>
              <p>Browse self-service guidance for common tasks and questions. If your issue needs account-specific investigation or evidence review, use private Support instead.</p>
              <div className="help-quick-actions">
                <Link className="button button-secondary" href="/support/help/report-player-or-game">Reporting guide</Link>
                <a className="button button-secondary" href="https://status.esbgames.com" target="_blank" rel="noreferrer">Service status</a>
                <Link className="button button-primary" href="/support#contact-support"><SearchIcon size={16} /> Open private Support</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="help-centre-section">
          <div className="help-centre-container">
            <header className="help-browser-intro">
              <span className="eyebrow">Browse by topic</span>
              <h2>Choose the area you need.</h2>
              <p>Each topic opens on its own page so you only see the guidance relevant to what you selected.</p>
            </header>
            <HelpCentreBrowser />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
