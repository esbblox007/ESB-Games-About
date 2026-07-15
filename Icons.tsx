import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import CareersJobs from "@/components/CareersJobs";
import { GlobeIcon, HeartIcon, SearchIcon, StarIcon, UsersIcon } from "@/components/Icons";

export const metadata: Metadata = { title: "Careers" };

export default function CareersPage() {
  return (
    <PageShell>
      <section className="hero hero-no-grid">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Careers at ESB Games</span>
            <h1>Build the<br />future of<br /><span className="gradient-text">gaming,</span> with us.</h1>
            <p className="hero-lead">We&apos;re a remote-first collective of engineers, artists, designers and innovators building a new platform for creators. Together, we&apos;re shaping the future of interactive entertainment.</p>
            <div className="hero-actions"><a href="#open-roles" className="button button-primary"><SearchIcon size={17}/> See open roles</a><a href="#culture" className="button button-secondary"><HeartIcon size={17}/> Our culture</a></div>
          </div>
          <div className="career-metrics">
            <div className="metric-card"><UsersIcon/><strong>Remote-first</strong><span>TEAM STRUCTURE</span></div>
            <div className="metric-card"><GlobeIcon/><strong>Global</strong><span>COLLABORATION</span></div>
            <div className="metric-card"><HeartIcon/><strong>People-led</strong><span>WORKING CULTURE</span></div>
            <div className="metric-card"><StarIcon/><strong>Creator-first</strong><span>SHARED MISSION</span></div>
          </div>
        </div>
      </section>

      <section className="section section-dark" id="culture">
        <div className="section-inner">
          <Reveal className="section-heading center"><span className="eyebrow">Life at ESB Games</span><h2>Ambitious work. <span className="gradient-text">Human culture.</span></h2><p>We want people to do their best work without sacrificing curiosity, balance or kindness.</p></Reveal>
          <div className="grid-3">
            <Reveal><article className="card"><h3>Own meaningful work</h3><p>Small teams, clear responsibility and direct access to the decisions shaping the platform.</p></article></Reveal>
            <Reveal><article className="card"><h3>Work from anywhere</h3><p>Remote-first communication, thoughtful documentation and flexible collaboration across time zones.</p></article></Reveal>
            <Reveal><article className="card"><h3>Build with the community</h3><p>Learn directly from players and creators rather than building in isolation.</p></article></Reveal>
          </div>
        </div>
      </section>

      <section className="section" id="open-roles">
        <div className="section-inner">
          <Reveal className="section-heading"><span className="eyebrow">Open positions</span><h2>Find your place in the <span className="gradient-text">universe.</span></h2><p>The roles below are example vacancies ready for you to replace with live positions before launch.</p></Reveal>
          <CareersJobs />
          <Reveal><div className="quote-panel" style={{marginTop:55}}><blockquote>Don&apos;t see the perfect role? <em>Introduce yourself.</em></blockquote><div style={{marginTop:24}}><Link className="button button-primary" href="mailto:careers@esbgames.com?subject=General application">Send a general application</Link></div></div></Reveal>
        </div>
      </section>
    </PageShell>
  );
}
