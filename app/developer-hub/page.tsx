import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import {
  BookIcon,
  CheckIcon,
  CubeIcon,
  DownloadIcon,
  GamepadIcon,
  GlobeIcon,
  RocketIcon,
  SearchIcon,
  UsersIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Creator Hub",
  description: "Build, publish and grow games with ESB Studio and the ESB Games creator ecosystem.",
};

const creatorFeatures = [
  {
    icon: <CubeIcon />,
    title: "Effortless development",
    text: "Build faster with approachable tools, reusable templates, live preview workflows and advanced controls when you need them.",
    tone: "purple",
  },
  {
    icon: <RocketIcon />,
    title: "Publish instantly",
    text: "Move from your project to a live experience through one connected publishing workflow, without unnecessary friction.",
    tone: "blue",
  },
  {
    icon: <SearchIcon />,
    title: "Built-in discovery",
    text: "Reach players through personalised discovery, creator profiles, groups, events and platform-wide recommendations.",
    tone: "orange",
  },
  {
    icon: <GlobeIcon />,
    title: "Grow your work",
    text: "Manage releases, analyse performance and prepare your experiences for audiences around the world.",
    tone: "green",
  },
];

const resources = [
  ["Download ESB Studio", "The official creation environment and current release availability.", "View downloads →", "/download"],
  ["Documentation", "Guides, tutorials, product walkthroughs and future API documentation.", "Read docs →", "#studio"],
  ["Assets & templates", "Starter projects, UI kits, environments, effects and reusable creator resources.", "Browse →", "#resources"],
  ["API reference", "A future home for platform services, analytics, publishing and team APIs.", "View API →", "#resources"],
  ["Creator roadmap", "See what is being designed, tested and prepared for the ESB creator ecosystem.", "View roadmap →", "/news"],
  ["Creator community", "Connect with developers, artists, designers and collaborators across ESB Games.", "Join community →", "https://esbgames.com/login"],
] as const;

const studioServices = [
  ["World & environment design", "3D modelling · Level design", "Find teams for polished worlds, environments and immersive level design."],
  ["Backend & multiplayer systems", "Engineering · Netcode", "Connect with specialists for scalable game systems, data and multiplayer architecture."],
  ["UI, VFX & animation", "Product design · Visual craft", "Find creative specialists for interfaces, effects, animation and player-facing polish."],
] as const;

