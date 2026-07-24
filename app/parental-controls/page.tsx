import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { ArrowIcon, CheckIcon, ShieldIcon, UsersIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Parental Controls",
  description: "Explore the family safety, spending, communication and activity controls being built for ESB Games.",
};

const features = [
  {
    icon: "◷",
    tone: "purple",
    title: "Screen Time Controls",
    text: "Set daily limits, bedtimes and break reminders that support healthy play habits.",
  },
  {
    icon: "▣",
    tone: "blue",
    title: "Spending Management",
    text: "Set monthly budgets, require purchase approval and receive clear spending notifications.",
  },
  {
    icon: "◎",
    tone: "teal",
    title: "Communication Controls",
    text: "Choose who your child can chat with and manage privacy settings in one place.",
  },
  {
    icon: "◇",
    tone: "purple",
    title: "Content & Privacy",
    text: "Filter experiences, block unsuitable content and customise safety levels by age.",
  },
  {
    icon: "✓",
    tone: "orange",
    title: "Approvals & Requests",
    text: "Review friend requests, spending, invitations and selected content before they proceed.",
  },
  {
    icon: "⌁",
    tone: "blue",
    title: "Activity Reports",
    text: "Receive clear weekly reports covering screen time, activity and platform interactions.",
  },
] as const;

const linkingSteps = [
  ["1. Open your child’s settings", "Log in to your child’s ESB Games account and open Settings, then go to Parental Controls."],
  ["2. Add a parent email", "Choose Add parent and enter the email address of the parent or guardian who will manage the account."],
  ["3. Create or log in to your parent account", "The parent will receive an email with instructions to sign in or create their ESB Games parent account."],
  ["4. Approve the link", "Once signed in, the parent confirms the request and can start managing limits, spending, approvals and reports."],
] as const;

