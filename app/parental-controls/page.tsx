import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { ArrowIcon, CheckIcon, ClockIcon, ShieldIcon, UsersIcon } from "@/components/Icons";

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

function FamilyDashboardMockup() {
  return (
    <div className="parental-product" aria-label="Preview of the ESB Games parental controls dashboard">
      <div className="parental-laptop">
        <div className="parental-laptop-screen">
          <aside>
            <strong>Parental Controls</strong>
            {['Overview', 'Screen Time', 'Spending', 'Communication', 'Content & Privacy', 'Approvals', 'Activity Log', 'Family Members'].map((item, index) => (
              <span className={index === 0 ? 'active' : ''} key={item}>{index === 0 ? '▣' : '○'} {item}</span>
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
        {['Screen Time', 'Spending', 'Communication', 'Content & Privacy', 'Approvals'].map((item, index) => (
          <div className="parental-phone-item" key={item}><span>{['◷', '▣', '▢', '◇', '✓'][index]}</span><b>{item}</b><em>›</em></div>
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
                <Link href="/signup" className="button button-primary"><ShieldIcon size={17} /> Explore Parental Controls</Link>
                <a href="#parental-features" className="button button-secondary">Learn More <ArrowIcon size={16} /></a>
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
            <h2>Everything you need to support your child&apos;s experience.</h2>
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
