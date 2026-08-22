import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { ArrowIcon, CheckIcon, ShieldIcon, UsersIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Family Centre",
  description: "Explore the Family Centre and the linked-account, spending, communication, privacy and activity controls being developed for ESB Games.",
  alternates: { canonical: "/parental-controls" },
  openGraph: { title: "Family Centre | ESB Games", description: "Explore the family safety and parental-control systems being developed for ESB Games.", url: "/parental-controls", type: "website", images: [{ url: "/hero-discover-platform.png", alt: "ESB Games Family Centre" }] },
  twitter: { card: "summary_large_image", title: "Family Centre | ESB Games", description: "Explore the family safety and parental-control systems being developed for ESB Games.", images: ["/hero-discover-platform.png"] },
};

const features = [
  { icon: "◷", tone: "purple", title: "Screen Time Controls", text: "Planned controls include daily limits, bedtimes and break reminders designed to support healthy play habits." },
  { icon: "▣", tone: "blue", title: "Spending Management", text: "Planned controls include monthly budgets, purchase approvals and clearer spending notifications." },
  { icon: "◎", tone: "teal", title: "Communication Controls", text: "Communication permissions and privacy settings are being designed for linked family accounts." },
  { icon: "◇", tone: "purple", title: "Content & Privacy", text: "Content and privacy controls are being developed to support age-appropriate experiences." },
  { icon: "✓", tone: "orange", title: "Approvals & Requests", text: "Approval flows are planned for selected requests, spending and account actions." },
  { icon: "⌁", tone: "blue", title: "Activity Reports", text: "Weekly reporting and activity visibility are being developed for supported family accounts." },
] as const;

const linkingSteps = [
  ["1. Open your child’s settings", "The intended flow starts from the child account settings and the Family section."],
  ["2. Add a parent email", "A parent or guardian email is planned to begin a secure linking request."],
  ["3. Create or log in to your parent account", "The planned flow then guides the parent or guardian through sign-in and identity confirmation."],
  ["4. Approve the link", "Once linking is available and approved, supported controls and reports can be managed from Family Centre."],
] as const;

function FamilyDashboardMockup() {
  return (
    <div className="parental-product" aria-label="ESB Games Family Centre dashboard concept">
      <div className="parental-laptop">
        <div className="parental-laptop-screen">
          <aside>
            <strong>Family Centre</strong>
            {["Overview", "Screen Time", "Spending", "Communication", "Content & Privacy", "Approvals", "Activity Log", "Family Members"].map((item, index) => (
              <span className={index === 0 ? "active" : ""} key={item}>{index === 0 ? "▣" : "○"} {item}</span>
            ))}
          </aside>
          <section>
            <header><b>Overview</b><small>Family Centre concept</small></header>
            <div className="parental-profile-row">
              <article className="parental-profile-card"><i>ES</i><div><strong>Child profile</strong><span>Linked account</span><small>Family Centre concept</small></div></article>
              <article><span>Screen Time</span><strong>Daily limit</strong><small>Parent-managed control</small><b className="mini-progress"><i /></b></article>
              <article><span>Spending</span><strong>Monthly limit</strong><small>Approval controls planned</small><b className="mini-progress purple"><i /></b></article>
            </div>
            <div className="parental-dashboard-lower">
              <article className="parental-activity-card"><strong>Recent Activity</strong><p><i className="activity-thumb one" /> <span><b>Experience activity</b><small>Example visibility</small></span></p><p><i className="activity-thumb two" /> <span><b>Play-time activity</b><small>Example visibility</small></span></p><p><i className="activity-thumb three" /> <span><b>Safety information</b><small>Example visibility</small></span></p></article>
              <article className="parental-quick-card"><strong>Quick Controls</strong><p><span>◷ <b>Screen Time</b><small>Daily limits planned</small></span><i className="toggle on" /></p><p><span>▣ <b>Spending Limit</b><small>Parent-managed limit</small></span><i className="toggle on" /></p><p><span>▢ <b>Chat &amp; Communication</b><small>Permission controls planned</small></span><em>›</em></p><p><span>◇ <b>Content Restrictions</b><small>Age-aware settings planned</small></span><em>›</em></p></article>
            </div>
          </section>
        </div>
        <div className="parental-laptop-base" />
      </div>
      <div className="parental-phone">
        <div className="parental-phone-notch" /><header><b>Family Centre</b></header>
        <div className="parental-phone-profile"><i>ES</i><span><b>Child profile</b><small>Family Centre concept</small></span></div>
        {["Screen Time", "Spending", "Communication", "Content & Privacy", "Approvals"].map((item, index) => <div className="parental-phone-item" key={item}><span>{["◷", "▣", "▢", "◇", "✓"][index]}</span><b>{item}</b><em>›</em></div>)}
        <nav><span className="active">▣<small>Overview</small></span><span>⌁<small>Activity</small></span><span>⚙<small>Settings</small></span></nav>
      </div>
    </div>
  );
}

