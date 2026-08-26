import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SupportTicketsClient from "@/components/SupportTicketsClient";
import { ArrowIcon, ShieldIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Your Support Tickets",
  description: "Securely view support conversations available to your ESB Games support session.",
  alternates: { canonical: "/support/tickets" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function SupportTicketsPage() {
  return (
    <PageShell>
      <section className="support-account-page">
        <div className="support-page-container">
          <div className="support-account-page-head">
            <Link href="/support" className="help-back-link"><ArrowIcon size={15} /> Back to Support</Link>
            <span className="eyebrow">Private account support</span>
            <h1>Your support <span className="gradient-text">tickets.</span></h1>
            <p>View and reply to support conversations available to your signed-in ESB Games account or verified email support session.</p>
            <div className="support-account-security-note"><ShieldIcon size={16} /><span>Only support tickets authorised for your current secure session are returned.</span></div>
          </div>
          <SupportTicketsClient />
        </div>
      </section>
    </PageShell>
  );
}
