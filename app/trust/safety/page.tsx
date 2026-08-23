import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import ServicePathways from "@/components/ServicePathways";
import { ArrowIcon, ShieldIcon, UsersIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Safety Centre",
  description: "The canonical ESB Games Safety Centre for prevention, detection, reporting, enforcement, appeals and family-safety guidance.",
  alternates: { canonical: "/trust/safety" },
  openGraph: { title: "Safety Centre | ESB Games", description: "Prevention, reporting, enforcement, appeals and family-safety guidance for ESB Games.", url: "/trust/safety", type: "website" },
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
        <section className="safety-centre-hero"><div className="trust-container"><Link className="trust-back-link" href="/trust"><ArrowIcon size={15} /> Trust, Safety &amp; Legal</Link><span className="eyebrow">Safety Centre</span><h1>Safety designed into<br /><span className="gradient-text">the ecosystem.</span></h1><p>This is the canonical public safety hub for ESB Games. It explains the safety framework and where to report concerns; account-specific cases themselves are handled privately through Support.</p></div></section>
        <section className="safety-centre-content"><div className="trust-container">
          <ServicePathways current="trust" title="Safety guidance and private case handling are separate" />
          <div className="safety-pillar-grid">{pillars.map(([title, text], index) => <article key={title}><span>{index === 4 ? <UsersIcon /> : <ShieldIcon />}</span><h2>{title}</h2><p>{text}</p></article>)}</div>
          <div className="safety-coverage-card"><div><span className="eyebrow">What the framework covers</span><h2>A broad safety framework for play, creation and community.</h2><p>Detailed policy documents may still be in review. At a high level, ESB Games safety systems are intended to address areas including:</p></div><ul>{coverage.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div className="safety-action-grid"><article><h2>Report a concern</h2><p>Use Support when a specific account, item, message, transaction or safety concern needs authorised staff review. Safety and abuse cases can be restricted to authorised Trust &amp; Safety staff.</p><Link href="/support#contact-support" className="button button-primary">Open private Support</Link></article><article><h2>For parents and guardians</h2><p>Use Family Centre for linked-account and parental-control information. The Safety Centre explains the wider safety framework rather than managing a child account directly.</p><Link href="/parental-controls" className="button button-secondary">Explore Family Centre</Link></article></div>
        </div></section>
      </div>
    </PageShell>
  );
}
