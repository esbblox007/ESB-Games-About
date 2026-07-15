import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SupportClient from "@/components/SupportClient";

export const metadata: Metadata = { title: "Support" };

export default function SupportPage() {
  return (
    <PageShell>
      <section className="hero hero-no-grid support-hero">
        <div className="hero-inner">
          <span className="eyebrow">Support</span>
          <h1 className="page-title">How can we <span className="gradient-text">help?</span></h1>
          <p className="hero-lead" style={{marginInline:"auto"}}>Browse help articles, submit a request or track an existing ticket.</p>
          <div className="trust-row"><span>◷ Target response under 4h</span><span>◉ Safety reports prioritised</span><span>◎ Global support vision</span></div>
        </div>
      </section>
      <section className="section section-dark" style={{paddingTop:50}}>
        <div className="section-inner">
          <SupportClient />
          <div className="support-bottom" id="quick-help">
            <article className="list-panel"><h3>Quick Help</h3><div className="quick-links"><a href="mailto:support@esbgames.com?subject=Password reset help">🔑 Reset your password</a><a href="mailto:support@esbgames.com?subject=Subscription help">↻ Cancel or change a subscription</a><a href="mailto:safety@esbgames.com?subject=Safety report">🛡 Report a safety concern</a><a href="/developer-hub">⌘ Creator and publishing support</a></div></article>
            <article className="list-panel"><div className="status-head"><h3>Platform Status</h3><span className="status-pill">● Pre-launch</span></div><div className="status-list"><div className="status-item"><span>Public platform</span><strong>In development</strong></div><div className="status-item"><span>ESB Studio</span><strong>In development</strong></div><div className="status-item"><span>Payments & billing</span><strong>Not live</strong></div><div className="status-item"><span>Support ticket API</span><strong>Ready to configure</strong></div></div></article>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