function FamilyDashboardMockup() {
  return (
    <div className="parental-product" aria-label="Preview of the ESB Games parental controls dashboard">
      <div className="parental-laptop">
        <div className="parental-laptop-screen">
          <aside>
            <strong>Parental Controls</strong>
            {["Overview", "Screen Time", "Spending", "Communication", "Content & Privacy", "Approvals", "Activity Log", "Family Members"].map((item, index) => (
              <span className={index === 0 ? "active" : ""} key={item}>{index === 0 ? "▣" : "○"} {item}</span>
            ))}
          </aside>
          <section>
            <header><b>Overview</b><small>Updated just now</small></header>
            <div className="parental-profile-row">
              <article className="parental-profile-card"><i>ES</i><div><strong>Alex</strong><span>Age 10</span><small>Member since 2026</small></div></article>
              <article><span>Screen Time</span><strong>1h 45m</strong><small>of 2h allowed</small><b className="mini-progress"><i /></b></article>
              <article><span>Spending</span><strong>1,150</strong><small>of 5,000 ESBucks</small><b className="mini-progress purple"><i /></b></article>
            </div>
            <div className="parental-dashboard-lower">
              <article className="parental-activity-card">
                <strong>Recent Activity</strong>
                <p><i className="activity-thumb one" /> <span><b>BuildWithNova</b><small>Played · 35m ago</small></span></p>
                <p><i className="activity-thumb two" /> <span><b>Island Tycoon</b><small>Played · 1h ago</small></span></p>
                <p><i className="activity-thumb three" /> <span><b>Space Adventure</b><small>Played · 4h ago</small></span></p>
              </article>
              <article className="parental-quick-card">
                <strong>Quick Controls</strong>
                <p><span>◷ <b>Screen Time</b><small>Limited to 2h per day</small></span><i className="toggle on" /></p>
                <p><span>▣ <b>Spending Limit</b><small>500 ESBucks per month</small></span><i className="toggle on" /></p>
                <p><span>▢ <b>Chat & Communication</b><small>Friends only</small></span><em>›</em></p>
                <p><span>◇ <b>Content Restrictions</b><small>Moderate</small></span><em>›</em></p>
              </article>
            </div>
          </section>
        </div>
        <div className="parental-laptop-base" />
      </div>

      <div className="parental-phone">
        <div className="parental-phone-notch" />
        <header><b>Parental Controls</b></header>
        <div className="parental-phone-profile"><i>ES</i><span><b>Alex</b><small>Age 10</small></span></div>
        {["Screen Time", "Spending", "Communication", "Content & Privacy", "Approvals"].map((item, index) => (
          <div className="parental-phone-item" key={item}><span>{["◷", "▣", "▢", "◇", "✓"][index]}</span><b>{item}</b><em>›</em></div>
        ))}
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
              <span className="parental-eyebrow"><ShieldIcon size={15} /> Parental Controls</span>
              <h1>A safer universe<br />for <span className="gradient-text">every</span> player.</h1>
              <p>Powerful tools for parents and guardians to manage screen time, control spending and help young players stay safe while they play, create and connect.</p>
              <div className="parental-actions">
                <a href="https://family.esbgames.com" className="button button-primary"><ShieldIcon size={17} /> Open Family Centre</a>
                <a href="#linking-steps" className="button button-secondary">How linking works <ArrowIcon size={16} /></a>
              </div>
              <div className="parental-trust-row">
                <span><ShieldIcon size={17} /> Privacy First</span>
                <span><CheckIcon size={17} /> COPPA Ready</span>
                <span>◌ GDPR Aligned</span>
                <span><UsersIcon size={17} /> Built for Families</span>
              </div>
            </div>
            <FamilyDashboardMockup />
          </div>
        </section>

        <section className="parental-feature-shell" id="parental-features">
          <div className="parental-container">
            <header className="parental-section-heading">
              <span className="eyebrow">Family tools</span>
              <h2>Everything you need to support your child&apos;s experience.</h2>
              <p>Designed to give parents and guardians more clarity, more control and a simpler way to stay involved.</p>
            </header>
            <div className="parental-feature-grid">
              {features.map((feature) => (
                <article key={feature.title}>
                  <span className={`parental-feature-icon ${feature.tone}`}>{feature.icon}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="parental-linking-section" id="linking-steps">
          <div className="parental-container parental-linking-grid">
            <div className="parental-linking-copy">
              <span className="eyebrow">Link parent and child accounts</span>
              <h2>How account linking <span className="gradient-text">works.</span></h2>
              <p>Parents manage controls through the ESB Games Family Centre. Once linked, they can review requests, manage limits and receive reports for the connected child account.</p>
              <div className="parental-linking-actions">
                <a href="https://family.esbgames.com" className="button button-primary">Go to family.esbgames.com</a>
                <Link href="/support" className="button button-secondary">Get setup help</Link>
              </div>
            </div>
            <div className="parental-step-grid">
              {linkingSteps.map(([title, text]) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="parental-band-section">
          <div className="parental-container parental-band-grid">
            <article>
              <span className="eyebrow">Why use Family Centre?</span>
              <h3>One place for approvals, reports and family settings.</h3>
              <p>Parents can manage multiple family members, review recent activity and update limits as their child grows.</p>
            </article>
            <article>
              <span className="eyebrow">Need more help?</span>
              <h3>We&apos;re here to support families.</h3>
              <p>If you need help linking an account or understanding any setting, our support team can guide you through it.</p>
            </article>
          </div>
        </section>

        <section className="parental-safety-band">
          <div className="parental-container">
            <div className="parental-safety-card">
              <span className="parental-safety-icon"><ShieldIcon size={31} /></span>
              <div><h2>Family safety is our priority.</h2><p>ESB Games is being designed to support creativity and connection in a safe, positive environment for players of every age.</p></div>
              <Link href="/support" className="button button-secondary">Learn More About Safety <ArrowIcon size={16} /></Link>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