export default function ParentalControlsPage() {
  return (
    <PageShell>
      <div className="parental-page">
        <section className="parental-hero">
          <div className="parental-container parental-hero-grid">
            <div className="parental-hero-copy">
              <span className="parental-eyebrow"><ShieldIcon size={15} /> Family Centre · In development</span>
              <h1>A safer universe<br />for <span className="gradient-text">every</span> player.</h1>
              <p>Family Centre is being designed to help parents and guardians manage screen time, spending, communication and account safety as ESB Games develops.</p>
              <div className="parental-actions"><a href="https://family.esbgames.com" className="button button-primary"><ShieldIcon size={17} /> Visit Family Centre</a><a href="#linking-steps" className="button button-secondary">View planned linking <ArrowIcon size={16} /></a></div>
              <div className="parental-trust-row"><span><ShieldIcon size={17} /> Privacy-focused design</span><span><CheckIcon size={17} /> Age-appropriate controls</span><span>◌ Parent-managed settings</span><span><UsersIcon size={17} /> Built for families</span></div>
            </div>
            <div className="parental-product-wrap"><span className="product-status-label">Family Centre · In development</span><FamilyDashboardMockup /></div>
          </div>
        </section>

        <section className="parental-feature-shell" id="parental-features"><div className="parental-container"><header className="parental-section-heading"><span className="eyebrow">Family tools</span><h2>Family controls being designed around what matters.</h2><p>Planned tools focus on clarity, age-appropriate settings and a simpler way for parents and guardians to stay involved.</p></header><div className="parental-feature-grid">{features.map((feature) => <article key={feature.title}><span className={`parental-feature-icon ${feature.tone}`}>{feature.icon}</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div></div></section>

        <section className="parental-linking-section" id="linking-steps"><div className="parental-container parental-linking-grid"><div className="parental-linking-copy"><span className="eyebrow">Planned parent and child account linking</span><h2>How account linking is <span className="gradient-text">designed to work.</span></h2><p>This is the intended Family Centre linking flow. Availability will expand as the linked-account controls complete testing.</p><div className="parental-linking-actions"><a href="https://family.esbgames.com" className="button button-primary">Visit Family Centre</a><Link href="/support" className="button button-secondary">Family support</Link></div></div><div className="parental-step-grid">{linkingSteps.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

        <section className="parental-band-section"><div className="parental-container parental-band-grid"><article><span className="eyebrow">Why Family Centre?</span><h3>One place for approvals, reports and family settings.</h3><p>The planned dashboard brings linked family members, recent activity and adjustable limits into one place.</p></article><article><span className="eyebrow">Need more help?</span><h3>We&apos;re here to support families.</h3><p>Support guidance for linking accounts and understanding family settings will be published before the controls launch.</p></article></div></section>

        <section className="parental-safety-band"><div className="parental-container"><div className="parental-safety-card"><span className="parental-safety-icon"><ShieldIcon size={31} /></span><div><h2>Family safety is our priority.</h2><p>ESB Games is being designed to support creativity and connection with age-appropriate safety, privacy and family controls.</p></div><Link href="/trust/safety" className="button button-secondary">Learn More About Safety <ArrowIcon size={16} /></Link></div></div></section>
      </div>
    </PageShell>
  );
}
