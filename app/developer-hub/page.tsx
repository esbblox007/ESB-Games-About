import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { BookIcon, CheckIcon, CubeIcon, DownloadIcon, GamepadIcon, GlobeIcon, RocketIcon, SearchIcon, UsersIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Creator Hub",
  description: "Explore ESB Studio and the creator systems being developed for the ESB Games ecosystem.",
  alternates: { canonical: "/developer-hub" },
  openGraph: { title: "Creator Hub | ESB Games", description: "Explore ESB Studio and the creator systems being developed for ESB Games.", url: "/developer-hub", type: "website", images: [{ url: "/hero-studio-platform.png", alt: "ESB Studio creator tools" }] },
  twitter: { card: "summary_large_image", title: "Creator Hub | ESB Games", description: "Explore ESB Studio and the creator systems being developed for ESB Games.", images: ["/hero-studio-platform.png"] },
};

const creatorFeatures = [
  { icon: <CubeIcon />, title: "Approachable development", text: "Build with reusable templates, live previews and deeper controls when a project needs them.", tone: "purple" },
  { icon: <RocketIcon />, title: "Connected publishing", text: "Publishing workflows are being designed to move projects from Studio into the ESB Games ecosystem with clear checks and release controls.", tone: "blue" },
  { icon: <SearchIcon />, title: "Discovery systems", text: "Creator profiles, groups, events and personalised discovery are being prepared as connected platform features.", tone: "orange" },
  { icon: <GlobeIcon />, title: "Grow your work", text: "Planned analytics and release tools will help creators understand performance and prepare experiences for wider audiences.", tone: "green" },
];

const resources = [
  { title: "ESB Studio availability", text: "Follow public release availability and platform requirements as Studio development progresses.", linkText: "View availability →", href: "/download", icon: <DownloadIcon /> },
  { title: "Documentation", text: "Official guides, tutorials and product walkthroughs will be published as features stabilise.", linkText: "Open documentation →", href: "/documentation", icon: <BookIcon /> },
  { title: "Assets & templates", text: "Starter projects, interface kits and reusable creator resources are planned.", status: "Coming soon", icon: <CubeIcon /> },
  { title: "API reference", text: "Platform, analytics and publishing APIs will be documented before public use.", status: "Coming soon", icon: <GlobeIcon /> },
  { title: "Creator roadmap", text: "A public roadmap will be introduced when creator milestones are ready to be shared.", status: "Planned", icon: <BookIcon /> },
  { title: "Creator community", text: "Follow community access through the main ESB Games platform as testing expands.", linkText: "Explore ESB Games →", href: "https://esbgames.com", icon: <UsersIcon />, external: true },
] as const;

const collaborationAreas = [
  ["World & environment design", "3D modelling · Level design", "A planned collaboration area for creators seeking world-building and environment specialists."],
  ["Backend & multiplayer systems", "Engineering · Netcode", "A planned route for teams that need support with scalable systems, data and multiplayer architecture."],
  ["UI, VFX & animation", "Product design · Visual craft", "A planned directory for interfaces, effects, animation and player-facing polish."],
] as const;

