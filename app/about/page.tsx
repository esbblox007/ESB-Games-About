import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import { GlobeIcon, HeartIcon, ShieldIcon, UsersIcon } from "@/components/Icons";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PageShell>
      <section className="hero hero-no-grid">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">About ESB Games</span>
            <h1>We&apos;re building<br />the future of<br /><span className="gradient-text">play.</span></h1>
            <p className="hero-lead">ESB Games is a next-generation gaming platform built for players and creators. Safe. Fair. Open. Designed to make creation more accessible and communities more connected.</p>
            <div className="hero-actions">
              <Link href="/early-access" className="button button-primary">Explore ESB Games</Link>
              <Link href="/careers" className="button button-secondary">Join the team</Link>
            </div>
          </div>
          <div className="about-orbit" aria-label="ESB Games platform orbit illustration">
            <div className="orbit orbit-one"><span className="orbit-dot"/></div>
            <div className="orbit orbit-two"><span className="orbit-dot"/></div>
            <div className="orbit-core">ESB</div>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="section-inner">
          <Reveal><div className="quote-panel"><blockquote>Our mission is to create the safest, fairest and most <em>creative gaming universe</em>—and share its success with the people who build it.</blockquote></div></Reveal>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <Reveal className="section-heading center">
            <span className="eyebrow">What guides us</span>
            <h2>Principles before <span className="gradient-text">features.</span></h2>
            <p>The platform is being designed around four commitments that shape every product decision.</p>
          </Reveal>
          <div className="grid-4">
            <Reveal><article className="card"><span className="card-icon"><ShieldIcon/></span><h3>Safe by design</h3><p>Safety, parental controls, moderation and privacy are product foundations—not later additions.</p></article></Reveal>
            <Reveal><article className="card"><span className="card-icon"><HeartIcon/></span><h3>Fair for creators</h3><p>Clear economics, fair discovery and transparent tools help independent creators compete.</p></article></Reveal>
            <Reveal><article className="card"><span className="card-icon"><UsersIcon/></span><h3>Community-led</h3><p>Players, developers and communities should influence how the ecosystem grows.</p></article></Reveal>
            <Reveal><article className="card"><span className="card-icon"><GlobeIcon/></span><h3>Open opportunity</h3><p>Creation should be approachable for beginners and powerful enough for professional teams.</p></article></Reveal>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="section-inner">
          <Reveal className="section-heading">
            <span className="eyebrow">The platform</span>
            <h2>One identity. One economy. <span className="gradient-text">Many worlds.</span></h2>
            <p>ESB Games brings together game discovery, a player app, creator tools, groups, messaging, events, subscriptions and marketplace systems.</p>
          </Reveal>
          <div className="grid-3">
            <Reveal><article className="card"><h3>For players</h3><p>Discover games, personalise an avatar, join communities, attend events and stay connected with friends.</p></article></Reveal>
            <Reveal><article className="card"><h3>For creators</h3><p>Build in ESB Studio, publish games, grow an audience, manage teams and earn through your work.</p></article></Reveal>
            <Reveal><article className="card"><h3>For communities</h3><p>Create structured spaces with roles, channels, events, moderation and rich social features.</p></article></Reveal>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
