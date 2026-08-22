import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import NewsletterForm from "@/components/NewsletterForm";
import {
  BookIcon,
  CubeIcon,
  GamepadIcon,
  GlobeIcon,
  RocketIcon,
  SearchIcon,
  ShieldIcon,
  TicketIcon,
} from "@/components/Icons";
import { homeProofItems } from "@/lib/content/siteMetrics";

export const metadata: Metadata = {
  title: { absolute: "ESB Games — Discover. Belong. Build." },
  description: "Discover ESB Games, a connected gaming and creator ecosystem being built for players, creators, families and communities.",
  alternates: { canonical: "/" },
  openGraph: { title: "ESB Games — Discover. Belong. Build.", description: "A connected gaming and creator ecosystem where people can discover, belong and build.", url: "/" },
};

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
                ESB Games is building a connected gaming and creator ecosystem: many worlds, one community and room for ambitious ideas. Whether you come to discover new experiences, find your people or build your own, you belong here.
              </p>

              <div className="home-hero-action-row">
                <div className="home-hero-actions">
                  <a href="https://esbgames.com" className="button button-primary home-primary-action" data-analytics="explore-platform">
                    <GamepadIcon size={17}/> Explore ESB Games
                  </a>
                  <Link href="/developer-hub" className="button button-secondary home-secondary-action">
                    <CubeIcon size={17}/> Explore Creator Hub
                  </Link>
                </div>

                <div className="home-player-proof">
                  <div className="home-avatar-stack" aria-hidden="true">
                    <i/><i/><i/><i/><i/>
                  </div>
                  <span><strong>One account </strong><small>across the ESB Games ecosystem</small></span>
                </div>
              </div>

              <div className="home-hero-stats home-proof-points" aria-label="ESB Games product principles">
                <div><strong>ONE ECOSYSTEM</strong><span>Games, creation, communities and discovery.</span></div>
                <div><strong>CREATOR-FIRST</strong><span>Tools built for games, experiences and UGC.</span></div>
                <div><strong>GLOBAL BY DESIGN</strong><span>Built for communities around the world.</span></div>
              </div>
            </div>

            <div className="home-hero-visual" aria-label="ESB Games product interface">
              <div className="home-aurora"/>
              <div className="home-device-scene">
                <div className="home-laptop-frame">
                  <div className="home-laptop-screen-shell">
                    <div className="home-laptop-camera"/>
                    <div className="home-laptop-display">
                      <Image src="/hero-studio-platform.png" alt="ESB Studio creator tools" fill sizes="(max-width: 960px) 88vw, 700px" className="home-device-image" unoptimized priority />
                    </div>
                  </div>
                  <div className="home-laptop-base"/>
                </div>
                <div className="home-tablet-frame">
                  <div className="home-tablet-bezel">
                    <div className="home-tablet-camera"/>
                    <div className="home-tablet-screen">
                      <Image src="/hero-discover-platform.png" alt="ESB Games discover experience" fill sizes="(max-width: 960px) 78vw, 500px" className="home-device-image home-tablet-image" unoptimized priority />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="home-proof-strip" aria-label="Highlights">
          <p className="sr-only">{homeProofItems.join(" ")}</p>
          <div className="home-proof-track" aria-hidden="true">
            {[0, 1, 2].map((group) => (
              <div className="home-proof-group" key={group}>
                {homeProofItems.map((item) => <span key={`${group}-${item}`}><b>★</b>{item}</span>)}
              </div>
            ))}
          </div>
        </section>

        <section className="home-platform-section">
          <div className="home-section-inner">
            <header className="home-center-heading">
              <h2>A platform that puts <span className="home-gradient">you</span> first.</h2>
              <p>We are building ESB Games for players who want freedom, creators who want fairness,<br className="home-desktop-break"/> and communities that deserve safety.</p>
            </header>

            <div className="home-feature-grid">
              <article className="home-feature-card home-feature-main">
                <span className="home-feature-icon home-feature-icon-magenta"><SparklesIcon/></span>
                <h3>Build ambitious worlds,<br/>step by step.</h3>
                <p>ESB Studio is being designed around approachable building tools, reusable workflows, scripting, animation, VFX and connected publishing. Features will be introduced in stages as the creator tool moves through testing.</p>
                <Link href="/developer-hub">Explore ESB Studio <span>→</span></Link>
              </article>
              <article className="home-feature-card home-feature-small">
                <span className="home-feature-icon home-feature-icon-blue"><ShieldIcon size={21}/></span>
                <h3>Safe by Design</h3>
                <p>Moderation workflows, parental controls, account protection and age-appropriate settings are being designed alongside the platform. Safety requirements will continue to be tested and improved before public launch.</p>
              </article>
              <article className="home-feature-card home-feature-small home-feature-performance">
                <span className="home-feature-icon home-feature-icon-pink"><BoltIcon/></span>
                <h3>Smooth Performance Everywhere</h3>
                <p>The platform and Studio are being developed with responsive controls, scalable graphics settings and support for a wide range of devices. Final performance targets will be confirmed through testing.</p>
              </article>
              <article className="home-feature-card home-feature-half">
                <span className="home-feature-icon home-feature-icon-purple"><CodeIcon/></span>
                <h3>Built for Creators</h3>
                <p>Creator tools, analytics, collaboration and publishing workflows are being developed as one connected experience. Monetisation and publishing requirements will be published before those systems launch.</p>
              </article>
              <article className="home-feature-card home-feature-half">
                <span className="home-feature-icon home-feature-icon-orange"><InfinityIcon/></span>
                <h3>Endless Universes</h3>
                <p>Discover experiences, join communities and build projects through one connected ecosystem. The public experience library will grow as creators begin publishing to ESB Games.</p>
              </article>
            </div>

            <div className="home-audience-grid">
              <article className="home-audience-card home-creators-card">
                <span className="home-overline">FOR CREATORS</span>
                <h3>Build it. Prepare it.<br/>Grow with it.</h3>
                <p>ESB Games is building creator publishing, analytics, monetisation and marketplace systems designed to help successful creators grow. Final commercial terms will be published before those systems launch.</p>
                <div className="home-mini-metrics home-mini-proof">
                  <div><strong>CONNECTED</strong><span>Studio and platform workflows</span></div>
                  <div><strong>CREATOR-FIRST</strong><span>Growth tools in development</span></div>
                  <div><strong>PRE-LAUNCH</strong><span>Terms not yet final</span></div>
                </div>
                <Link href="/developer-hub" className="button button-primary"><CodeIcon size={17}/> Explore creator tools</Link>
              </article>

              <article className="home-audience-card home-players-card">
                <span className="home-overline home-overline-cyan">FOR PLAYERS</span>
                <h3>Find your people.<br/>Make your legend.</h3>
                <p>Friends, groups, events, messaging and discovery are being brought together with family controls and platform safety systems.</p>
                <div className="home-community-avatars" aria-label="One connected ESB Games community"><i/><i/><i/><i/><i/><b>ESB</b></div>
                <a href="https://esbgames.com" className="button button-secondary" data-analytics="explore-platform"><UserPlusIcon/> Explore the platform</a>
              </article>
            </div>
          </div>
        </section>

        <section className="home-support-section">
          <div className="home-section-inner home-support-grid">
            <div className="home-support-copy">
              <h2>We&apos;re here when<br/><span className="home-gradient">you need us</span>.</h2>
              <p>Need help with an account, billing, safety or a technical issue? Use the private support flow to send the details to the appropriate ESB Games team.</p>
              <div className="home-support-actions"><Link href="/support" className="button button-primary"><HeadsetIcon/> Go to Support</Link></div>
            </div>
            <div className="home-support-cards">
              <article><span className="home-feature-icon home-feature-icon-magenta"><TicketIcon/></span><h3>Structured Requests</h3><p>Account, billing, creator, technical and general support categories are prepared.</p></article>
              <article><span className="home-feature-icon home-feature-icon-blue"><BoltIcon/></span><h3>Clear Statuses</h3><p>Support requests use clear case statuses from receipt through review and resolution.</p></article>
              <article><span className="home-feature-icon home-feature-icon-teal"><SearchIcon/></span><h3>Safety Route</h3><p>A dedicated safety form is prepared for harassment, abuse and dangerous content concerns.</p></article>
              <article><span className="home-feature-icon home-feature-icon-orange"><BookIcon/></span><h3>Growing Help Centre</h3><p>Initial guidance covers accounts, subscriptions, appeals, reports and creator topics, with more articles being prepared.</p></article>
            </div>
          </div>

          <div className="home-section-inner">
            <div className="home-early-banner">
              <h2>The next era of play is<br/><span className="home-gradient">being built</span>.</h2>
              <p>Create your ESB Games account and follow the platform as testing, creator tools and public availability expand.</p>
              <div className="home-banner-actions">
                <a href="https://esbgames.com" className="button button-primary" data-analytics="explore-platform"><RocketIcon/> Explore ESB Games</a>
                <Link href="/about" className="button button-secondary">Learn more</Link>
              </div>
              <div className="home-banner-trust">
                <span><ShieldIcon size={14}/> Safety systems in development</span>
                <span><BoltIcon size={14}/> Staff-first testing planned</span>
                <span><GlobeIcon size={14}/> International expansion planned</span>
                <span>● One connected account</span>
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
                <p>Product updates, development notes and launch announcements will be available here as ESB Games moves toward public launch.</p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
