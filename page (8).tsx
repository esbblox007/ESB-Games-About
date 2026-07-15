import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import { BookIcon, CheckIcon, CubeIcon, DownloadIcon, GamepadIcon, GlobeIcon, UsersIcon } from "@/components/Icons";

export const metadata: Metadata = { title: "Developer Hub" };

export default function DeveloperHubPage() {
  return (
    <PageShell>
      <section className="hero hero-no-grid">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Developer Hub</span>
            <h1>Create it.<br /><span className="gradient-text">Launch it.</span><br />Earn from it.</h1>
            <p className="hero-lead">Build games on ESB Games, publish them to players worldwide and earn through your creations. Simple tools, powerful systems and a platform made for developers.</p>
            <div className="hero-actions">
              <Link href="/early-access?type=creator" className="button button-primary"><DownloadIcon size={17}/> Join Studio Access</Link>
              <a href="#docs" className="button button-secondary"><BookIcon size={17}/> View Developer Docs</a>
            </div>
          </div>
          <div className="code-window" aria-label="ESB Studio code example">
            <div className="code-titlebar"><i className="window-dot red"/><i className="window-dot yellow"/><i className="window-dot green"/><span>main.esb · ESB Studio</span></div>
            <div className="code-body">
              <div><span className="purple">local</span> game = ESB.<span className="cyan">CreateGame</span>(<span className="yellow">&quot;Neon City&quot;</span>)</div>
              <div>game:<span className="cyan">Publish</span>()</div>
              <div><span className="cyan">print</span>(<span className="yellow">&quot;Game published!&quot;</span>)</div>
            </div>
            <div className="code-status">✓ Game published · ready for worldwide release</div>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="section-inner">
          <Reveal><div className="stat-strip">
            <div className="stat-item"><span className="card-icon"><UsersIcon/></span><div><strong>Team Create</strong><span>REAL-TIME COLLABORATION</span></div></div>
            <div className="stat-item"><span className="card-icon"><GamepadIcon/></span><div><strong>One-click</strong><span>PUBLISHING PIPELINE</span></div></div>
            <div className="stat-item"><span className="card-icon"><GlobeIcon/></span><div><strong>Global</strong><span>PLAYER REACH</span></div></div>
            <div className="stat-item"><span className="card-icon"><CubeIcon/></span><div><strong>70/30</strong><span>PLANNED REVENUE SPLIT</span></div></div>
          </div></Reveal>
        </div>
      </section>

      <section className="section" id="docs">
        <div className="section-inner">
          <Reveal className="section-heading center"><span className="eyebrow">Build your way</span><h2>From first idea to <span className="gradient-text">live world.</span></h2><p>ESB Studio is planned as a downloadable creation environment with beginner and advanced workflows.</p></Reveal>
          <div className="grid-3">
            <Reveal><article className="card"><span className="card-icon"><CubeIcon/></span><h3>Powerful creation tools</h3><p>Terrain, UI, animation, sound, visual effects and templates in one connected editor.</p></article></Reveal>
            <Reveal><article className="card"><span className="card-icon"><UsersIcon/></span><h3>Teams built in</h3><p>Collaborate live, manage permissions, review changes and keep version history.</p></article></Reveal>
            <Reveal><article className="card"><span className="card-icon"><GlobeIcon/></span><h3>Publish and grow</h3><p>Release through the ESB Games Player, learn from analytics and reach new audiences.</p></article></Reveal>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="section-inner">
          <Reveal className="section-heading"><span className="eyebrow">Creator economics</span><h2>Built to reward the people who <span className="gradient-text">make the worlds.</span></h2></Reveal>
          <div className="grid-3">
            {[
              ["Transparent platform fee", "A simple planned 70/30 creator revenue split with clear reporting."],
              ["Marketplace opportunities", "Sell assets, hire collaborators and use protected transaction systems."],
              ["Fairer discovery", "Sponsored placements and recommendation systems designed not to bury small teams."],
            ].map(([title, text]) => <Reveal key={title}><article className="card"><span className="card-icon"><CheckIcon/></span><h3>{title}</h3><p>{text}</p></article></Reveal>)}
          </div>
          <Reveal><div style={{textAlign:"center", marginTop:40}}><Link href="/early-access?type=creator" className="button button-primary">Register as a creator</Link></div></Reveal>
        </div>
      </section>
    </PageShell>
  );
}