export default function DeveloperHubPage() {
  return (
    <PageShell>
      <section className="creator-hero">
        <div className="creator-hero-inner">
          <div className="creator-hero-copy">
            <span className="eyebrow">ESB Games Creator Hub</span>
            <h1>Build it.<br /><span className="gradient-text">Prepare it.</span><br />Grow it.</h1>
            <p>Build games in ESB Studio and manage projects through the connected creator ecosystem being developed for ESB Games.</p>
            <div className="creator-hero-actions"><Link href="/download" className="button button-primary"><DownloadIcon size={17} /> Download & Availability</Link><a href="#resources" className="button button-secondary"><BookIcon size={17} /> Explore Resources</a></div>
          </div>
          <div className="creator-code-window creator-workflow-window" aria-label="ESB Studio development workflow">
            <div className="creator-code-titlebar"><span className="creator-window-dots"><i /><i /><i /></span><span>ESB Studio · In development</span></div>
            <div className="creator-code-body creator-workflow-body"><p><strong>01</strong><span>Build</span><small>Create worlds, systems, interfaces and effects.</small></p><p><strong>02</strong><span>Test</span><small>Review projects before wider release.</small></p><p><strong>03</strong><span>Prepare</span><small>Publishing and moderation workflows are being developed.</small></p></div>
            <div className="creator-code-status"><CheckIcon size={16} /> Development workflow</div>
          </div>
        </div>
      </section>

      <section className="creator-stat-wrap"><div className="creator-stat-strip creator-proof-strip">
        <div><span><UsersIcon /></span><strong>ONE ECOSYSTEM</strong><small>Shared creator and platform direction</small></div>
        <div><span><GamepadIcon /></span><strong>CREATOR-FIRST</strong><small>Tools for games, experiences and UGC</small></div>
        <div><span><GlobeIcon /></span><strong>GLOBAL BY DESIGN</strong><small>Built for communities across regions</small></div>
        <div><span><CubeIcon /></span><strong>IN DEVELOPMENT</strong><small>Publishing and monetisation are not public yet</small></div>
      </div></section>

      <section className="creator-section creator-feature-section"><div className="creator-container"><header className="creator-center-heading"><span className="eyebrow">Creator-first by design</span><h2>Built for creators, not <span className="gradient-text">gatekeepers.</span></h2><p>Tools, publishing and growth systems are being designed to help strong ideas move forward.</p></header><div className="creator-feature-grid">{creatorFeatures.map((feature) => <article className="creator-feature-card" key={feature.title}><span className={`creator-icon creator-icon-${feature.tone}`}>{feature.icon}</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div></div></section>

      <section className="creator-section" id="resources"><div className="creator-container creator-resource-layout">
        <div><header className="creator-section-heading"><span className="eyebrow">Everything in one place</span><h2>Creator <span className="gradient-text">resources.</span></h2></header><div className="creator-resource-grid">{resources.map((item) => <article className="creator-resource-card" key={item.title}><span className="creator-resource-icon">{item.icon}</span><div><h3>{item.title}</h3><p>{item.text}</p>{item.href ? (item.external ? <a href={item.href}>{item.linkText}</a> : <Link href={item.href}>{item.linkText}</Link>) : <span className="creator-planned-pill">{item.status}</span>}</div></article>)}</div></div>
        <aside className="creator-studio-directory"><header><span className="eyebrow">Planned collaboration</span><h2>Find specialist <span className="gradient-text">skills.</span></h2></header>{collaborationAreas.map(([title, meta, text]) => <article className="creator-studio-card" key={title}><div className="creator-studio-card-head"><h3>{title}</h3><span className="creator-planned-pill">Planned</span></div><strong><span>{meta}</span></strong><p>{text}</p></article>)}<Link href="/trust" className="creator-directory-link">Read creator trust &amp; safety information →</Link></aside>
      </div></section>

      <section className="creator-section" id="studio"><div className="creator-container"><article className="creator-studio-showcase"><div className="creator-studio-copy"><span className="eyebrow">ESB Studio · In development</span><h2>Worlds without <span className="gradient-text">limits.</span></h2><p>Scripting, animation, VFX, sound, UI and project tools are being brought together in one creation environment.</p><div className="creator-platform-buttons"><Link href="/download" className="button button-primary">View ESB Studio availability</Link></div><small>ESB Studio is in development. Public downloads are not available yet.</small></div><div className="creator-studio-image"><Image src="/hero-studio-platform.png" alt="ESB Studio creation tools" fill sizes="(max-width: 900px) 92vw, 620px" /></div></article></div></section>

      <section className="creator-section creator-final-section"><div className="creator-container"><div className="creator-final-cta"><div><span className="eyebrow">Creator future</span><h2>Ready to build the next big <span className="gradient-text">world?</span></h2><p>Follow ESB Studio availability as creator testing, publishing and discovery systems progress.</p></div><a href="https://esbgames.com" className="button button-primary"><RocketIcon size={17} /> Explore ESB Games</a></div></div></section>
    </PageShell>
  );
}
