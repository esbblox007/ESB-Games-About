import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { AppealIcon, ArrowIcon, DetectionIcon, EnforcementIcon, PrivacyIcon, ShieldIcon, UsersIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Safety Centre",
  description: "Learn about the prevention, detection, enforcement, appeals and family-safety principles being built into ESB Games.",
  alternates: { canonical: "/trust/safety" },
  openGraph: {
    title: "Safety Centre | ESB Games",
    description: "Prevention, detection, enforcement, appeals and family-safety principles for the ESB Games ecosystem.",
    url: "/trust/safety",
    type: "website",
    images: [{ url: "/hero-discover-platform.png", alt: "ESB Games Safety Centre" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Safety Centre | ESB Games",
    description: "Prevention, detection, enforcement, appeals and family-safety principles for the ESB Games ecosystem.",
    images: ["/hero-discover-platform.png"],
  },
};

const pillars = [
  { title: "Prevention", text: "Age-appropriate systems, privacy controls and safer product design are being considered as the platform is built.", icon: <ShieldIcon /> },
  { title: "Detection", text: "Reports, automated systems and appropriately authorised human review are intended to help identify harmful content and behaviour.", icon: <DetectionIcon /> },
  { title: "Enforcement", text: "Warnings, restrictions, content removal and account action are planned to scale with the severity and context of a violation.", icon: <EnforcementIcon /> },
  { title: "Appeals", text: "Eligible moderation decisions will be able to be challenged and reviewed through a documented appeals process.", icon: <AppealIcon /> },
  { title: "Parents & families", text: "Family Centre and parental tools are being designed to help guardians manage age-appropriate experiences, communication and spending.", icon: <UsersIcon /> },
] as const;

const coverage = ["Child safety", "Harassment", "Scams", "Privacy", "Dangerous content", "Hate", "Self-harm safety", "Exploitation", "Intellectual property", "Cheating & exploits", "Creator responsibilities", "Groups", "Messaging", "Voice", "Events", "Marketplace activity"];

export default function SafetyCentrePage() {
  return (
    <PageShell>
      <div className="safety-centre-page">
        <section className="safety-centre-hero"><div className="trust-container"><Link className="trust-back-link" href="/trust"><ArrowIcon size={15} /> Trust, Safety &amp; Legal</Link><span className="eyebrow">Safety Centre · Pre-launch</span><h1>Safety designed into<br /><span className="gradient-text">the ecosystem.</span></h1><p>ESB Games is building safety systems alongside the platform rather than treating them as an afterthought. Some controls remain in development and will continue to change through testing.</p></div></section>
        <section className="safety-centre-content"><div className="trust-container">
          <div className="safety-pillar-grid">{pillars.map((pillar) => <article key={pillar.title}><span>{pillar.icon}</span><h2>{pillar.title}</h2><p>{pillar.text}</p></article>)}</div>
          <div className="safety-coverage-card"><div><span className="eyebrow"><PrivacyIcon size={15} /> What the rules are designed to cover</span><h2>A broad safety framework for play, creation and community.</h2><p>The final Community Standards and enforcement documents are still being prepared. At a high level, ESB Games rules are intended to address areas including:</p></div><ul>{coverage.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div className="safety-action-grid"><article><h2>Report a concern</h2><p>Use the private Support flow for account, content or safety concerns that need review.</p><Link href="/support" className="button button-primary">Open Support</Link></article><article><h2>For parents and guardians</h2><p>Explore the Family Centre controls and guidance currently being developed for linked family accounts.</p><Link href="/parental-controls" className="button button-secondary">Explore Family Centre</Link></article></div>
        </div></section>
      </div>
    </PageShell>
  );
}
