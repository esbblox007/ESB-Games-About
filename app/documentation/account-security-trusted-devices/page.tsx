import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Account Security & Trusted Devices",
  description: "How ESB Games protects sign-ins, recognises trusted browsers and devices, and uses essential account security cookies across connected ESB Games services.",
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

        <h2>Trusted browsers and devices</h2>
        <p>After a successful security check, ESB Games can remember the specific browser or device used for that account. Recognition is based on secure account-session and trusted-browser data stored for that browser or device, not on the household or network IP address.</p>
        <p>This means another device connected to the same home, school, workplace or public network is not automatically treated as trusted simply because it uses the same internet connection.</p>
        <p>A trusted browser or device is not permanent proof of identity. ESB Games can require verification again when a session expires, security-sensitive information changes, unusual activity is detected, browser data is cleared, or another security check is appropriate.</p>

        <h2>Essential account cookies</h2>
        <p>Official ESB Games websites use essential cookies and browser storage to keep you signed in, maintain a secure session, protect requests against misuse, and recognise a previously verified browser or device. Because ESB Games products are connected, some account-security cookies may be available across trusted <strong>esbgames.com</strong> subdomains so the same account can be recognised between official ESB Games products.</p>
        <p>These essential security cookies are used to operate and protect your account. They are separate from optional analytics, personalisation or advertising technologies where those are offered.</p>

        <h2>Network information</h2>
        <p>Like other online services, ESB Games servers can receive network information such as the public IP address used to make a request. This may be retained where necessary for security, abuse prevention, rate limiting or operational logs, but an IP address is not used as the trusted-device credential and does not make another device trusted.</p>
        <div className="article-callout article-callout-info"><strong>No “device IP” is used for trust</strong><p>There is no special device IP that reliably identifies one physical device on the web. ESB Games instead relies on browser- and device-specific session or trusted-device information, together with account verification when required.</p></div>

        <h2>When you may be asked to verify again</h2>
        <ul><li>You use a new browser or device.</li><li>Your existing session is no longer valid.</li><li>You clear the browser data used to remember a trusted sign-in.</li><li>An ESB Games product requires an additional first-use security check.</li><li>Your account or security settings have changed.</li><li>ESB Games detects activity that requires additional verification.</li></ul>

        <div className="article-callout article-callout-info"><strong>Only sign in on official ESB Games domains</strong><p>Before entering account details or a verification code, check that you are on an official ESB Games website using an <strong>esbgames.com</strong> domain or another domain clearly identified by ESB Games as official.</p></div>

        <p><Link className="button button-secondary" href="/trust">Visit the Trust Centre</Link></p>
      </div>
    </div>
  </article></PageShell>;
}
