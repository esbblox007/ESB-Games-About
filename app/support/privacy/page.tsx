import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PolicyMarkdown from "@/components/PolicyMarkdown";
import { policyBySlug } from "@/lib/content/policies-data";

const notice = policyBySlug["support-privacy-notice"];

export const metadata: Metadata = {
  title: "Support Privacy Notice",
  description: "How ESB Games uses information submitted through private support tickets and support evidence.",
  alternates: { canonical: "/support/privacy" },
  robots: { index: false, follow: true },
  openGraph: { title: "Support Privacy Notice | ESB Games", description: "How ESB Games uses information submitted through private support tickets and support evidence.", url: "/support/privacy", type: "article" },
};

export default function SupportPrivacyPage() {
  return (
    <PageShell>
      <div className="policy-page">
        <header className="policy-hero"><div className="policy-container"><nav className="policy-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/support">Support</Link><span>/</span><span aria-current="page">Privacy</span></nav><span className="page-eyebrow">Support · Privacy</span><h1>Support Privacy Notice</h1></div></header>
        <section className="policy-content-section"><div className="policy-container policy-document-card">
          <div className="policy-review-banner" role="note"><strong>Phase 2 review notice</strong><p>This wording is being cross-checked against the live support workflow and main Privacy Policy. It explains the current private-ticket model but is not yet presented as the final platform-wide privacy notice.</p></div>
          <PolicyMarkdown markdown={notice.markdown} />
          <div className="policy-end-actions"><Link href="/support" className="button button-secondary">Back to Support</Link><a href="mailto:privacy@esbgames.com" className="button button-primary">Privacy question</a></div>
        </div></section>
      </div>
    </PageShell>
  );
}
