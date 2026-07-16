import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Newsroom from "@/components/Newsroom";
import { ArrowIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "News & Updates",
  description: "Announcements, product updates, engineering insights and company stories from ESB Games.",
};

export default function NewsPage() {
  return (
    <PageShell>
      <div className="news-page">
        <section className="news-hero">
          <div className="news-container news-hero-grid">
            <div className="news-hero-copy">
              <span className="news-eyebrow">ESB Games Newsroom</span>
              <h1>ESB Games<br /><span className="gradient-text">News & Updates</span></h1>
              <p>The latest announcements, platform updates, engineering insights and stories from the ESB Games team.</p>
              <div className="news-hero-actions">
                <a className="button button-primary" href="mailto:news@esbgames.com?subject=Subscribe to ESB Games updates">⌁ Subscribe to Updates</a>
                <Link className="button button-secondary" href="/signup">Follow ESB Games <ArrowIcon size={16} /></Link>
              </div>
            </div>

            <article className="news-feature-card">
              <div className="news-feature-art" aria-hidden="true">
                <div className="news-feature-skyline left" />
                <div className="news-feature-portal"><i /><b>ESB</b></div>
                <div className="news-feature-skyline right" />
                <div className="news-feature-people"><i /><i /><i /><i /><i /></div>
              </div>
              <div className="news-feature-copy">
                <span>Latest announcement</span>
                <small>July 2026</small>
                <h2>A first look at the ESB Games ecosystem</h2>
                <p>A new universe for creation, connection and play. One platform, built around players and creators.</p>
                <button type="button">Read Announcement <ArrowIcon size={17} /></button>
              </div>
              <div className="news-feature-pagination"><button type="button">‹</button><span>1 / 4</span><button type="button">›</button></div>
            </article>
          </div>
        </section>

        <section className="news-content-section">
          <div className="news-container"><Newsroom /></div>
        </section>
      </div>
    </PageShell>
  );
}
