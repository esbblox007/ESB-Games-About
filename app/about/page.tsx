import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import { CubeIcon, GamepadIcon, GlobeIcon, HeartIcon, RocketIcon, ShieldIcon, UsersIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "About ESB Games",
  description: "Discover ESB Games: browser-based user-generated games, one gaming app, ESB Studio creator tools, ESB Groups and Family Centre.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About ESB Games",
    description: "Discover ESB Games: download-free browser play, one gaming app, ESB Studio and connected communities.",
    url: "/about",
    type: "website",
    images: [{ url: "/og-preview", alt: "ESB Games platform interface" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About ESB Games",
    description: "Discover ESB Games: download-free browser play, one gaming app, ESB Studio and connected communities.",
    images: ["/og-preview"],
  },
};

const principles = [
  { title: "Community first", description: "We are building a positive, inclusive platform where players, creators and communities can genuinely belong.", icon: <UsersIcon size={21} />, tone: "pink" },
  { title: "Creativity without limits", description: "Powerful tools should make ambitious ideas possible without making creation difficult to begin.", icon: <HeartIcon size={21} />, tone: "purple" },
  { title: "Creators and players empowered", description: "The people who build and enjoy the platform should have a meaningful voice in how it develops.", icon: <CubeIcon size={21} />, tone: "blue" },
  { title: "Players come first", description: "Discovery, performance, social features and safety should all make the player experience better.", icon: <GamepadIcon size={21} />, tone: "orange" },
  { title: "Integrity and trust", description: "Clear communication, fair systems and accountable decisions are essential to earning long-term trust.", icon: <ShieldIcon size={21} />, tone: "green" },
] as const;

export default function AboutPage() {
  return (
    <PageShell>
      <div className="about-page-v2">
        <section className="about-video-hero about-static-hero">
          <div className="about-video-layer" aria-hidden="true"><div className="about-video-shade" /><div className="about-video-colour" /></div>
          <div className="about-hero-inner">
            <div className="about-hero-copy">
              <span className="about-kicker">About ESB Games</span>
              <h1>Discover.<br />Belong.<br /><span>Build.</span></h1>
              <p>ESB Games is a connected user-generated gaming ecosystem bringing download-free browser play, one gaming app, ESB Studio creation tools and communities together.</p>
              <div className="about-hero-actions">
                <a href="https://esbgames.com" className="button button-primary" data-analytics="explore-platform"><RocketIcon size={17} /> Explore ESB Games</a>
                <Link href="/careers" className="button button-secondary">Join the team</Link>
              </div>
            </div>
            <div className="about-development-status" aria-label="Current development status">
              <span className="eyebrow">Current stage</span>
              <strong>Pre-launch development</strong>
              <p>ESB Games is in final development and Quality Assurance testing ahead of launch.</p>
            </div>
          </div>
        </section>

        <section className="about-mission-section">
          <div className="about-section-inner">
            <Reveal><article className="about-mission-card"><span className="about-quote-mark">“</span><blockquote>Our mission is to build a safer, fairer and more <em>creative gaming ecosystem</em>, and to share its success with the players and creators who help build it.</blockquote><p>The ESB Games founding team</p></article></Reveal>
            <div className="about-stat-grid about-proof-grid" aria-label="ESB Games direction">
              <Reveal><article><GamepadIcon size={20} /><strong>DISCOVER</strong><span>Find experiences, creators and communities through a connected platform.</span></article></Reveal>
              <Reveal><article><UsersIcon size={20} /><strong>BELONG</strong><span>ESB Groups and social features connect players, creators and communities.</span></article></Reveal>
              <Reveal><article><CubeIcon size={20} /><strong>BUILD</strong><span>ESB Studio connects world building, scripting, publishing and creator growth tools.</span></article></Reveal>
              <Reveal><article><RocketIcon size={20} /><strong>ONE ECOSYSTEM</strong><span>Player, creator, family and support experiences are designed to connect through shared services.</span></article></Reveal>
            </div>
          </div>
        </section>

        <section className="about-principles-section">
          <div className="about-section-inner">
            <Reveal className="about-section-heading"><span className="about-kicker">What guides us</span><h2>The principles behind what we build.</h2><p>Every feature, policy and product decision should make ESB Games safer, fairer and more useful for the people who use it.</p></Reveal>
            <div className="about-principles-grid">{principles.map((principle) => <Reveal key={principle.title}><article className="about-principle-card"><span className={`about-card-icon about-card-icon-${principle.tone}`}>{principle.icon}</span><h3>{principle.title}</h3><p>{principle.description}</p></article></Reveal>)}</div>
          </div>
        </section>

        <section className="about-platform-section">
          <div className="about-section-inner about-platform-layout">
            <Reveal className="about-platform-copy"><span className="about-kicker">Why ESB Games</span><h2>One ecosystem for discovery, community and <span>creation.</span></h2><p>ESB Games brings browser play, one ESB Games app, ESB Studio, ESB Groups, Family Centre and ESB Bucks together through shared accounts and cloud-connected services.</p><Link href="/developer-hub" className="button button-secondary">Explore the Creator Hub</Link></Reveal>
            <div className="about-platform-grid">
              <Reveal><article><span className="about-card-icon about-card-icon-purple"><RocketIcon size={21} /></span><h3>Connected platform</h3><p>Core products are designed around one ESB Games account instead of disconnected identities.</p></article></Reveal>
              <Reveal><article><span className="about-card-icon about-card-icon-pink"><CubeIcon size={21} /></span><h3>ESB Studio creator tools</h3><p>Game creation, assets, collaboration, publishing and analytics connect creators with players.</p></article></Reveal>
              <Reveal><article><span className="about-card-icon about-card-icon-blue"><ShieldIcon size={21} /></span><h3>Safety considered early</h3><p>Trust & Safety, account protection and Family Centre support age-aware and family-focused experiences.</p></article></Reveal>
              <Reveal><article><span className="about-card-icon about-card-icon-green"><GlobeIcon size={21} /></span><h3>International direction</h3><p>Creators and players connect through an online ecosystem for international communities.</p></article></Reveal>
            </div>
          </div>
        </section>

        <section className="about-cta-section"><Reveal><div className="about-cta-card"><div><span className="about-kicker">Explore the ecosystem</span><h2>Explore ESB Games, Studio and the connected ecosystem.</h2><p>Discover how browser play, one app, creation tools, ESB Groups and Family Centre fit together.</p></div><a href="https://esbgames.com" className="button button-primary" data-analytics="explore-platform"><RocketIcon size={17} /> Explore the platform</a></div></Reveal></section>
      </div>
    </PageShell>
  );
}
