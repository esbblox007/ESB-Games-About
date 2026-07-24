import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import {
  BookIcon,
  CubeIcon,
  GamepadIcon,
  GlobeIcon,
  RocketIcon,
  SearchIcon,
  ShieldIcon,
  TicketIcon,
  UsersIcon,
} from "@/components/Icons";

export const metadata: Metadata = { title: "Play. Create. Connect." };

function SparklesIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2.5 13.7 8l5.6 1.7-5.6 1.7L12 17l-1.7-5.6-5.6-1.7L10.3 8 12 2.5Z" fill="currentColor"/>
      <path d="m18.5 14 .9 2.7 2.6.8-2.6.8-.9 2.7-.8-2.7-2.7-.8 2.7-.8.8-2.7ZM5.5 15l.7 2.1 2.1.7-2.1.6-.7 2.1-.6-2.1-2.1-.6 2.1-.7.6-2.1Z" fill="currentColor" opacity=".9"/>
    </svg>
  );
}

function BoltIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13.6 2 5 13h6l-.8 9L19 10h-6l.6-8Z" fill="currentColor"/>
    </svg>
  );
}

function CodeIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function InfinityIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8.2 7.5c-2.7 0-4.7 2-4.7 4.5s2 4.5 4.7 4.5c3.8 0 5.5-9 9.5-9 2.7 0 4.8 2 4.8 4.5s-2.1 4.5-4.8 4.5c-4 0-5.7-9-9.5-9Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}

