import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { BookIcon, CheckIcon, CubeIcon, DownloadIcon, GamepadIcon, GlobeIcon, RocketIcon, SearchIcon, UsersIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "ESB Studio & Game Creation Platform",
  description: "Explore ESB Studio, the game creation tools and creator ecosystem being developed for ESB Games, including scripting, publishing, discovery, analytics and collaboration.",
  keywords: ["ESB Studio", "game creation platform", "game development platform", "game creator tools", "create games", "creator platform", "ESB Games creators"],
  alternates: { canonical: "/developer-hub" },
  openGraph: { title: "ESB Studio & Game Creation Platform | ESB Games", description: "Build games and experiences with ESB Studio and the connected ESB Games creator ecosystem.", url: "/developer-hub", type: "website", images: [{ url: "/hero-studio-platform.png", alt: "ESB Studio game creation tools" }] },
  twitter: { card: "summary_large_image", title: "ESB Studio & Game Creation Platform | ESB Games", description: "Build games and experiences with ESB Studio and the connected ESB Games creator ecosystem.", images: ["/hero-studio-platform.png"] },
};

const creatorFeatures = [
  { icon: <CubeIcon />, title: "Approachable game development", text: "Build games and interactive experiences with reusable templates, live previews and deeper controls when a project needs them.", tone: "purple" },
  { icon: <RocketIcon />, title: "Connected publishing", text: "Publishing workflows are being designed to move projects from ESB Studio into ESB Games with clear checks, moderation and release controls.", tone: "blue" },
  { icon: <SearchIcon />, title: "Game discovery systems", text: "Creator profiles, groups, events and personalised discovery are being prepared to help players find new games and creators.", tone: "orange" },
  { icon: <GlobeIcon />, title: "Creator growth tools", text: "Planned analytics and release tools will help creators understand performance, improve experiences and prepare projects for wider audiences.", tone: "green" },
];

type CreatorResource = { title: string; text: string; icon: ReactNode; linkText?: string; href?: string; status?: string; external?: boolean; };

const resources: CreatorResource[] = [
  { title: "ESB Studio availability", text: "Follow public release availability and platform requirements as ESB Studio development progresses.", linkText: "View availability →", href: "/download", icon: <DownloadIcon /> },
  { title: "Game development documentation", text: "Official guides, tutorials and product walkthroughs will cover scripting, project creation, publishing and creator workflows as features stabilise.", linkText: "Open documentation →", href: "/documentation", icon: <BookIcon /> },
  { title: "Assets & templates", text: "Starter projects, interface kits and reusable creator resources are planned to help creators begin faster.", status: "Coming soon", icon: <CubeIcon /> },
  { title: "Developer API reference", text: "Platform, analytics and publishing APIs will be documented before public use.", status: "Coming soon", icon: <GlobeIcon /> },
  { title: "Creator roadmap", text: "A public roadmap will be introduced when creator milestones are ready to be shared.", status: "Planned", icon: <BookIcon /> },
  { title: "Creator community", text: "Follow creator communities through the main ESB Games platform as testing expands.", linkText: "Explore ESB Games →", href: "https://esbgames.com", icon: <UsersIcon />, external: true },
];

const collaborationAreas = [
  ["World & environment design", "3D modelling · Level design", "A planned collaboration area for creators seeking world-building and environment specialists."],
  ["Backend & multiplayer systems", "Engineering · Netcode", "A planned route for teams that need support with scalable systems, data and multiplayer architecture."],
  ["UI, VFX & animation", "Product design · Visual craft", "A planned directory for interfaces, effects, animation and player-facing polish."],
] as const;