export default function DeveloperHubPage() {
  return (
    <PageShell>
      <section className="creator-hero">
        <div className="creator-hero-inner">
          <div className="creator-hero-copy">
            <span className="eyebrow">ESB Games Creator Hub</span>
            <h1>Create it.<br /><span className="gradient-text">Launch it.</span><br />Grow it.</h1>
            <p>
              Build games in ESB Studio, publish them to players and manage every stage of your project through one connected creator ecosystem.
            </p>
            <div className="creator-hero-actions">
              <Link href="/download" className="button button-primary"><DownloadIcon size={17} /> Download & Availability</Link>
              <a href="#resources" className="button button-secondary"><BookIcon size={17} /> Explore Resources</a>
            </div>
          </div>

          <div className="creator-code-window" aria-label="Example ESB Studio publish workflow">
            <div className="creator-code-titlebar">
              <span className="creator-window-dots"><i /><i /><i /></span>
              <span>main.esb · ESB Studio</span>
            </div>
            <div className="creator-code-body">
              <p><span className="code-purple">local</span> game = ESB.<strong>CreateGame</strong>(<span className="code-yellow">&quot;Neon City&quot;</span>)</p>
              <p>game:<strong>Publish</strong>()</p>
              <p><strong>print</strong>(<span className="code-yellow">&quot;Game published!&quot;</span>)</p>
            </div>
            <div className="creator-code-status"><CheckIcon size={16} /> Project ready for publishing</div>
          </div>
        </div>
      </section>

      <section className="creator-stat-wrap">
        <div className="creator-stat-strip">
          <div><span><UsersIcon /></span><strong>1M+</strong><small>CREATOR VISION</small></div>
          <div><span><GamepadIcon /></span><strong>20K+</strong><small>GAMES TARGETED</small></div>
          <div><span><GlobeIcon /></span><strong>150+</strong><small>COUNTRIES</small></div>
          <div><span><CubeIcon /></span><strong>70/30</strong><small>PLANNED SPLIT</small></div>
        </div>
      </section>

      <section className="creator-section creator-feature-section">
        <div className="creator-container">
          <header className="creator-center-heading">
            <span className="eyebrow">Creator-first by design</span>
            <h2>Built for creators, not <span className="gradient-text">gatekeepers.</span></h2>
            <p>Tools, publishing and growth systems designed to help good ideas move forward.</p>
          </header>
          <div className="creator-feature-grid">
            {creatorFeatures.map((feature) => (
              <article className="creator-feature-card" key={feature.title}>
                <span className={`creator-icon creator-icon-${feature.tone}`}>{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="creator-section" id="resources">
        <div className="creator-container creator-resource-layout">
          <div>
            <header className="creator-section-heading">
              <span className="eyebrow">Everything in one place</span>
              <h2>Creator <span className="gradient-text">resources.</span></h2>
            </header>
            <div className="creator-resource-grid">
              {resources.map(([title, text, linkText, href], index) => (
                <article className="creator-resource-card" key={title}>
                  <span className="creator-resource-icon">{index === 0 ? <DownloadIcon /> : index === 1 ? <BookIcon /> : index === 2 ? <CubeIcon /> : index === 3 ? <GlobeIcon /> : index === 4 ? <BookIcon /> : <UsersIcon />}</span>
                  <div><h3>{title}</h3><p>{text}</p><Link href={href}>{linkText}</Link></div>
                </article>
              ))}
            </div>
          </div>

          <aside className="creator-studio-directory">
            <header><span className="eyebrow">Collaboration</span><h2>Find specialist <span className="gradient-text">studios.</span></h2></header>
            {studioServices.map(([title, meta, text]) => (
              <article className="creator-studio-card" key={title}>
                <div className="creator-studio-card-head"><h3>{title}</h3><a href="https://esbgames.com/login">Connect</a></div>
                <strong>★ 4.9 <span>{meta}</span></strong>
                <p>{text}</p>
              </article>
            ))}
            <a href="https://esbgames.com/login" className="creator-directory-link">Explore the creator community →</a>
          </aside>
        </div>
      </section>

      <section className="creator-section" id="studio">
        <div className="creator-container">
          <article className="creator-studio-showcase">
            <div className="creator-studio-copy">
              <span className="eyebrow">ESB Studio</span>
              <h2>Worlds without <span className="gradient-text">limits.</span></h2>
              <p>Bring scripting, animation, VFX, sound, UI and collaborative editing into one creation environment.</p>
              <div className="creator-platform-buttons">
                <Link href="/early-access?type=creator" className="button button-primary">Windows</Link>
                <Link href="/early-access?type=creator" className="button button-secondary">macOS</Link>
                <Link href="/early-access?type=creator" className="button button-secondary">Linux</Link>
              </div>
              <small>Pre-release access · availability will be announced before launch</small>
            </div>
            <div className="creator-studio-image">
              <Image src="/hero-studio-preview.png" alt="ESB Studio VFX and creation tools" fill sizes="(max-width: 900px) 92vw, 620px" />
            </div>
          </article>
        </div>
      </section>

      <section className="creator-section creator-final-section">
        <div className="creator-container">
          <div className="creator-final-cta">
            <div><span className="eyebrow">Start creating</span><h2>Ready to build the next big <span className="gradient-text">world?</span></h2><p>Join the creator waitlist and be among the first to test ESB Studio.</p></div>
            <Link href="/early-access?type=creator" className="button button-primary"><RocketIcon size={17} /> Apply for creator access</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
