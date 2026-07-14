import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import { CubeIcon, GamepadIcon, GlobeIcon, HeartIcon, RocketIcon, ShieldIcon, UsersIcon } from "@/components/Icons";

export const metadata: Metadata = { title: "Play. Create. Connect." };

export default function HomePage() {
  return (
    <PageShell>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">A new gaming universe</span>
            <h1>The universe<br />where you<br /><span className="gradient-text">play, create</span> &<br /><span className="gradient-text">connect.</span></h1>
            <p className="hero-lead">ESB Games is a next-generation gaming ecosystem: many worlds, one community and limitless possibilities. Play, build or simply hang out—you belong here.</p>
            <div className="hero-actions">
              <Link href="/early-access" className="button button-primary"><GamepadIcon size={18}/> Start Playing</Link>
              <Link href="/developer-hub" className="button button-secondary"><CubeIcon size={17}/> Start Creating</Link>
            </div>
            <div className="hero-micro">
              <div className="avatar-stack" aria-hidden="true"><i/><i/><i/><i/></div>
              <span><strong>Creator-first</strong><br/>Built for the next generation</span>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><strong>7</strong><span>CORE EXPERIENCES</span></div>
              <div className="hero-stat"><strong>70/30</strong><span>CREATOR SPLIT</span></div>
              <div className="hero-stat"><strong>Global</strong><span>BY DESIGN</span></div>
            </div>
          </div>
          <div className="home-visual" aria-label="Animated ESB Games ecosystem graphic">
            <div className="aurora"/><div className="visual-line"/>
            <div className="floating-badge badge-live"><span className="icon-box">⚡</span><span><small>PLATFORM</small><strong>Early access soon</strong></span></div>
            <div className="floating-badge badge-tournament"><span className="icon-box">🏆</span><span><small>CREATORS</small><strong>Earn from games</strong></span></div>
            <div className="floating-badge badge-stream"><span className="icon-box"/><span><small>CONNECTED</small><strong>Communities · Events · Friends</strong></span></div>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="section-inner">
          <Reveal className="section-heading center">
            <span className="eyebrow">One connected ecosystem</span>
            <h2>Everything needed to <span className="gradient-text">play bigger.</span></h2>
            <p>ESB Games combines discovery, creation, social communities and creator monetisation in one platform.</p>
          </Reveal>
          <div className="grid-3">
            <Reveal><article className="card"><span className="card-icon"><GamepadIcon/></span><h3>Discover new worlds</h3><p>Find games through fair discovery, events, friends and personalised recommendations.</p><Link className="card-link" href="/early-access">Join early access →</Link></article></Reveal>
            <Reveal><article className="card"><span className="card-icon"><CubeIcon/></span><h3>Create without limits</h3><p>Build with ESB Studio, collaborate with teams and publish directly to players worldwide.</p><Link className="card-link" href="/developer-hub">Explore creator tools →</Link></article></Reveal>
            <Reveal><article className="card"><span className="card-icon"><UsersIcon/></span><h3>Communities that belong</h3><p>Bring players together with rich groups, messaging, events, voice and moderation tools.</p><Link className="card-link" href="/about">Read our vision →</Link></article></Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <Reveal><div className="quote-panel"><blockquote>Play should be <em>fun</em>. Creation should be <em>fair</em>. Communities should feel <em>safe</em>.</blockquote></div></Reveal>
          <div className="grid-3" style={{marginTop: 28}}>
            <Reveal><article className="card"><span className="card-icon"><ShieldIcon/></span><h3>Safety from day one</h3><p>Age-aware controls, strong moderation and transparent reporting are built into the platform.</p></article></Reveal>
            <Reveal><article className="card"><span className="card-icon"><HeartIcon/></span><h3>Creator-first economics</h3><p>Clear platform fees, useful analytics and systems designed to help creators grow sustainably.</p></article></Reveal>
            <Reveal><article className="card"><span className="card-icon"><GlobeIcon/></span><h3>Made for a global audience</h3><p>Accessible, cross-device experiences and communities built to connect people around the world.</p></article></Reveal>
          </div>
          <Reveal className="section-heading center" >
            <div style={{marginTop: 60}}><Link href="/early-access" className="button button-primary"><RocketIcon/> Get Early Access</Link></div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
