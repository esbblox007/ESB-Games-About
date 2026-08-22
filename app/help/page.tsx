import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import HelpCentreBrowser from "@/components/HelpCentreBrowser";
import { ArrowIcon, SearchIcon } from "@/components/Icons";
import { helpFaqs, popularHelpArticles } from "@/lib/content/help-centre";

export const metadata: Metadata = {
  title: "Help Centre",
  description: "Search ESB Games help topics for Accounts, safety, payments, playing, Creator tools, Family Centre, privacy and technical support.",
  alternates: { canonical: "/help" },
};

export default function HelpCentrePage() {
  return (
    <PageShell>
      <div className="help-centre-page">
        <section className="help-centre-hero">
          <div className="help-centre-container">
            <div className="help-centre-hero-copy">
              <span className="eyebrow">ESB Games Help Centre</span>
              <h1>How can we <span className="gradient-text">help?</span></h1>
              <p>Search for answers, manage your Account, get help with purchases, learn about safety or contact the right ESB Games team.</p>
              <div className="help-quick-actions">
                <Link className="button button-secondary" href="/support/help/reset-password">Recover my Account</Link>
                <Link className="button button-secondary" href="/support#contact-support">Report a problem</Link>
                <a className="button button-secondary" href="https://status.esbgames.com" target="_blank" rel="noreferrer">Check service status</a>
                <Link className="button button-primary" href="/support#contact-support">Contact Support</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="help-centre-section">
          <div className="help-centre-container">
            <header className="help-section-heading"><span className="eyebrow">Browse all topics</span><h2>Start with the task you need to complete.</h2><p>Help is organised by outcome so you do not need to guess whether a problem belongs to Support, Safety, Privacy or another ESB Games team.</p></header>
            <HelpCentreBrowser />
          </div>
        </section>

        <section className="help-centre-section alt">
          <div className="help-centre-container">
            <header className="help-section-heading"><span className="eyebrow">Popular guides</span><h2>Common things people need help with.</h2><p>These guides connect directly to the practical support articles already available on the site.</p></header>
            <div className="help-popular-grid">
              {popularHelpArticles.map((article) => (
                <article className="help-popular-card" key={article.title}>
                  <span>{article.label}</span><h3>{article.title}</h3><p>{article.description}</p><Link href={article.href}>Open guide <ArrowIcon size={14} /></Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="help-centre-section">
          <div className="help-centre-container">
            <header className="help-section-heading"><span className="eyebrow">Frequently asked</span><h2>Quick answers.</h2><p>Short guidance for common questions, with specialist routes where the issue needs more than an article.</p></header>
            <div className="help-faq-list">
              {helpFaqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
            </div>
          </div>
        </section>

        <section className="help-contact-band">
          <div className="help-centre-container">
            <div className="help-contact-card">
              <div><span className="eyebrow">Still need help?</span><h2>Find the right contact route.</h2><p>Start a private support conversation and ESB Games will route the request using the category and details you provide.</p></div>
              <Link className="button button-primary" href="/support#contact-support"><SearchIcon size={17} /> Contact Support</Link>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
