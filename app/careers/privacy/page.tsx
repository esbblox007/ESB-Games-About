import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Careers Application Privacy Notice",
  description: "How ESB Games uses and protects personal information submitted through the Careers application process.",
  alternates: { canonical: "/careers/privacy" },
  robots: { index: true, follow: true },
  openGraph: { title: "Careers Application Privacy Notice | ESB Games", description: "How ESB Games uses and protects personal information submitted through Careers.", url: "/careers/privacy", type: "article" },
};

export default function CareersPrivacyPage() {
  return (
    <PageShell>
      <div className="policy-page">
        <header className="policy-hero"><div className="policy-container"><nav className="policy-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/careers">Careers</Link><span>/</span><span aria-current="page">Application privacy</span></nav><span className="page-eyebrow">Careers · Privacy</span><h1>Careers Application Privacy Notice</h1></div></header>
        <section className="policy-content-section"><div className="policy-container policy-document-card">
          <p><strong>ESB Games</strong> is responsible for personal information submitted through its Careers application process. Privacy questions can be sent to <a href="mailto:privacy@esbgames.com">privacy@esbgames.com</a> and recruitment questions to <a href="mailto:careers@esbgames.com">careers@esbgames.com</a>. The final main Privacy Policy will identify the confirmed legal controller details before public platform launch.</p>

          <h2>Information we collect</h2>
          <p>The application form may collect your name, email address, country, timezone, availability, relevant experience, application answers, portfolio or professional-profile links, and a CV or résumé. A published role may include additional role-specific questions. Technical records such as submission time, application version and security information may also be recorded to protect the application process.</p>

          <h2>Please avoid unnecessary sensitive information</h2>
          <p>Do not include passwords, one-time codes, payment-card information, medical information, criminal-history information or other unrelated sensitive information unless a later recruitment step specifically explains why that information is lawfully required. If a role legitimately requires additional screening, ESB Games should provide a separate notice at that point.</p>

          <h2>Why we use application information</h2>
          <p>We use it to receive and assess applications, communicate with applicants, arrange interviews or other recruitment steps, compare applicants with published role requirements, maintain recruitment records, prevent fraud or abuse of the hiring process, respond to questions, and establish or defend legal claims where necessary.</p>

          <h2>Lawful bases</h2>
          <p>Depending on the stage and jurisdiction, processing may be necessary to take steps at your request before entering an employment or other working arrangement, for ESB Games&apos; legitimate interests in operating a fair and secure recruitment process, or to comply with legal obligations. If we need consent for a genuinely optional use, that consent will be requested separately and can be withdrawn without affecting unrelated recruitment processing.</p>

          <h2>Who can access the information</h2>
          <p>Application files are stored privately. Access is limited to authorised staff who need the information for recruitment, interview, management, security or related administrative purposes. Infrastructure providers may process the information on ESB Games&apos; behalf for hosting, database, storage, email or security functions. Information may also be disclosed where required by law or to professional advisers where reasonably necessary.</p>

          <h2>International processing</h2>
          <p>Some infrastructure providers may process information in more than one country. Where a restricted international transfer requires safeguards, ESB Games will use an available lawful transfer mechanism. The main Privacy Policy will describe the approved production transfer framework once the controller and vendor register are finalised.</p>

          <h2>How long we keep applications</h2>
          <p>Applications are kept only for as long as reasonably needed for the recruitment process, follow-up, security, audit, legal obligations and potential recruitment disputes. Successful-candidate information may become part of a separate staff record. ESB Games is finalising an internal retention schedule rather than publishing an arbitrary retention period that the system does not yet enforce.</p>

          <h2>Application records and consent history</h2>
          <p>Applications are associated with the job version, application-form version and privacy-notice or acknowledgement version that were active when the application was submitted. This helps ESB Games show what an applicant was told at the time. The acknowledgement confirms that you have read the notice; it is not blanket consent for processing that relies on another lawful basis.</p>

          <h2>Automated processing</h2>
          <p>The Careers system may use technical validation, routing or workflow automation. ESB Games does not present those tools as a substitute for an appropriate human recruitment decision. If solely automated decision-making with legal or similarly significant effects is introduced, applicants will receive the additional information and rights required by applicable law.</p>

          <h2>Your rights</h2>
          <p>Depending on applicable law and the lawful basis used, you may have rights to access, correct, delete, restrict or object to processing of your personal information, and in some circumstances to receive portable information. Rights can have lawful exceptions. Contact <a href="mailto:privacy@esbgames.com">privacy@esbgames.com</a> to make a request. UK applicants may also complain to the Information Commissioner&apos;s Office.</p>

          <div className="policy-end-actions"><Link href="/careers" className="button button-secondary">Back to Careers</Link><a href="mailto:careers@esbgames.com" className="button button-primary">Contact Careers</a></div>
        </div></section>
      </div>
    </PageShell>
  );
}