function HeadsetIcon({ size = 21 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 13v-1a8 8 0 0 1 16 0v1M5 13h2.2v6H5.8A1.8 1.8 0 0 1 4 17.2V14a1 1 0 0 1 1-1Zm14 0h-2.2v6H18a2 2 0 0 0 2-2v-3a1 1 0 0 0-1-1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.8 19c-.5 1.5-1.8 2-3.8 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function UserPlusIcon({ size = 21 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" fill="currentColor"/>
      <path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6H3ZM18 8v6M15 11h6" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function MailIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const proofItems = [
  "Forbes 30 Under 30",
  "1M Creators Onboard",
  "Featured on Polygon",
  "★ 4.9 App Store",
  "Best New Platform 2025",
  "Forbes 30 Under 30",
  "1M Creators Onboard",
];

export default function HomePage() {
  return (
    <PageShell>
      <div className="home-page">
        <section className="home-hero">
          <div className="home-hero-inner">
            <div className="home-hero-copy">
              <h1 className="home-hero-title">
                <span>The universe</span>
                <span>where</span>
                <span>everyone</span>
                <span>can <span className="home-gradient">discover,</span></span>
                <span><span className="home-gradient">belong</span> &amp;</span>
                <span className="home-gradient">build.</span>
              </h1>

              <p className="home-hero-lead">
                ESB Games is the next-generation gaming platform, many worlds, one community, infinite possibilities.
                Whether you come to discover new experiences, find your people, or build your own, you belong here.
              </p>

              <div className="home-hero-action-row">
                <div className="home-hero-actions">
                  <Link href="/early-access" className="button button-primary home-primary-action">
                    <GamepadIcon size={17}/> Start Playing
                  </Link>
                  <Link href="/developer-hub" className="button button-secondary home-secondary-action">
                    <CubeIcon size={17}/> Start Creating
                  </Link>
                </div>

                <div className="home-player-proof">
                  <div className="home-avatar-stack" aria-hidden="true">
                    <i/><i/><i/><i/><i/>
                  </div>
                  <span><strong>80M+ players</strong><small>already onboard</small></span>
                </div>
              </div>

              <div className="home-hero-stats" aria-label="Platform statistics">
                <div><strong>20K+</strong><span>GAMES</span></div>
                <div><strong>1M+</strong><span>CREATORS</span></div>
                <div><strong>150+</strong><span>COUNTRIES</span></div>
              </div>

            </div>

            <div className="home-hero-visual" aria-label="ESB Games product preview">
              <div className="home-aurora"/>

              <div className="home-device-scene">
                <div className="home-laptop-frame">
                  <div className="home-laptop-screen-shell">
                    <div className="home-laptop-camera"/>
                    <div className="home-laptop-display">
                      <Image
                        src="/hero-studio-preview.png"
                        alt="Preview of the ESB Studio creator tools"
                        fill
                        sizes="(max-width: 960px) 88vw, 560px"
                        className="home-device-image"
                        priority
                      />
                    </div>
                  </div>
                  <div className="home-laptop-base"/>
                </div>

                <div className="home-tablet-frame">
                  <div className="home-tablet-bezel">
                    <div className="home-tablet-camera"/>
                    <div className="home-tablet-screen">
                      <Image
                        src="/hero-discover-preview.png"
                        alt="Preview of the ESB Games discover experience"
                        fill
                        sizes="(max-width: 960px) 78vw, 340px"
                        className="home-device-image home-tablet-image"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="home-proof-strip" aria-label="Highlights">
          <div className="home-proof-track">
            {proofItems.map((item, index) => <span key={`${item}-${index}`}><b>★</b>{item}</span>)}
          </div>
        </section>

        <section className="home-platform-section">
          <div className="home-section-inner">
            <header className="home-center-heading">
              <h2>A platform that puts <span className="home-gradient">you</span> first.</h2>
              <p>We built ESB from the ground up - for players who want freedom, creators who want fairness,<br className="home-desktop-break"/> and communities that deserve safety.</p>
            </header>

            <div className="home-feature-grid">
              <article className="home-feature-card home-feature-main">
                <span className="home-feature-icon home-feature-icon-magenta"><SparklesIcon/></span>
                <h3>Worlds built in minutes,<br/>not months.</h3>
                <p>Your imagination deserves a platform without limits. ESB Studio combines hot-reload workflows, real-time multiplayer collaboration, AI-assisted scripting, and one-click publishing into a seamless creation experience. Build at your own pace, transform ideas into immersive digital worlds, and bring your creativity to life without technical barriers.</p>
                <Link href="/developer-hub">Open Studio <span>→</span></Link>
              </article>

              <article className="home-feature-card home-feature-small">
                <span className="home-feature-icon home-feature-icon-blue"><ShieldIcon size={21}/></span>
                <h3>Safe by Design</h3>
                <p>Advanced ML-powered moderation, granular parental controls, and a zero-tolerance approach to toxicity ensure a secure and welcoming environment for every creator and player. Safety isn&apos;t an afterthought, it&apos;s built into the foundation of ESB Studio.</p>
              </article>

              <article className="home-feature-card home-feature-small home-feature-performance">
                <span className="home-feature-icon home-feature-icon-pink"><BoltIcon/></span>
                <h3>Smooth Performance Everywhere</h3>
                <p>Our custom-built rendering pipeline is engineered to scale effortlessly from low-end mobile devices to high-performance gaming PCs. Experience fluid 60 FPS gameplay, immersive visuals, and responsive performance across every platform.</p>
              </article>

              <article className="home-feature-card home-feature-half">
                <span className="home-feature-icon home-feature-icon-purple"><CodeIcon/></span>
                <h3>Built for Creators</h3>
                <p>Empowering creators is at the core of ESB Studio. With industry-leading revenue sharing, live multiplayer editing, and instant publishing tools, creators can collaborate, launch, and grow their worlds faster than ever before.</p>
              </article>

              <article className="home-feature-card home-feature-half">
                <span className="home-feature-icon home-feature-icon-orange"><InfinityIcon/></span>
                <h3>Endless Universes</h3>
                <p>Explore thousands of community-driven experiences or create one entirely your own in just minutes. Why limit your imagination when you can turn it into an infinite universe of possibilities?</p>
              </article>
            </div>

            <div className="home-audience-grid">
              <article className="home-audience-card home-creators-card">
                <span className="home-overline">FOR CREATORS</span>
                <h3>Build it. Ship it.<br/>Get paid for it.</h3>
                <p>Industry-leading 70/30 revenue split, instant payouts in 100+ countries, and direct fan subscriptions. Your game, your rules.</p>
                <div className="home-mini-metrics">
                  <div><strong>70%</strong><span>REV SHARE</span></div>
                  <div><strong>$1M+</strong><span>TOP EARNER</span></div>
                  <div><strong>48h</strong><span>PAYOUT</span></div>
                </div>
                <Link href="/developer-hub" className="button button-primary"><CodeIcon size={17}/> Start Building</Link>
              </article>

              <article className="home-audience-card home-players-card">
                <span className="home-overline home-overline-cyan">FOR PLAYERS</span>
                <h3>Find your people.<br/>Make your legend.</h3>
                <p>Friends, parties, groups, events, voice - all under one roof. Plus parental controls and ML safety baked in from day one.</p>
                <div className="home-community-avatars" aria-label="80 million community members">
                  <i/><i/><i/><i/><i/><b>80M</b>
                </div>
                <Link href="/early-access" className="button button-secondary"><UserPlusIcon/> Join the community</Link>
              </article>
            </div>
          </div>
        </section>

        <section className="home-support-section">
          <div className="home-section-inner home-support-grid">
            <div className="home-support-copy">
              <h2>We&apos;re here when<br/><span className="home-gradient">you need us</span>.</h2>
              <p>Got a billing issue, a bug to report, or just need help with something? Our support team is real people - submit a ticket and we&apos;ll get back to you fast.</p>
              <div className="home-support-actions">
                <Link href="/support" className="button button-primary"><HeadsetIcon/> Go to Support</Link>
                <Link href="/support" className="button button-secondary"><TicketIcon size={18}/> Submit a Ticket</Link>
              </div>
            </div>

            <div className="home-support-cards">
              <article><span className="home-feature-icon home-feature-icon-magenta"><TicketIcon/></span><h3>Open a Ticket</h3><p>Report bugs, account issues, or anything else - tracked end to end.</p></article>
              <article><span className="home-feature-icon home-feature-icon-blue"><BoltIcon/></span><h3>Fast Responses</h3><p>Most tickets are resolved within 24 hours by our in-house team.</p></article>
              <article><span className="home-feature-icon home-feature-icon-teal"><SearchIcon/></span><h3>Safety Reports</h3><p>Report harassment, cheating, or abuse. Every report is reviewed.</p></article>
              <article><span className="home-feature-icon home-feature-icon-orange"><BookIcon/></span><h3>Help Articles</h3><p>Hundreds of guides for account, billing, creators and more.</p></article>
            </div>
          </div>

          <div className="home-section-inner">
            <div className="home-early-banner">
              <h2>Your next favorite game is<br/><span className="home-gradient">already here</span>.</h2>
              <p>Be the first to play. Be the first to build. Join the waitlist and lock in your founder rewards.</p>
              <div className="home-banner-actions">
                <Link href="/early-access" className="button button-primary"><RocketIcon/> Get Early Access</Link>
                <Link href="/about" className="button button-secondary">Learn more</Link>
              </div>
              <div className="home-banner-trust">
                <span><ShieldIcon size={14}/> Safe &amp; moderated</span>
                <span><BoltIcon size={14}/> 60fps everywhere</span>
                <span><GlobeIcon size={14}/> 150+ countries</span>
                <span>● No credit card needed</span>
              </div>
            </div>
          </div>
        </section>

        <section className="home-newsletter-section">
          <div className="home-section-inner">
            <div className="home-newsletter-card">
              <div>
                <span className="home-newsletter-overline"><i/> STAY IN THE LOOP</span>
                <h2>Get drops, updates &amp; insider<br/>news.</h2>
                <p>Patch notes, beta invites and exclusive cosmetics - straight to your inbox. No spam, ever.</p>
              </div>
              <form className="home-newsletter-form" action="/early-access">
                <MailIcon/>
                <input type="email" name="email" placeholder="you@playerone.gg" aria-label="Email address" required/>
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
