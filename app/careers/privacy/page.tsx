import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Careers Application Privacy Notice",
  description: "How ESB Games handles information submitted through the Careers application process.",
  alternates: { canonical: "/careers/privacy" },
  robots: { index: true, follow: true },
  openGraph: { title: "Careers Application Privacy Notice | ESB Games", description: "How ESB Games handles information submitted through Careers.", url: "/careers/privacy", type: "article" },
};

export default function CareersPrivacyPage() {
  return (
    <PageShell>
      <div className="policy-page">
        <header className="policy-hero"><div className="policy-container"><nav className="policy-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/careers">Careers</Link><span>/</span><span aria-current="page">Application privacy</span></nav><span className="page-eyebrow">Careers · Privacy</span><h1>Careers Application Privacy Notice</h1></div></header>
        <section className="policy-content-section"><div className="policy-container policy-document-card">
          <p>This notice explains how information submitted through the ESB Games Careers application process is used. It applies to the Careers application form and recruitment workspace; it does not replace the wider ESB Games Privacy Policy.</p>
          <h2>Information you submit</h2>
          <p>The application form may collect your name, email address, country, timezone, availability, relevant experience, application answers, portfolio or professional profile links, and a CV or résumé. A published role may include additional role-specific questions.</p>
          <h2>How the information is used</h2>
          <p>ESB Games uses Careers application information to receive and assess applications, communicate with applicants, arrange recruitment steps, maintain recruitment records, protect the integrity of the hiring process, and respond to recruitment-related questions.</p>
          <h2>Files and access</h2>
          <p>Application files are stored privately. Access is limited to authorised staff who need the information for recruitment or related administrative and security purposes.</p>
          <h2>Application records</h2>
          <p>Applications are associated with the job version, application form version and privacy-consent version that were active when the application was submitted. This helps ESB Games keep an accurate record of what an applicant was shown and accepted.</p>
          <h2>Your choices and questions</h2>
          <p>Do not include passwords, payment-card information or unrelated sensitive information in an application. If you need help with an application or have a question about recruitment information, contact the Careers team or ESB Games Support.</p>
          <div className="policy-end-actions"><Link href="/careers" className="button button-secondary">Back to Careers</Link><a href="mailto:careers@esbgames.com" className="button button-primary">Contact Careers</a></div>
        </div></section>
      </div>
    </PageShell>
  );
}
