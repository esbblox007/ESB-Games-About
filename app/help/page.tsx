import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ServicePathways from "@/components/ServicePathways";

export const metadata: Metadata = {
  title: "Help",
  description: "Choose between the ESB Games Help Centre, private Support, Trust & Safety guidance and Family Centre.",
  alternates: { canonical: "/help" },
};

export default function HelpPage() {
  return (
    <PageShell>
      <div className="help-hub-page">
        <section className="help-hub-hero">
          <div className="help-hub-container">
            <span className="eyebrow">ESB Games Help</span>
            <h1>What do you need help with?</h1>
            <p>Choose one area below. The next page focuses only on that area, without repeating this menu.</p>
          </div>
        </section>
        <div className="help-hub-container help-hub-pathways"><ServicePathways title="Choose an area" /></div>
      </div>
    </PageShell>
  );
}
