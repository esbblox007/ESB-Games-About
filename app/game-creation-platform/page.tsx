import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { BookIcon, CubeIcon, GamepadIcon, GlobeIcon, RocketIcon, ShieldIcon, UsersIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Game Creation Platform for Creators",
  description: "ESB Studio is the ESB Games game creation platform for Lua scripting, world building, assets, animation, testing, publishing and player discovery.",
  keywords: ["game creation platform", "game development platform", "create games", "game creator tools", "ESB Studio", "ESB Games creator platform"],
  alternates: { canonical: "/game-creation-platform" },
  openGraph: {
    title: "Game Creation Platform for Creators | ESB Games",
    description: "Build and publish user-generated games with ESB Studio, then connect experiences to ESB Games browser play, communities and discovery.",
    url: "/game-creation-platform",
    type: "website",
    images: [{ url: "/og-preview", alt: "ESB Studio game creation platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Creation Platform for Creators | ESB Games",
    description: "Build and publish user-generated games with ESB Studio, then connect experiences to ESB Games browser play, communities and discovery.",
    images: ["/og-preview"],
  },
};

const stages = [
  { icon: <CubeIcon />, title: "Create", text: "Build worlds, gameplay systems, interfaces, animation, effects and audio inside ESB Studio." },
  { icon: <GamepadIcon />, title: "Test", text: "Play-test experiences and review how projects behave before preparing them for release." },
  { icon: <ShieldIcon />, title: "Prepare", text: "Connect games to ESB Games through publishing, review and moderation workflows." },
  { icon: <GlobeIcon />, title: "Publish & discover", text: "Published games connect with ESB Games discovery, creator profiles, communities and events." },
];

export default function GameCreationPlatformPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Game Creation Platform for Creators",
    description: "ESB Studio brings Lua-based scripting, world building, assets and game publishing into the ESB Games user-generated content ecosystem.",
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
            <p>ESB Studio connects game creation, scripting and world building with ESB Games publishing, discovery, communities and browser-based game experiences.</p>
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
            <p>A game creation platform is most useful when development tools connect naturally to the places where players actually discover and play experiences. ESB Games connects that entire creator journey.</p>
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
            <p>ESB Studio is the game development environment for creating user-generated experiences on ESB Games. Its tools cover Lua scripting, world building, interfaces, animation, VFX, audio, project management and play-testing.</p>
          </header>
          <div className="creator-feature-grid">
            <article className="creator-feature-card"><h3>Lua scripting</h3><p>Lua-based scripting lets creators develop custom game logic, systems and interactive gameplay.</p></article>
            <article className="creator-feature-card"><h3>Visual creation tools</h3><p>World building, UI, effects, animation and audio tools bring key parts of game production into one creator environment.</p></article>
            <article className="creator-feature-card"><h3>Connected publishing</h3><p>Studio's publishing workflow connects creator projects with the wider ESB Games platform.</p></article>
            <article className="creator-feature-card"><h3>Player discovery</h3><p>Creator profiles, ESB Groups, events and game discovery connect published experiences with players.</p></article>
          </div>
        </div>
      </section>

      <section className="creator-section">
        <div className="creator-container creator-resource-layout">
          <div>
            <header className="creator-section-heading"><span className="eyebrow">Built for creators and players</span><h2>One <span className="gradient-text">ecosystem.</span></h2></header>
            <p>ESB Games is not positioning creation as a separate product bolted onto a gaming site. The platform connects game creation, ESB Groups, events, player discovery and Trust & Safety.</p>
            <p>A creator's journey connects building, testing, publishing, growing a community and understanding player engagement.</p>
          </div>
          <aside className="creator-studio-directory">
            <header><span className="eyebrow">Product status</span><h2>In <span className="gradient-text">pre-launch.</span></h2></header>
            <p>ESB Games is in pre-launch, undergoing final development and Quality Assurance testing. This page explains how ESB Studio connects to the wider creator ecosystem.</p>
            <Link href="/download" className="creator-directory-link">Check ESB Studio availability →</Link>
          </aside>
        </div>
      </section>

      <section className="creator-section creator-final-section"><div className="creator-container"><div className="creator-final-cta"><div><span className="eyebrow">Creator ecosystem</span><h2>Explore the tools behind <span className="gradient-text">ESB Games.</span></h2><p>Visit the Creator Hub for ESB Studio tools, documentation and game publishing information.</p></div><Link href="/developer-hub" className="button button-primary"><UsersIcon size={17} /> Open Creator Hub</Link></div></div></section>
    </PageShell>
  );
}
