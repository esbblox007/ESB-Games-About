import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Account Security & Trusted Devices",
  description: "How ESB Games protects sign-ins, recognises trusted devices and uses essential account security cookies across connected ESB Games services.",
  alternates: { canonical: "https://about.esbgames.com/documentation/account-security-trusted-devices" },
};

export default function AccountSecurityTrustedDevicesPage() {
  return <PageShell><article className="news-article-page documentation-article-page">
    <header className="article-header"><div className="article-container article-header-inner">
      <nav className="article-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/documentation">Documentation</Link><span>/</span><span aria-current="page">Account security</span></nav>
      <span className="article-category">Documentation · Account security</span>
      <h1>Account Security &amp; Trusted Devices</h1>
      <p className="article-subtitle">How ESB Games protects your account when you move between connected ESB Games products.</p>
      <div className="article-meta"><span>ESB Games</span><span>Updated 13 September 2026</span><span>4 min read</span></div>
    </div></header>

    <div className="article-container article-content-layout">
      <aside className="article-side"><Link href="/documentation" className="article-back-link">← Back to Documentation</Link></aside>
      <div className="article-body">
        <div className="article-callout article-callout-info"><strong>One ESB Games account</strong><p>Connected ESB Games products are designed to use the same account. You should not need a separate password for each official ESB Games product.</p></div>

        <h2>Sign-in security</h2>
        <p>ESB Games may ask you to complete an additional security check when you open a product on a browser or device that has not previously been recognised for that account. Depending on the situation, this can include confirming your email address, entering a one-time verification code, completing two-factor authentication, or signing in again.</p>
        <p>Never share a verification code, password, recovery code or two-factor authentication code with another person. ESB Games staff should not ask you to send them one of these codes.</p>

        <h2>Trusted devices</h2>
        <p>After a successful security check, ESB Games can remember a browser or device as trusted for that account. This helps avoid unnecessary verification prompts while keeping unfamiliar sign-ins subject to additional checks.</p>
        <p>A trusted device is not permanent proof of identity. ESB Games can require verification again when a session expires, security-sensitive information changes, unusual activity is detected, or another security check is appropriate.</p>

        <h2>Essential account cookies</h2>
        <p>Official ESB Games websites use essential cookies to keep you signed in, maintain a secure session, protect requests against misuse, and recognise trusted browsers or devices. Because ESB Games products are connected, some account-security cookies may be available across trusted <strong>esbgames.com</strong> subdomains so the same account can be recognised between official ESB Games products.</p>
        <p>These essential security cookies are used to operate and protect your account. They are separate from optional analytics, personalisation or advertising technologies where those are offered.</p>

        <h2>IP address and security signals</h2>
        <p>Network information such as an IP address can be used as one of several signals for account security, abuse prevention and sign-in records. An IP address by itself is not treated as a password and is not sufficient on its own to prove who you are.</p>

        <h2>When you may be asked to verify again</h2>
        <ul><li>You use a new browser or device.</li><li>Your existing session is no longer valid.</li><li>An ESB Games product requires an additional first-use security check.</li><li>Your account or security settings have changed.</li><li>ESB Games detects activity that requires additional verification.</li></ul>

        <div className="article-callout article-callout-info"><strong>Only sign in on official ESB Games domains</strong><p>Before entering account details or a verification code, check that you are on an official ESB Games website using an <strong>esbgames.com</strong> domain or another domain clearly identified by ESB Games as official.</p></div>

        <p><Link className="button button-secondary" href="/trust">Visit the Trust Centre</Link></p>
      </div>
    </div>
  </article></PageShell>;
}
