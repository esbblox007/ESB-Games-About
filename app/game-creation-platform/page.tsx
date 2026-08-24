import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { BookIcon, CubeIcon, GamepadIcon, GlobeIcon, RocketIcon, ShieldIcon, UsersIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Game Creation Platform for Creators",
  description: "Learn how ESB Games and ESB Studio are being built as a connected game creation platform for developing, testing, publishing and discovering interactive experiences.",
  keywords: ["game creation platform", "game development platform", "create games", "game creator tools", "ESB Studio", "ESB Games creator platform"],
  alternates: { canonical: "/game-creation-platform" },
  openGraph: {
    title: "Game Creation Platform for Creators | ESB Games",
    description: "A connected creator ecosystem for building, testing, publishing and discovering games and interactive experiences.",
    url: "/game-creation-platform",
    type: "website",
    images: [{ url: "/hero-studio-platform.png", alt: "ESB Studio game creation platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Creation Platform for Creators | ESB Games",
    description: "A connected creator ecosystem for building, testing, publishing and discovering games and interactive experiences.",
    images: ["/hero-studio-platform.png"],
  },
};

const stages = [
  { icon: <CubeIcon />, title: "Create", text: "Build worlds, gameplay systems, interfaces, animation, effects and audio inside ESB Studio." },
  { icon: <GamepadIcon />, title: "Test", text: "Play-test experiences and review how projects behave before preparing them for release." },
  { icon: <ShieldIcon />, title: "Prepare", text: "Publishing and moderation workflows are being designed to help creators prepare experiences for the platform." },
  { icon: <GlobeIcon />, title: "Publish & discover", text: "Released experiences are intended to connect with ESB Games discovery, profiles, communities and events." },
];

export default function GameCreationPlatformPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Game Creation Platform for Creators",
    description: "How ESB Games and ESB Studio are being developed as a connected game creation and publishing ecosystem.",
    url: "https://about.esbgames.com/game-creation-platform",
    about: {
      "@type": "SoftwareApplication",
      name: "ESB Studio",
      applicationCategory: "DeveloperApplication",
      publisher: { "@type": "Organization", name: "ESB Games", url: "https://esbgames.com" },
    },
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <section className="creator-hero">
        <div className="creator-hero-inner">
          <div className="creator-hero-copy">
            <span className="eyebrow">Game creation on ESB Games</span>
            <h1>A connected <span className="gradient-text">game creation platform.</span></h1>
            <p>ESB Games is building a creator ecosystem that connects game development in ESB Studio with testing, publishing, discovery and community features across the wider platform.</p>
            <div className="creator-hero-actions">
              <Link href="/developer-hub" className="button button-primary"><RocketIcon size={17} /> Explore ESB Studio</Link>
              <Link href="/documentation" className="button button-secondary"><BookIcon size={17} /> Creator Documentation</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="creator-section creator-feature-section">
        <div className="creator-container">
          <header className="creator-center-heading">
            <span className="eyebrow">From development to discovery</span>
            <h2>Build, test, publish and <span className="gradient-text">grow.</span></h2>
            <p>A game creation platform is most useful when development tools connect naturally to the places where players actually discover and play experiences. ESB Games is being designed around that full creator journey.</p>
          </header>
          <div className="creator-feature-grid">
            {stages.map((stage) => <article className="creator-feature-card" key={stage.title}><span className="creator-icon creator-icon-blue">{stage.icon}</span><h3>{stage.title}</h3><p>{stage.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="creator-section">
        <div className="creator-container">
          <header className="creator-center-heading">
            <span className="eyebrow">What is ESB Studio?</span>
            <h2>The creator environment behind <span className="gradient-text">ESB Games.</span></h2>
            <p>ESB Studio is the game development environment being built for creators who want to make interactive experiences for ESB Games. Its planned toolset includes Lua scripting, world building, user interface tools, animation, VFX, audio, project management and play-testing.</p>
          </header>
          <div className="creator-feature-grid">
            <article className="creator-feature-card"><h3>Lua scripting</h3><p>Creators can build custom game logic, systems and interactions using Lua-based scripting workflows as Studio development progresses.</p></article>
            <article className="creator-feature-card"><h3>Visual creation tools</h3><p>World building, interfaces, effects, animation and sound are being brought together so creators can work across different parts of a project in one environment.</p></article>
            <article className="creator-feature-card"><h3>Connected publishing</h3><p>The creator workflow is being designed to connect directly to ESB Games rather than ending when development is complete.</p></article>
            <article className="creator-feature-card"><h3>Player discovery</h3><p>Creator profiles, communities, events and personalised discovery are intended to help published experiences reach relevant players.</p></article>
          </div>
        </div>
      </section>

      <section className="creator-section">
        <div className="creator-container creator-resource-layout">
          <div>
            <header className="creator-section-heading"><span className="eyebrow">Built for creators and players</span><h2>One <span className="gradient-text">ecosystem.</span></h2></header>
            <p>ESB Games is not positioning creation as a separate product bolted onto a gaming site. The platform, creator tools, communities, events, discovery and safety systems are being developed as connected parts of the same ecosystem.</p>
            <p>That means a creator can work toward a single journey: make an experience, test it, prepare it for release, publish it, build a community around it and understand how players are engaging with it as the platform expands.</p>
          </div>
          <aside className="creator-studio-directory">
            <header><span className="eyebrow">Current status</span><h2>Still in <span className="gradient-text">development.</span></h2></header>
            <p>ESB Studio and public creator publishing are still in development. This page describes the product direction and systems being built, not features that are already publicly available.</p>
            <Link href="/download" className="creator-directory-link">Check ESB Studio availability →</Link>
          </aside>
        </div>
      </section>

      <section className="creator-section creator-final-section"><div className="creator-container"><div className="creator-final-cta"><div><span className="eyebrow">Creator ecosystem</span><h2>Explore the tools behind <span className="gradient-text">ESB Games.</span></h2><p>Visit the Creator Hub for ESB Studio information, development resources and availability.</p></div><Link href="/developer-hub" className="button button-primary"><UsersIcon size={17} /> Open Creator Hub</Link></div></div></section>
    </PageShell>
  );
}