export default function DeveloperHubPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ESB Studio",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Windows",
    description: "ESB Studio is the game creation environment being developed for creators publishing games and interactive experiences to ESB Games.",
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
            <p>ESB Studio is the game creation environment being developed for the ESB Games ecosystem, bringing scripting, world building, UI, animation, VFX, sound, testing and publishing workflows into one creator platform.</p>
            <div className="creator-hero-actions"><Link href="/download" className="button button-primary"><DownloadIcon size={17} /> ESB Studio Availability</Link><a href="#resources" className="button button-secondary"><BookIcon size={17} /> Creator Resources</a></div>
          </div>
          <div className="creator-code-window creator-workflow-window" aria-label="ESB Studio development workflow">
            <div className="creator-code-titlebar"><span className="creator-window-dots"><i /><i /><i /></span><span>ESB Studio · In development</span></div>
            <div className="creator-code-body creator-workflow-body"><p><strong>01</strong><span>Build</span><small>Create worlds, systems, interfaces and effects.</small></p><p><strong>02</strong><span>Test</span><small>Play-test and review projects before wider release.</small></p><p><strong>03</strong><span>Publish</span><small>Prepare experiences for the ESB Games platform.</small></p></div>
            <div className="creator-code-status"><CheckIcon size={16} /> Game creation workflow</div>
          </div>
        </div>
      </section>

      <section className="creator-stat-wrap"><div className="creator-stat-strip creator-proof-strip">
        <div><span><UsersIcon /></span><strong>ONE ECOSYSTEM</strong><small>Creation, publishing and player discovery</small></div>
        <div><span><GamepadIcon /></span><strong>GAME CREATION</strong><small>Tools for games, experiences and UGC</small></div>
        <div><span><GlobeIcon /></span><strong>CREATOR GROWTH</strong><small>Discovery, communities and planned analytics</small></div>
        <div><span><CubeIcon /></span><strong>IN DEVELOPMENT</strong><small>Public creator access is not available yet</small></div>
      </div></section>

      <section className="creator-section creator-feature-section"><div className="creator-container"><header className="creator-center-heading"><span className="eyebrow">A connected game creation platform</span><h2>From idea to playable <span className="gradient-text">experience.</span></h2><p>ESB Studio is being designed as a creator-focused development environment connected directly to the ESB Games discovery, community and publishing ecosystem.</p></header><div className="creator-feature-grid">{creatorFeatures.map((feature) => <article className="creator-feature-card" key={feature.title}><span className={`creator-icon creator-icon-${feature.tone}`}>{feature.icon}</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div></div></section>

      <section className="creator-section"><div className="creator-container"><header className="creator-center-heading"><span className="eyebrow">What creators can expect</span><h2>Creation tools built around the <span className="gradient-text">whole journey.</span></h2><p>Rather than separating game development from publishing and discovery, ESB Games is building a connected workflow. Creators will be able to develop experiences in ESB Studio, prepare them for release, publish to ESB Games and use platform systems designed to help audiences discover their work.</p></header><div className="creator-feature-grid"><article className="creator-feature-card"><h3>Scripting and game logic</h3><p>ESB Studio is being developed with Lua scripting support so creators can build gameplay systems, interactions and custom behaviour.</p></article><article className="creator-feature-card"><h3>Worlds, UI and effects</h3><p>Creation tools are being built for environments, interfaces, animation, VFX, audio and other parts of interactive game development.</p></article><article className="creator-feature-card"><h3>Testing and publishing</h3><p>Play-testing and release workflows are being designed to help creators move from development into moderated publication on ESB Games.</p></article><article className="creator-feature-card"><h3>Discovery and community</h3><p>Published experiences will connect with creator profiles, communities, events and personalised game discovery across ESB Games.</p></article></div></div></section>

      <section className="creator-section" id="resources"><div className="creator-container creator-resource-layout">
        <div><header className="creator-section-heading"><span className="eyebrow">Creator resources</span><h2>Game development <span className="gradient-text">resources.</span></h2></header><div className="creator-resource-grid">{resources.map((item) => <article className="creator-resource-card" key={item.title}><span className="creator-resource-icon">{item.icon}</span><div><h3>{item.title}</h3><p>{item.text}</p>{item.href ? (item.external ? <a href={item.href}>{item.linkText}</a> : <Link href={item.href}>{item.linkText}</Link>) : <span className="creator-planned-pill">{item.status}</span>}</div></article>)}</div></div>
        <aside className="creator-studio-directory"><header><span className="eyebrow">Planned collaboration</span><h2>Find specialist <span className="gradient-text">skills.</span></h2></header>{collaborationAreas.map(([title, meta, text]) => <article className="creator-studio-card" key={title}><div className="creator-studio-card-head"><h3>{title}</h3><span className="creator-planned-pill">Planned</span></div><strong><span>{meta}</span></strong><p>{text}</p></article>)}<Link href="/trust" className="creator-directory-link">Read creator trust &amp; safety information →</Link></aside>
      </div></section>

      <section className="creator-section" id="studio"><div className="creator-container"><article className="creator-studio-showcase"><div className="creator-studio-copy"><span className="eyebrow">ESB Studio · In development</span><h2>A game engine and creator environment for <span className="gradient-text">ESB Games.</span></h2><p>Scripting, animation, VFX, sound, UI, world building and project tools are being brought together in one creation environment designed around publishing to ESB Games.</p><div className="creator-platform-buttons"><Link href="/download" className="button button-primary">View ESB Studio availability</Link><Link href="/documentation" className="button button-secondary">Read creator documentation</Link></div><small>ESB Studio is in development. Public downloads are not available yet.</small></div><div className="creator-studio-image"><Image src="/hero-studio-platform.png" alt="ESB Studio game creation environment and creator tools" fill sizes="(max-width: 900px) 92vw, 620px" /></div></article></div></section>

      <section className="creator-section creator-final-section"><div className="creator-container"><div className="creator-final-cta"><div><span className="eyebrow">Build on ESB Games</span><h2>Follow the future of <span className="gradient-text">ESB Studio.</span></h2><p>Explore ESB Games and follow Studio availability as creator testing, publishing and discovery systems progress.</p></div><a href="https://esbgames.com" className="button button-primary"><RocketIcon size={17} /> Explore ESB Games</a></div></div></section>
    </PageShell>
  );
}
