import Link from "next/link";
import Logo from "./Logo";
import LanguageSelector from "./LanguageSelector";
import { ESB_BRAND } from "@/lib/site-config";

function XIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.901 2H22l-6.767 7.734L23 22h-6.32l-4.948-7.697L4.995 22H1.894l7.238-8.274L1 2h6.48l4.472 7.081L18.901 2Zm-1.106 18h1.747L6.532 3.896H4.66L17.795 20Z"/></svg>;
}

function TikTokIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15.9 2c.48 2.81 2.15 4.67 5.1 4.86v3.12c-1.79.17-3.38-.42-4.91-1.37v6.37c0 4.7-5.1 7.64-9.17 5.2C2 17.57 2.7 10.5 8.6 9.6v3.29c-1.63.53-2.54 1.63-2.3 3.42.38 2.84 3.95 3.64 5.45 1.22.41-.66.64-1.52.64-2.81V2h3.51Z"/></svg>;
}

const socials = [
  { label: "X", href: "https://x.com/PlayESBGames", icon: <XIcon /> },
  { label: "TikTok", href: "https://www.tiktok.com/@esb.games", icon: <TikTokIcon /> },
] as const;

export default function Footer() {
  return (
    <footer className="site-footer home-site-footer">
      <div className="home-footer-grid">
        <div className="home-footer-brand">
          <Logo />
          <p>A connected gaming and creator ecosystem being built so people can {ESB_BRAND.taglineSentence}.</p>
          <div className="home-social-row">
            {socials.map((item) => <a key={item.label} href={item.href} aria-label={`${item.label} — ESB Games`} target="_blank" rel="noreferrer">{item.icon}</a>)}
          </div>
        </div>
        <div><strong>PLATFORM</strong><a href="https://esbgames.com">ESB Games</a><Link href="/developer-hub">Creator Hub</Link><Link href="/download">Downloads</Link><Link href="/subscriptions">Subscriptions</Link></div>
        <div><strong>COMPANY</strong><Link href="/about">About</Link><Link href="/news">News</Link><Link href="/documentation">Documentation</Link><Link href="/careers">Careers</Link><Link href="/trust">Trust, Safety &amp; Legal</Link></div>
        <div><strong>SUPPORT</strong><Link href="/support">Help Centre</Link><Link href="/support#contact-support">Contact Support</Link><Link href="/parental-controls">Family Centre</Link><a href={ESB_BRAND.statusUrl}>Service Status</a></div>
      </div>
      <div className="home-footer-bottom">
        <span>© {new Date().getFullYear()} ESB Games. All rights reserved. {ESB_BRAND.tagline}</span>
        <nav aria-label="Legal links"><Link href="/trust">Trust Centre</Link><Link href="/terms-of-service">Terms</Link><Link href="/privacy-policy">Privacy</Link><Link href="/community-standards">Community Standards</Link><Link href="/cookie-policy">Cookies</Link><Link href="/accessibility-statement">Accessibility</Link></nav>
        <LanguageSelector />
      </div>
    </footer>
  );
}
