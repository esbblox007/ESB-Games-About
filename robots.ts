import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import Pricing from "@/components/Pricing";
import Reveal from "@/components/Reveal";
import { ClockIcon, GlobeIcon, ShieldIcon } from "@/components/Icons";

export const metadata: Metadata = { title: "Subscriptions" };

export default function SubscriptionsPage() {
  return (
    <PageShell>
      <section className="hero hero-no-grid pricing-hero">
        <div className="hero-inner">
          <span className="eyebrow">Flexible membership</span>
          <h1 className="page-title">Choose your<br /><span className="gradient-text">power level.</span></h1>
          <p className="hero-lead" style={{marginInline:"auto"}}>Unlock more worlds, cosmetics, support and creator tools. Change or cancel whenever you need.</p>
          <div className="trust-row"><span>🔒 Secure checkout</span><span>↻ Cancel anytime</span><span>◉ Member support</span><span>◎ Global availability</span></div>
        </div>
      </section>
      <section className="section section-dark">
        <div className="section-inner"><Pricing /></div>
      </section>
      <section className="section">
        <div className="section-inner">
          <Reveal className="section-heading center"><span className="eyebrow">Simple and flexible</span><h2>Membership without the <span className="gradient-text">friction.</span></h2></Reveal>
          <div className="grid-3">
            <Reveal><article className="card"><span className="card-icon"><ShieldIcon/></span><h3>Clear pricing</h3><p>No hidden platform charges. The price and included benefits are shown before checkout.</p></article></Reveal>
            <Reveal><article className="card"><span className="card-icon"><ClockIcon/></span><h3>Change anytime</h3><p>Upgrade, downgrade or cancel from account settings without contacting support.</p></article></Reveal>
            <Reveal><article className="card"><span className="card-icon"><GlobeIcon/></span><h3>Built for everyone</h3><p>A strong free tier remains available so membership is optional, not a barrier to play.</p></article></Reveal>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

