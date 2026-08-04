import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "Accessibility", description: "Accessibility information for ESB Games websites and services.", robots: { index: false, follow: true } };

export default function AccessibilityPage() {
  return (
    <PageShell>
      <main className="legal-page">
        <div className="legal-container">
          <span className="eyebrow">Accessibility</span>
          <h1>Building ESB Games for more people.</h1>
          <p className="legal-intro">We are working to make ESB Games websites, account flows and products easier to use with keyboards, assistive technology and a wide range of devices.</p>
          <section className="legal-review-card">
            <strong>Accessibility statement under final review</strong>
            <p>The complete accessibility statement is being reviewed and will be published here before public launch.</p>
            <p>During development, accessibility issues can be raised through the <a href="/support">Support page</a>.</p>
          </section>
        </div>
      </main>
    </PageShell>
  );
}
