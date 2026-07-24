import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import {
  CubeIcon,
  GamepadIcon,
  GlobeIcon,
  HeartIcon,
  RocketIcon,
  ShieldIcon,
  UsersIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the ESB Games mission, principles and vision for the future of play and creation.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    title: "Community first",
    description: "We are building a positive, inclusive platform where players, creators and communities can genuinely belong.",
    icon: <UsersIcon size={21} />,
    tone: "pink",
  },
  {
    title: "Creativity without limits",
    description: "Powerful tools should make ambitious ideas possible without making creation difficult to begin.",
    icon: <HeartIcon size={21} />,
    tone: "purple",
  },
  {
    title: "Creators and players empowered",
    description: "The people who build and enjoy the platform should have a meaningful voice in how it develops.",
    icon: <CubeIcon size={21} />,
    tone: "blue",
  },
  {
    title: "Players come first",
    description: "Discovery, performance, social features and safety should all make the player experience better.",
    icon: <GamepadIcon size={21} />,
    tone: "orange",
  },
  {
    title: "Integrity and trust",
    description: "Clear communication, fair systems and accountable decisions are essential to earning long-term trust.",
    icon: <ShieldIcon size={21} />,
    tone: "green",
  },
] as const;



function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 5.5v13l10-6.5L8 5.5Z" fill="currentColor" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <PageShell>
      <div className="about-page-v2">
        <section className="about-video-hero">
          <div className="about-video-layer" aria-hidden="true">
            <video
              className="about-hero-video"
              poster="/about-trailer-placeholder.svg"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
            />
            <div className="about-video-shade" />
            <div className="about-video-colour" />
          </div>

          <div className="about-hero-inner">
            <div className="about-hero-copy">
              <span className="about-kicker">About ESB Games</span>
              <h1>
                We&apos;re building<br />
                the future of<br />
                <span>play.</span>
              </h1>
              <p>
                ESB Games is a next-generation gaming and creation platform built for players, creators and communities.
                Safe, fair, connected and designed for the next generation of digital experiences.
              </p>
              <div className="about-hero-actions">
                <a href="https://esbgames.com/login" className="button button-primary" data-analytics="join-now"><RocketIcon size={17} /> Join ESB Games</a>
                <Link href="/careers" className="button button-secondary">Join the team</Link>
              </div>
            </div>

            <div className="about-trailer-status" aria-label="Company trailer placeholder">
              <span className="about-trailer-play"><PlayIcon /></span>
              <span>
                <strong>ESB Games company trailer</strong>
                <small>Video placeholder, ready for your YouTube link or uploaded MP4.</small>
              </span>
            </div>
          </div>
        </section>

        <section className="about-mission-section">
          <div className="about-section-inner">
            <Reveal>
              <article className="about-mission-card">
                <span className="about-quote-mark">“</span>
                <blockquote>
                  Our mission is to create the safest, fairest and most <em>creative gaming universe</em> on the planet, and to share its success with the players and creators who build it.
                </blockquote>
                <p>The ESB Games founding team</p>
              </article>
            </Reveal>

            <div className="about-stat-grid" aria-label="ESB Games platform statistics">
              <Reveal><article><UsersIcon size={20} /><strong>80M+</strong><span>Players worldwide</span></article></Reveal>
              <Reveal><article><GamepadIcon size={20} /><strong>20K+</strong><span>Games envisioned</span></article></Reveal>
              <Reveal><article><GlobeIcon size={20} /><strong>150+</strong><span>Countries supported</span></article></Reveal>
              <Reveal><article><RocketIcon size={20} /><strong>One</strong><span>Connected ecosystem</span></article></Reveal>
            </div>
          </div>
        </section>

        <section className="about-principles-section">
          <div className="about-section-inner">
            <Reveal className="about-section-heading">
              <span className="about-kicker">What guides us</span>
              <h2>The principles we play by.</h2>
              <p>Every feature, policy and product decision should make ESB Games safer, fairer and more useful for the people who use it.</p>
            </Reveal>

            <div className="about-principles-grid">
              {principles.map((principle) => (
                <Reveal key={principle.title}>
                  <article className="about-principle-card">
                    <span className={`about-card-icon about-card-icon-${principle.tone}`}>{principle.icon}</span>
                    <h3>{principle.title}</h3>
                    <p>{principle.description}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        

        <section className="about-platform-section">
          <div className="about-section-inner about-platform-layout">
            <Reveal className="about-platform-copy">
              <span className="about-kicker">Why ESB Games</span>
              <h2>The platform other platforms <span>aren&apos;t.</span></h2>
              <p>ESB Games brings play, creation, publishing, communities, safety and monetisation together in one connected ecosystem.</p>
              <Link href="/developer-hub" className="button button-secondary">Explore the Creator Hub</Link>
            </Reveal>

            <div className="about-platform-grid">
              <Reveal><article><span className="about-card-icon about-card-icon-purple"><RocketIcon size={21} /></span><h3>All-in-one platform</h3><p>Play, create, publish, socialise and grow without moving between disconnected services.</p></article></Reveal>
              <Reveal><article><span className="about-card-icon about-card-icon-pink"><CubeIcon size={21} /></span><h3>Advanced creator tools</h3><p>Accessible creation tools, collaboration, analytics and publishing for beginners and advanced developers.</p></article></Reveal>
              <Reveal><article><span className="about-card-icon about-card-icon-blue"><ShieldIcon size={21} /></span><h3>Safety built for everyone</h3><p>Moderation, parental controls, account protection and age-appropriate experiences from day one.</p></article></Reveal>
              <Reveal><article><span className="about-card-icon about-card-icon-green"><GlobeIcon size={21} /></span><h3>Truly global</h3><p>A platform designed for international communities, local experiences and creators around the world.</p></article></Reveal>
            </div>
          </div>
        </section>

        <section className="about-cta-section">
          <Reveal>
            <div className="about-cta-card">
              <div>
                <span className="about-kicker">The future starts here</span>
                <h2>Ready to join the future of gaming?</h2>
                <p>Discover worlds, connect with communities and build something entirely your own.</p>
              </div>
              <a href="https://esbgames.com/login" className="button button-primary" data-analytics="join-now"><RocketIcon size={17} /> Join Now</a>
            </div>
          </Reveal>
        </section>
      </div>
    </PageShell>
  );
}
