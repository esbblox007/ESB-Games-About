import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";

const documents = {
  terms: { title: "Terms of Service", description: "The terms governing access to and use of ESB Games services." },
  privacy: { title: "Privacy Policy", description: "How ESB Games plans to collect, use and protect personal information." },
  "community-standards": { title: "Community Standards", description: "The standards designed to help keep ESB Games communities safe and welcoming." },
  cookies: { title: "Cookie Policy", description: "Information about cookies and similar technologies used by ESB Games websites." },
} as const;

type DocumentKey = keyof typeof documents;

export function generateStaticParams() {
  return Object.keys(documents).map((document) => ({ document }));
}

export async function generateMetadata({ params }: { params: Promise<{ document: string }> }): Promise<Metadata> {
  const { document } = await params;
  const item = documents[document as DocumentKey];
  return item ? { title: item.title, description: item.description, robots: { index: false, follow: true } } : { title: "Document not found", robots: { index: false, follow: false } };
}

export default async function LegalDocumentPage({ params }: { params: Promise<{ document: string }> }) {
  const { document } = await params;
  const item = documents[document as DocumentKey];
  if (!item) notFound();

  return (
    <PageShell>
      <main className="legal-page">
        <div className="legal-container">
          <span className="eyebrow">ESB Games Legal</span>
          <h1>{item.title}</h1>
          <p className="legal-intro">{item.description}</p>
          <section className="legal-review-card">
            <strong>Final management review in progress</strong>
            <p>The completed document is currently being reviewed by ESB Games management and will be published on this page before the relevant public services launch.</p>
            <p>This placeholder is not the final legal document and should not be treated as active terms or policy text.</p>
          </section>
          <p className="legal-contact">Questions about this document can be directed through the <a href="/support">ESB Games Support page</a>.</p>
        </div>
      </main>
    </PageShell>
  );
}
