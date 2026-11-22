import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { BookIcon, CheckIcon, CubeIcon, DownloadIcon, GamepadIcon, GlobeIcon, RocketIcon, SearchIcon, UsersIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "ESB Studio & Game Creation Platform",
  description: "Explore ESB Studio: build and publish user-generated games with Lua scripting, world building, assets, collaboration and creator tools connected to ESB Games.",
  keywords: ["ESB Studio", "game creation platform", "game development platform", "game creator tools", "create games", "creator platform", "ESB Games creators"],
  alternates: { canonical: "/developer-hub" },
  openGraph: { title: "ESB Studio & Game Creation Platform | ESB Games", description: "ESB Studio connects game creation, Lua scripting, assets, collaboration and publishing with ESB Games browser play and discovery.", url: "/developer-hub", type: "website", images: [{ url: "/og-preview", alt: "ESB Studio game creation tools" }] },
  twitter: { card: "summary_large_image", title: "ESB Studio & Game Creation Platform | ESB Games", description: "ESB Studio connects game creation, Lua scripting, assets, collaboration and publishing with ESB Games browser play and discovery.", images: ["/og-preview"] },
};

const creatorFeatures = [
  { icon: <CubeIcon />, title: "Approachable game development", text: "Build games and interactive experiences with reusable templates, live previews and deeper controls when a project needs them.", tone: "purple" },
  { icon: <RocketIcon />, title: "Connected publishing", text: "Connect projects from ESB Studio to ESB Games through game publishing, review and moderation workflows.", tone: "blue" },
  { icon: <SearchIcon />, title: "Game discovery systems", text: "ESB Games connects published experiences with creator profiles, ESB Groups, events and game discovery.", tone: "orange" },
  { icon: <GlobeIcon />, title: "Creator growth tools", text: "Creator analytics and publishing tools are designed to help developers understand their games and manage releases.", tone: "green" },
];

type CreatorResource = { title: string; text: string; icon: ReactNode; linkText?: string; href?: string; status?: string; external?: boolean; };

const resources: CreatorResource[] = [
  { title: "ESB Studio availability", text: "Find official download information and access options for ESB Studio.", linkText: "View availability →", href: "/download", icon: <DownloadIcon /> },
  { title: "Game development documentation", text: "Explore official guides about scripting, projects, creation tools and publishing workflows.", linkText: "Open documentation →", href: "/documentation", icon: <BookIcon /> },
  { title: "Assets & templates", text: "Reusable assets, templates and starter resources help creators organise game development.", status: "Creator resources", icon: <CubeIcon /> },
  { title: "Developer API reference", text: "Find information about creator integrations, publishing concepts and platform services.", status: "Creator resources", icon: <GlobeIcon /> },
  { title: "Creator workflows", text: "Learn how creators can plan projects, test experiences, manage assets and prepare games for publication.", status: "Creator guidance", icon: <BookIcon /> },
  { title: "Creator community", text: "Explore game creators and communities through the main ESB Games platform.", linkText: "Explore ESB Games →", href: "https://esbgames.com", icon: <UsersIcon />, external: true },
];

const collaborationAreas = [
  ["World & environment design", "3D modelling · Level design", "Game development collaboration can bring together world builders and environment designers."],
  ["Backend & multiplayer systems", "Engineering · Netcode", "Game projects may involve scripting, backend engineering and multiplayer specialists."],
  ["UI, VFX & animation", "Product design · Visual craft", "Game development benefits from UI, VFX, animation and visual design specialists."],
] as const;

