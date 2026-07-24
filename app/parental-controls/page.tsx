import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { ClockIcon, ShieldIcon, UsersIcon } from "@/components/Icons";

export const metadata: Metadata = { title: "Parental Controls" };

export default function ParentalControlsPage() {
  return (
    <PageShell>
      <section className="page-banner family-banner">
        <div className="section-inner">
          <span className="eyebrow">FOR PARENTS AND GUARDIANS</span>
          <h1 className="page-title">Confidence for families.<br/><span className="gradient-text">Freedom to play.</span></h1>
          <p>ESB Games is being designed with clear family controls, age-appropriate experiences and transparent safety tools.</p>
          <div className="hero-actions family-actions"><Link href="/signup" className="button button-primary">Create a family account</Link><Link href="/support" className="button button-secondary">Visit support</Link></div>
        </div>
      </section>
      <section className="section">
        <div className="section-inner">
          <div className="grid-3">
            <article className="card"><span className="card-icon"><ClockIcon/></span><h3>Screen-time controls</h3><p>Set daily limits, approved hours and break reminders that suit your family.</p></article>
            <article className="card"><span className="card-icon"><UsersIcon/></span><h3>Communication settings</h3><p>Control who can message, call, invite or interact with a child&apos;s account.</p></article>
            <article className="card"><span className="card-icon"><ShieldIcon/></span><h3>Spending and content</h3><p>Review purchases, approve spending and manage access to experiences by age and rating.</p></article>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
