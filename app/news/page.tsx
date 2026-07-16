import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "News" };

const stories = [
  { tag: "Company", title: "Building the ESB Games ecosystem", text: "A look at how the player platform, creator tools and communities are being designed to work together." },
  { tag: "Product", title: "Inside ESB Studio", text: "Discover the accessible creation workflow, advanced mode and integrated tools planned for creators." },
  { tag: "Safety", title: "Safety by design", text: "How parental controls, account protections and moderation are being built into the platform from day one." },
];

export default function NewsPage() {
  return (
    <PageShell>
      <section className="page-banner news-banner">
        <div className="section-inner"><span className="eyebrow">ESB GAMES NEWSROOM</span><h1 className="page-title">News, ideas and<br/><span className="gradient-text">company updates.</span></h1><p>Follow product development, creator stories, safety updates and announcements from ESB Games.</p></div>
      </section>
      <section className="section">
        <div className="section-inner">
          <div className="news-card-grid">
            {stories.map((story, index) => <article className="news-story-card" key={story.title}><div className={`news-story-art news-story-art-${index + 1}`}><span>{story.tag}</span></div><div className="news-story-copy"><small>{story.tag} · Coming soon</small><h2>{story.title}</h2><p>{story.text}</p><Link href="/news">Read update <span>→</span></Link></div></article>)}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
