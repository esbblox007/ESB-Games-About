import Link from "next/link";
import Logo from "./Logo";

function SocialIcon({ label }: { label: string }) {
  const glyphs: Record<string, string> = {
    Discord: "◉",
    X: "𝕏",
    YouTube: "▶",
    Instagram: "◎",
    TikTok: "♪",
    GitHub: "◖◗",
  };
  return <span aria-hidden="true">{glyphs[label]}</span>;
}

export default function Footer() {
  return (
    <footer className="site-footer home-site-footer">
      <div className="home-footer-grid">
        <div className="home-footer-brand">
          <Logo />
          <p>The next-generation gaming universe - where players become creators and creators reach millions.</p>
          <div className="home-social-row">
            {["Discord", "X", "YouTube", "Instagram", "TikTok", "GitHub"].map((item) => (
              <a key={item} href="#" aria-label={item}><SocialIcon label={item}/></a>
            ))}
          </div>
        </div>
        <div><strong>PLATFORM</strong><Link href="/early-access">Games</Link><Link href="/developer-hub">Creators</Link><Link href="/subscriptions">Subscriptions</Link></div>
        <div><strong>COMPANY</strong><Link href="/about">About</Link><Link href="/careers">Careers</Link></div>
        <div><strong>SUPPORT</strong><Link href="/support">Help Center</Link><Link href="/support">Submit a Ticket</Link><Link href="/support">Safety &amp; Privacy</Link></div>
      </div>
      <div className="home-footer-bottom">
        <span>© {new Date().getFullYear()} ESB Games Ltd. All rights reserved. Crafted with <b>♥</b> for players.</span>
        <nav aria-label="Legal links"><a href="#terms">Terms</a><a href="#privacy">Privacy</a><a href="#standards">Community Standards</a><a href="#cookies">Cookies</a><a href="#accessibility">Accessibility</a></nav>
        <button type="button">🌐 English (US)⌄</button>
      </div>
    </footer>
  );
}
