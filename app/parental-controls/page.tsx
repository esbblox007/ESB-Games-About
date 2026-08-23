import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import ServicePathways from "@/components/ServicePathways";
import { ArrowIcon, CheckIcon, ClockIcon, GlobeIcon, ShieldIcon, TicketIcon, UsersIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Family Centre",
  description: "Explore linked-account and parental-control features being developed for ESB Games. Safety guidance lives in Safety Centre and private cases belong in Support.",
  alternates: { canonical: "/parental-controls" },
  openGraph: { title: "Family Centre | ESB Games", description: "Explore the family safety and parental-control systems being developed for ESB Games.", url: "/parental-controls", type: "website", images: [{ url: "/hero-discover-platform.png", alt: "ESB Games Family Centre" }] },
  twitter: { card: "summary_large_image", title: "Family Centre | ESB Games", description: "Explore the family safety and parental-control systems being developed for ESB Games.", images: ["/hero-discover-platform.png"] },
};

const features = [
  { icon: <ClockIcon />, tone: "purple", title: "Screen Time Controls", text: "Planned controls include daily limits, bedtimes and break reminders designed to support healthy play habits." },
  { icon: <TicketIcon />, tone: "blue", title: "Spending Management", text: "Planned controls include monthly budgets, purchase approvals and clearer spending notifications." },
  { icon: <UsersIcon />, tone: "teal", title: "Communication Controls", text: "Communication permissions and privacy settings are being designed for linked family accounts." },
  { icon: <ShieldIcon />, tone: "purple", title: "Content & Privacy", text: "Content and privacy controls are being developed to support age-appropriate experiences." },
  { icon: <CheckIcon />, tone: "orange", title: "Approvals & Requests", text: "Approval flows are planned for selected requests, spending and account actions." },
  { icon: <GlobeIcon />, tone: "blue", title: "Activity Reports", text: "Weekly reporting and activity visibility are being developed for supported family accounts." },
] as const;

const linkingSteps = [
  ["1. Open your child’s settings", "The intended flow starts from the child account settings and the Family section."],
  ["2. Add a parent email", "A parent or guardian email is planned to begin a secure linking request."],
  ["3. Create or log in to your parent account", "The planned flow then guides the parent or guardian through sign-in and identity confirmation."],
  ["4. Approve the link", "Once linking is available and approved, supported controls and reports can be managed from Family Centre."],
] as const;

function FamilyDashboardMockup() {
  return <div className="parental-product parental-concept-card" aria-label="Concept preview of the ESB Games Family Centre"><div className="parental-concept-heading"><ShieldIcon size={30}/><div><strong>Family Centre</strong><span>Concept preview · In development</span></div></div><div className="parental-concept-grid">{features.map((feature) => <article key={feature.title}><span className={`parental-feature-icon ${feature.tone}`}>{feature.icon}</span><div><strong>{feature.title}</strong><small>Planned / in development</small></div></article>)}</div><p>This preview illustrates the direction of Family Centre. Controls shown here should not be interpreted as currently available until they are marked as released.</p></div>;
}

export default function ParentalControlsPage() {
  return (
    <PageShell>
      <div className="parental-page">
        <section className="parental-hero"><div className="parental-container parental-hero-grid"><div className="parental-hero-copy"><span className="parental-eyebrow"><ShieldIcon size={15} /> Family Centre · In development</span><h1>Family controls for<br /><span className="gradient-text">linked accounts.</span></h1><p>Family Centre is the product area for parental controls and linked-account management. Safety Centre explains the wider safety framework, while Support handles private family cases that need authorised staff.</p><div className="parental-actions"><a href="https://family.esbgames.com" className="button button-primary"><ShieldIcon size={17} /> Visit Family Centre</a><a href="#linking-steps" className="button button-secondary">View planned linking <ArrowIcon size={16} /></a></div><div className="parental-trust-row"><span><ShieldIcon size={17} /> Privacy-focused design</span><span><CheckIcon size={17} /> Age-aware design direction</span><span><UsersIcon size={17} /> Parent-managed settings planned</span><span><UsersIcon size={17} /> Built for families</span></div></div><div className="parental-product-wrap"><span className="product-status-label">Concept preview · In development</span><FamilyDashboardMockup /></div></div></section>

        <div className="parental-container service-pathways-wrap"><ServicePathways current="family" title="Family controls, safety guidance and support are separate" /></div>

        <section className="parental-feature-shell" id="parental-features"><div className="parental-container"><header className="parental-section-heading"><span className="eyebrow">Family tools · Planned / in development</span><h2>Family controls being designed around what matters.</h2><p>These capabilities describe the current product direction, not a promise that every control is publicly available today.</p></header><div className="parental-feature-grid">{features.map((feature) => <article key={feature.title}><span className={`parental-feature-icon ${feature.tone}`}>{feature.icon}</span><span className="trust-resource-status">Planned / in development</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div></div></section>

        <section className="parental-linking-section" id="linking-steps"><div className="parental-container parental-linking-grid"><div className="parental-linking-copy"><span className="eyebrow">Planned parent and child account linking</span><h2>How account linking is <span className="gradient-text">designed to work.</span></h2><p>This is the intended Family Centre linking flow. Availability will expand as the linked-account controls complete testing.</p><div className="parental-linking-actions"><a href="https://family.esbgames.com" className="button button-primary">Visit Family Centre</a><Link href="/support#contact-support" className="button button-secondary">Private family support</Link></div></div><div className="parental-step-grid">{linkingSteps.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

        <section className="parental-band-section"><div className="parental-container parental-band-grid"><article><span className="eyebrow">Product direction</span><h3>One place for approvals, reports and family settings.</h3><p>The planned dashboard brings linked family members, recent activity and adjustable limits into one place. Individual capabilities will be labelled when they become available.</p></article><article><span className="eyebrow">Need guidance or a case review?</span><h3>Use the right route.</h3><p>Help Centre covers common family tasks. Safety Centre explains safety rules and systems. Support is the private route for an account-specific issue that needs authorised staff.</p></article></div></section>

        <section className="parental-safety-band"><div className="parental-container"><div className="parental-safety-card"><span className="parental-safety-icon"><ShieldIcon size={31} /></span><div><h2>Family safety is broader than parental controls.</h2><p>Family Centre manages linked-account controls; the Safety Centre explains prevention, reporting and enforcement across the wider ESB Games ecosystem.</p></div><Link href="/trust/safety" className="button button-secondary">Open Safety Centre <ArrowIcon size={16} /></Link></div></div></section>
      </div>
    </PageShell>
  );
}
