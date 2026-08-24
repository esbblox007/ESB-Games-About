import type { Metadata } from "next";
import Link from "next/link";
import EnforcementAppealClient from "@/components/EnforcementAppealClient";
import PageShell from "@/components/PageShell";
import { ArrowIcon, ShieldIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Appeal an Enforcement Action",
  description: "Request an ESB Games review of a warning, restriction, suspension, ban, content removal or other enforcement action.",
  alternates: { canonical: "/support/appeal" },
};

export default function EnforcementAppealPage() {
  return (
    <PageShell>
      <section className="support-page-hero">
        <div className="support-page-container">
          <Link href="/support" className="help-back-link"><ArrowIcon size={15} /> Back to Support</Link>
          <span className="eyebrow">Trust & Safety review</span>
          <h1>Appeal an <span className="gradient-text">enforcement action.</span></h1>
          <p>If you believe an ESB Games warning, restriction, suspension, ban, content removal or other disciplinary action should be reconsidered, submit the details below for review.</p>
          <div className="support-page-trust"><span><ShieldIcon size={15} /> Private review</span><span>One appeal per active action is recommended</span><span>Submitting an appeal does not automatically reverse an action</span></div>
        </div>
      </section>

      <section className="support-page-section support-page-main">
        <div className="support-page-container">
          <article className="support-quick-panel">
            <div className="support-panel-heading">
              <span>Enforcement appeal</span>
              <h2>Request a review</h2>
              <p>Permanent bans do not prevent access to this appeal form. If you are signed in, your ESB Games account and linked email are attached automatically; otherwise you can continue with a verified email address.</p>
            </div>
            <EnforcementAppealClient />
          </article>
        </div>
      </section>
    </PageShell>
  );
}
