import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { ArrowIcon, CheckIcon, ClockIcon, GlobeIcon, ShieldIcon, TicketIcon, UsersIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Family Centre",
  description: "ESB Family Centre explains parent and child account linking, adult verification, screen time, spending, communication and privacy controls.",
  alternates: { canonical: "/parental-controls" },
  openGraph: { title: "Family Centre | ESB Games", description: "Learn about ESB Games Family Centre: account linking, adult verification, parental controls, privacy and safer gaming.", url: "/parental-controls", type: "website", images: [{ url: "/og-preview", alt: "ESB Games Family Centre" }] },
  twitter: { card: "summary_large_image", title: "Family Centre | ESB Games", description: "Learn about ESB Games Family Centre: account linking, adult verification, parental controls, privacy and safer gaming.", images: ["/og-preview"] },
};

const features = [
  { icon: <ClockIcon />, tone: "purple", title: "Screen Time Controls", text: "Screen time settings are designed around daily limits, bedtimes and reminders that support healthier play habits." },
  { icon: <TicketIcon />, tone: "blue", title: "Spending Management", text: "Spending settings focus on budgets, purchase approvals and visibility into game-related purchases." },
  { icon: <UsersIcon />, tone: "teal", title: "Communication Controls", text: "Communication controls support the product's family-managed approach to privacy and social interaction." },
  { icon: <ShieldIcon />, tone: "purple", title: "Content & Privacy", text: "Content and privacy settings are designed to support age-appropriate experiences and account visibility." },
  { icon: <CheckIcon />, tone: "orange", title: "Approvals & Requests", text: "Family approvals describe the approach to account requests, spending and selected actions." },
  { icon: <GlobeIcon />, tone: "blue", title: "Activity Reports", text: "Activity reports are designed to help guardians understand account activity and family settings." },
] as const;

const linkingSteps = [
  ["1. Sign in to Family Centre", "A parent or guardian begins with an ESB Games account and the dedicated Family Centre."],
  ["2. Verify the adult account", "Adult verification is part of the Family Centre approach to protecting parental features."],
  ["3. Request a child account link", "The parent or guardian requests to link a child's ESB Games account to their family."],
  ["4. Confirm parental authority", "Parental authority and the required consent must be established before controls are enabled for a linked child."],
] as const;

function FamilyDashboardMockup() {
  return <div className="parental-product parental-concept-card" aria-label="Concept preview of the ESB Games Family Centre"><div className="parental-concept-heading"><ShieldIcon size={30}/><div><strong>Family Centre</strong><span>Illustrative Family Centre preview</span></div></div><div className="parental-concept-grid">{features.map((feature) => <article key={feature.title}><span className={`parental-feature-icon ${feature.tone}`}>{feature.icon}</span><div><strong>{feature.title}</strong><small>Family Centre</small></div></article>)}</div><p>This is an illustrative overview, not a live controls dashboard. ESB Games remains in pre-launch, undergoing final development and Quality Assurance testing.</p></div>;
}

export default function ParentalControlsPage() {
  return (
    <PageShell>
      <div className="parental-page">
        <section className="parental-hero"><div className="parental-container parental-hero-grid"><div className="parental-hero-copy"><Link href="/help" className="help-back-link"><ArrowIcon size={15} /> Back to Help</Link><span className="parental-eyebrow"><ShieldIcon size={15} /> ESB Family Centre · Pre-launch</span><h1>Family controls for<br /><span className="gradient-text">linked accounts.</span></h1><p>ESB Family Centre focuses on adult-verified family accounts, parent-child linking, parental controls and age-appropriate gaming. Trust &amp; Safety provides the wider safety framework.</p><div className="parental-actions"><a href="https://family.esbgames.com" className="button button-primary"><ShieldIcon size={17} /> Visit Family Centre</a><a href="#linking-steps" className="button button-secondary">Explore account linking <ArrowIcon size={16} /></a></div><div className="parental-trust-row"><span><ShieldIcon size={17} /> Privacy-focused design</span><span><CheckIcon size={17} /> Age-appropriate design</span><span><UsersIcon size={17} /> Parent-managed settings</span><span><UsersIcon size={17} /> Built for families</span></div></div><div className="parental-product-wrap"><span className="product-status-label">Illustrative Family Centre preview</span><FamilyDashboardMockup /></div></div></section>

        <section className="parental-feature-shell" id="parental-features"><div className="parental-container"><header className="parental-section-heading"><span className="eyebrow">Family Centre controls</span><h2>Family controls focused on what matters.</h2><p>Family Centre is a pre-launch product designed around linked accounts, privacy and safer gaming.</p></header><div className="parental-feature-grid">{features.map((feature) => <article key={feature.title}><span className={`parental-feature-icon ${feature.tone}`}>{feature.icon}</span><span className="trust-resource-status">Family Centre</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div></div></section>

        <section className="parental-linking-section" id="linking-steps"><div className="parental-container parental-linking-grid"><div className="parental-linking-copy"><span className="eyebrow">Family account linking</span><h2>How account linking is <span className="gradient-text">designed to work.</span></h2><p>Family linking is designed around adult verification, connecting a child's account and confirming parental authority and consent.</p><div className="parental-linking-actions"><a href="https://family.esbgames.com" className="button button-primary">Visit Family Centre</a><Link href="/support#contact-support" className="button button-secondary">Private family support</Link></div></div><div className="parental-step-grid">{linkingSteps.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

        <section className="parental-band-section"><div className="parental-container parental-band-grid"><article><span className="eyebrow">Family Centre overview</span><h3>One place for approvals, reports and family settings.</h3><p>The Family Centre dashboard is designed to bring family accounts, activity information and parental settings into one dedicated place.</p></article><article><span className="eyebrow">Need guidance or a case review?</span><h3>Use the right route.</h3><p>Help Centre covers common family tasks. Trust &amp; Safety explains safety rules and systems. Support is the private route for an account-specific issue that needs authorised staff.</p></article></div></section>

        <section className="parental-safety-band"><div className="parental-container"><div className="parental-safety-card"><span className="parental-safety-icon"><ShieldIcon size={31} /></span><div><h2>Family safety is broader than parental controls.</h2><p>Family Centre manages linked-account controls; Trust &amp; Safety explains prevention, reporting and enforcement across the wider ESB Games ecosystem.</p></div><Link href="/help/trust-safety" className="button button-secondary">Open Trust &amp; Safety <ArrowIcon size={16} /></Link></div></div></section>
      </div>
    </PageShell>
  );
}
