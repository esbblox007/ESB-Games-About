import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import NewsletterUnsubscribe from "@/components/NewsletterUnsubscribe";

export const metadata: Metadata = {
  title: "Unsubscribe from updates",
  description: "Manage your ESB Games email update subscription.",
  robots: { index: false, follow: false },
};

export default async function NewsletterUnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  return (
    <PageShell>
      <section className="newsletter-unsubscribe-page">
        <div className="newsletter-unsubscribe-card">
          <span className="eyebrow">Email preferences</span>
          <h1>Unsubscribe from ESB Games updates?</h1>
          <p>You can stop major ESB Games update emails at any time. This does not change essential account, security, support or transaction emails that may be required for services you use.</p>
          <div className="newsletter-unsubscribe-actions"><NewsletterUnsubscribe token={token} /><Link href="/" className="button button-secondary">Keep subscription</Link></div>
        </div>
      </section>
    </PageShell>
  );
}
