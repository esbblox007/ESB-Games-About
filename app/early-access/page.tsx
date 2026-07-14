import type { Metadata } from "next";
import { Suspense } from "react";
import PageShell from "@/components/PageShell";
import EarlyAccessForm from "@/components/EarlyAccessForm";
import FAQ from "@/components/FAQ";
import Reveal from "@/components/Reveal";
import { GamepadIcon, ShieldIcon, UsersIcon } from "@/components/Icons";

export const metadata: Metadata = { title: "Early Access" };

export default function EarlyAccessPage() {
  return (
    <PageShell>
      <section className="hero hero-no-grid early-hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">The next universe starts here</span>
            <h1>Be early.<br />Help shape<br /><span className="gradient-text">ESB Games.</span></h1>
            <p className="hero-lead">Join the early-access list to hear about player testing, ESB Studio previews and the journey toward launch.</p>
            <div className="grid-3" style={{gridTemplateColumns:"1fr",gap:12,maxWidth:560}}>
              <div className="benefit-row"><span className="card-icon"><GamepadIcon/></span><div><strong>Player previews</strong><p>Try selected platform experiences before wider release.</p></div></div>
              <div className="benefit-row"><span className="card-icon"><UsersIcon/></span><div><strong>Creator feedback</strong><p>Influence tools, publishing flows and developer systems.</p></div></div>
              <div className="benefit-row"><span className="card-icon"><ShieldIcon/></span><div><strong>Safety-led testing</strong><p>Help validate controls, reporting and community experiences.</p></div></div>
            </div>
          </div>
          <Suspense fallback={<div className="early-card">Loading form…</div>}><EarlyAccessForm /></Suspense>
        </div>
      </section>
      <section className="section section-dark">
        <div className="section-inner"><Reveal className="section-heading center"><span className="eyebrow">Questions</span><h2>Early access, <span className="gradient-text">explained.</span></h2></Reveal><FAQ/></div>
      </section>
    </PageShell>
  );
}
