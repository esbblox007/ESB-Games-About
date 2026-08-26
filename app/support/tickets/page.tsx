import type { Metadata } from "next";
import Link from "next/link";
import SupportTicketsClient from "@/components/SupportTicketsClient";
import { ArrowIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Your Support Tickets",
  description: "Securely view support conversations linked to your ESB Games account.",
  alternates: { canonical: "/support/tickets" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function SupportTicketsPage() {
  return (
    <main id="main-content" className="support-account-app-shell" tabIndex={-1}>
      <section className="support-account-page support-account-app-page">
        <div className="support-page-container support-account-app-container">
          <header className="support-account-app-bar">
            <Link href="/support" className="support-account-app-back"><ArrowIcon size={14} /> Back to Support</Link>
            <span>ESB Games Support · Private account workspace</span>
          </header>
          <div className="support-account-page-head support-account-app-head">
            <span className="eyebrow">Private account support</span>
            <h1>Your support tickets</h1>
            <p>View and reply to support conversations linked to your signed-in ESB Games account.</p>
          </div>
          <SupportTicketsClient />
        </div>
      </section>
    </main>
  );
}
