import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { BookIcon, CheckIcon, CubeIcon, DownloadIcon, GamepadIcon, GlobeIcon, RocketIcon, SearchIcon, UsersIcon } from "@/components/Icons";
import { siteMetrics } from "@/lib/content/siteMetrics";

export const metadata: Metadata = {
  title: "Creator Hub",
  description: "Explore ESB Studio and the creator systems being developed for the ESB Games ecosystem.",
};

const creatorFeatures = [
  { icon: <CubeIcon />, title: "Approachable development", text: "Build with reusable templates, live previews and deeper controls when a project needs them.", tone: "purple" },
  { icon: <RocketIcon />, title: "Connected publishing", text: "Publishing workflows are being designed to move projects from Studio into the ESB Games ecosystem with clear checks and release controls.", tone: "blue" },
  { icon: <SearchIcon />, title: "Discovery systems", text: "Creator profiles, groups, events and personalised discovery are being prepared as connected platform features.", tone: "orange" },
  { icon: <GlobeIcon />, title: "Grow your work", text: "Planned analytics and release tools will help creators understand performance and prepare experiences for wider audiences.", tone: "green" },
];

const resources = [
  ["Download ESB Studio", "Official release availability and platform requirements.", "View downloads →", "/download"],
  ["Documentation", "Guides, tutorials and product walkthroughs will be published as features stabilise.", "See development status →", "/news"],
  ["Assets & templates", "Starter projects, interface kits and reusable creator resources are planned.", "Learn more →", "#studio"],
  ["API reference", "Platform, analytics and publishing APIs will be documented before public use.", "Planned resource →", "#studio"],
  ["Creator roadmap", "Follow what is being designed, tested and prepared for creators.", "View updates →", "/news"],
  ["Creator community", "Connect through the main ESB Games platform as community access opens.", "Create an account →", "https://esbgames.com/sign-up"],
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
            <h1>Create it.<br /><span className="gradient-text">Launch it.</span><br />Grow it.</h1>
            <p>Build games in ESB Studio and manage projects through the connected creator ecosystem being developed for ESB Games.</p>
            <div className="creator-hero-actions"><Link href="/download" className="button button-primary"><DownloadIcon size={17} /> Download & Availability</Link><a href="#resources" className="button button-secondary"><BookIcon size={17} /> Explore Resources</a></div>
          </div>

          <div className="creator-code-window" aria-label="Illustrative ESB Studio publishing concept">
            <div className="creator-code-titlebar"><span className="creator-window-dots"><i /><i /><i /></span><span>Illustrative workflow · ESB Studio</span></div>
            <div className="creator-code-body"><p><span className="code-purple">local</span> game = ESB.<strong>CreateGame</strong>(<span className="code-yellow">&quot;Neon City&quot;</span>)</p><p>game:<strong>PreparePublish</strong>()</p><p><strong>print</strong>(<span className="code-yellow">&quot;Ready for review&quot;</span>)</p></div>
            <div className="creator-code-status"><CheckIcon size={16} /> Concept example — final API may change</div>
          </div>
        </div>
      </section>

      <section className="creator-stat-wrap"><div className="creator-stat-strip">
        <div><span><UsersIcon /></span><strong>{siteMetrics.universalAccounts}</strong><small>UNIVERSAL ACCOUNT</small></div>
        <div><span><GamepadIcon /></span><strong>{siteMetrics.corePlatformAreas}+</strong><small>PLATFORM AREAS</small></div>
        <div><span><GlobeIcon /></span><strong>{siteMetrics.plannedDesktopPlatforms}</strong><small>DESKTOP PLATFORMS PLANNED</small></div>
        <div><span><CubeIcon /></span><strong>{siteMetrics.plannedCreatorShare}%</strong><small>PLANNED CREATOR SHARE</small></div>
      </div></section>

      <section className="creator-section creator-feature-section"><div className="creator-container"><header className="creator-center-heading"><span className="eyebrow">Creator-first by design</span><h2>Built for creators, not <span className="gradient-text">gatekeepers.</span></h2><p>Tools, publishing and growth systems are being designed to help strong ideas move forward.</p></header><div className="creator-feature-grid">{creatorFeatures.map((feature) => <article className="creator-feature-card" key={feature.title}><span className={`creator-icon creator-icon-${feature.tone}`}>{feature.icon}</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div></div></section>

      <section className="creator-section" id="resources"><div className="creator-container creator-resource-layout">
        <div><header className="creator-section-heading"><span className="eyebrow">Everything in one place</span><h2>Creator <span className="gradient-text">resources.</span></h2></header><div className="creator-resource-grid">{resources.map(([title, text, linkText, href], index) => <article className="creator-resource-card" key={title}><span className="creator-resource-icon">{index === 0 ? <DownloadIcon /> : index === 1 ? <BookIcon /> : index === 2 ? <CubeIcon /> : index === 3 ? <GlobeIcon /> : index === 4 ? <BookIcon /> : <UsersIcon />}</span><div><h3>{title}</h3><p>{text}</p><Link href={href}>{linkText}</Link></div></article>)}</div></div>
        <aside className="creator-studio-directory"><header><span className="eyebrow">Planned collaboration</span><h2>Find specialist <span className="gradient-text">skills.</span></h2></header>{collaborationAreas.map(([title, meta, text]) => <article className="creator-studio-card" key={title}><div className="creator-studio-card-head"><h3>{title}</h3><span className="creator-planned-pill">Planned</span></div><strong><span>{meta}</span></strong><p>{text}</p></article>)}<a href="https://esbgames.com/sign-up" className="creator-directory-link">Create an ESB Games account →</a></aside>
      </div></section>

      <section className="creator-section" id="studio"><div className="creator-container"><article className="creator-studio-showcase"><div className="creator-studio-copy"><span className="eyebrow">ESB Studio · Product preview</span><h2>Worlds without <span className="gradient-text">limits.</span></h2><p>Scripting, animation, VFX, sound, UI and project tools are being brought together in one creation environment.</p><div className="creator-platform-buttons"><Link href="/download" className="button button-primary">Windows</Link><Link href="/download" className="button button-secondary">macOS</Link><Link href="/download" className="button button-secondary">Linux</Link></div><small>Planned platform support. Final availability will be confirmed on the Downloads page.</small></div><div className="creator-studio-image"><Image src="/hero-studio-preview.png" alt="Product preview of ESB Studio creation tools" fill sizes="(max-width: 900px) 92vw, 620px" /></div></article></div></section>

      <section className="creator-section creator-final-section"><div className="creator-container"><div className="creator-final-cta"><div><span className="eyebrow">Start creating</span><h2>Ready to build the next big <span className="gradient-text">world?</span></h2><p>Create an ESB Games account and follow Studio availability as testing progresses.</p></div><a href="https://esbgames.com/sign-up" className="button button-primary"><RocketIcon size={17} /> Create an account</a></div></div></section>
    </PageShell>
  );
}
