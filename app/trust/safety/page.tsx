import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { ArrowIcon, ShieldIcon, UsersIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Safety Centre",
  description: "Learn about the prevention, detection, enforcement, appeals and family-safety principles being built into ESB Games.",
  alternates: { canonical: "/trust/safety" },
};

const pillars = [
  ["Prevention", "Age-appropriate systems, privacy controls and safer product design are being considered as the platform is built."],
  ["Detection", "Reports, automated systems and appropriately authorised human review are intended to help identify harmful content and behaviour."],
  ["Enforcement", "Warnings, restrictions, content removal and account action are planned to scale with the severity and context of a violation."],
  ["Appeals", "Eligible moderation decisions will be able to be challenged and reviewed through a documented appeals process."],
  ["Parents & families", "Family Centre and parental tools are being designed to help guardians manage age-appropriate experiences, communication and spending."],
] as const;

const coverage = ["Child safety", "Harassment", "Scams", "Privacy", "Dangerous content", "Hate", "Self-harm safety", "Exploitation", "Intellectual property", "Cheating & exploits", "Creator responsibilities", "Groups", "Messaging", "Voice", "Events", "Marketplace activity"];

export default function SafetyCentrePage() {
  return (
    <PageShell>
      <div className="safety-centre-page">
        <section className="safety-centre-hero"><div className="trust-container"><Link className="trust-back-link" href="/trust"><ArrowIcon size={15} /> Trust, Safety &amp; Legal</Link><span className="eyebrow">Safety Centre</span><h1>Safety designed into<br /><span className="gradient-text">the ecosystem.</span></h1><p>ESB Games is building safety systems alongside the platform rather than treating them as an afterthought. Some controls remain in development and will continue to change through testing.</p></div></section>
        <section className="safety-centre-content"><div className="trust-container">
          <div className="safety-pillar-grid">{pillars.map(([title, text], index) => <article key={title}><span>{index === 4 ? <UsersIcon /> : <ShieldIcon />}</span><h2>{title}</h2><p>{text}</p></article>)}</div>
          <div className="safety-coverage-card"><div><span className="eyebrow">What the rules are designed to cover</span><h2>A broad safety framework for play, creation and community.</h2><p>The final Community Standards and enforcement documents are still being prepared. At a high level, ESB Games rules are intended to address areas including:</p></div><ul>{coverage.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div className="safety-action-grid"><article><h2>Report a concern</h2><p>Use the private Support flow for account, content or safety concerns that need review.</p><Link href="/support" className="button button-primary">Open Support</Link></article><article><h2>For parents and guardians</h2><p>Explore the Family Centre controls and guidance currently being developed for linked family accounts.</p><Link href="/parental-controls" className="button button-secondary">Explore Family Centre</Link></article></div>
        </div></section>
      </div>
    </PageShell>
  );
}