export default function DeveloperHubPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ESB Studio",
    applicationCategory: "DeveloperApplication",
    description: "ESB Studio is the game creation environment for scripting, world building, animation, assets, collaboration and publishing user-generated games to ESB Games.",
    url: "https://about.esbgames.com/developer-hub",
    publisher: { "@type": "Organization", name: "ESB Games", url: "https://esbgames.com" },
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <section className="creator-hero">
        <div className="creator-hero-inner">
          <div className="creator-hero-copy">
            <span className="eyebrow">ESB Games Creator Hub</span>
            <h1>Build games with<br /><span className="gradient-text">ESB Studio.</span></h1>
            <p>ESB Studio brings game scripting, world building, UI, animation, VFX, audio, project tools and publishing together in a creation environment connected to ESB Games.</p>
            <div className="creator-hero-actions"><Link href="/download" className="button button-primary"><DownloadIcon size={17} /> ESB Studio Availability</Link><a href="#resources" className="button button-secondary"><BookIcon size={17} /> Creator Resources</a></div>
          </div>
          <div className="creator-code-window creator-workflow-window" aria-label="ESB Studio development workflow">
            <div className="creator-code-titlebar"><span className="creator-window-dots"><i /><i /><i /></span><span>ESB Studio · Game creation</span></div>
            <div className="creator-code-body creator-workflow-body"><p><strong>01</strong><span>Build</span><small>Create worlds, systems, interfaces and effects.</small></p><p><strong>02</strong><span>Test</span><small>Play-test and review projects before wider release.</small></p><p><strong>03</strong><span>Publish</span><small>Prepare experiences for the ESB Games platform.</small></p></div>
            <div className="creator-code-status"><CheckIcon size={16} /> Game creation workflow</div>
          </div>
        </div>
      </section>

      <section className="creator-stat-wrap"><div className="creator-stat-strip creator-proof-strip">
        <div><span><UsersIcon /></span><strong>ONE ECOSYSTEM</strong><small>Creation, publishing and player discovery</small></div>
        <div><span><GamepadIcon /></span><strong>GAME CREATION</strong><small>Tools for games, experiences and UGC</small></div>
        <div><span><GlobeIcon /></span><strong>CREATOR GROWTH</strong><small>Discovery, communities and analytics</small></div>
        <div><span><CubeIcon /></span><strong>PRE-LAUNCH</strong><small>Final development and Quality Assurance testing</small></div>
      </div></section>

      <section className="creator-section creator-feature-section"><div className="creator-container"><header className="creator-center-heading"><span className="eyebrow">A connected game creation platform</span><h2>From idea to playable <span className="gradient-text">experience.</span></h2><p>ESB Studio is a creator-focused game development environment connected to ESB Games discovery, communities and publishing.</p></header><div className="creator-feature-grid">{creatorFeatures.map((feature) => <article className="creator-feature-card" key={feature.title}><span className={`creator-icon creator-icon-${feature.tone}`}>{feature.icon}</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div></div></section>

      <section className="creator-section"><div className="creator-container"><header className="creator-center-heading"><span className="eyebrow">What creators can expect</span><h2>Creation tools built around the <span className="gradient-text">whole journey.</span></h2><p>ESB Studio connects game creation with the wider ESB Games ecosystem. Creators can work with scripting, building and project tools, then use publishing, discovery and community services around their experiences.</p></header><div className="creator-feature-grid"><article className="creator-feature-card"><h3>Scripting and game logic</h3><p>Lua-based scripting supports custom game logic, gameplay systems, interactions and behaviour within creator projects.</p></article><article className="creator-feature-card"><h3>Worlds, UI and effects</h3><p>World building, UI, animation, VFX, sound and asset tools support the creation of interactive experiences.</p></article><article className="creator-feature-card"><h3>Testing and publishing</h3><p>Play-testing, publishing and moderation workflows connect a creator's project with ESB Games.</p></article><article className="creator-feature-card"><h3>Discovery and community</h3><p>Creator profiles, ESB Groups, events and game discovery help connect published experiences with players.</p></article></div></div></section>

      <section className="creator-section" id="resources"><div className="creator-container creator-resource-layout">
        <div><header className="creator-section-heading"><span className="eyebrow">Creator resources</span><h2>Game development <span className="gradient-text">resources.</span></h2></header><div className="creator-resource-grid">{resources.map((item) => <article className="creator-resource-card" key={item.title}><span className="creator-resource-icon">{item.icon}</span><div><h3>{item.title}</h3><p>{item.text}</p>{item.href ? (item.external ? <a href={item.href}>{item.linkText}</a> : <Link href={item.href}>{item.linkText}</Link>) : <span className="creator-planned-pill">{item.status}</span>}</div></article>)}</div></div>
        <aside className="creator-studio-directory"><header><span className="eyebrow">Creator collaboration</span><h2>Find specialist <span className="gradient-text">skills.</span></h2></header>{collaborationAreas.map(([title, meta, text]) => <article className="creator-studio-card" key={title}><div className="creator-studio-card-head"><h3>{title}</h3><span className="creator-planned-pill">Creator roles</span></div><strong><span>{meta}</span></strong><p>{text}</p></article>)}<Link href="/trust" className="creator-directory-link">Read creator trust &amp; safety information →</Link></aside>
      </div></section>

      <section className="creator-section" id="studio"><div className="creator-container"><article className="creator-studio-showcase"><div className="creator-studio-copy"><span className="eyebrow">ESB Studio · Game creation</span><h2>A game engine and creator environment for <span className="gradient-text">ESB Games.</span></h2><p>ESB Studio combines scripting, animation, VFX, sound, UI, world building and project tools with a publishing connection to ESB Games.</p><div className="creator-platform-buttons"><Link href="/download" className="button button-primary">View ESB Studio availability</Link><Link href="/documentation" className="button button-secondary">Read creator documentation</Link></div><small>ESB Games is in pre-launch, undergoing final development and Quality Assurance testing.</small></div><div className="creator-studio-image"><Image src="/hero-studio-platform.png" alt="ESB Studio game creation environment and creator tools" fill sizes="(max-width: 900px) 92vw, 620px" /></div></article></div></section>

      <section className="creator-section creator-final-section"><div className="creator-container"><div className="creator-final-cta"><div><span className="eyebrow">Build on ESB Games</span><h2>Follow the future of <span className="gradient-text">ESB Studio.</span></h2><p>Explore the ESB Games ecosystem and learn how Studio connects creation, publishing, play and community.</p></div><a href="https://esbgames.com" className="button button-primary"><RocketIcon size={17} /> Explore ESB Games</a></div></div></section>
    </PageShell>
  );
}
