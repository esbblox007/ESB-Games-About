import Link from "next/link";
import Logo from "./Logo";

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23 12.003c0-2.284-.204-3.577-.428-4.422a3.13 3.13 0 0 0-2.15-2.153C19.58 5.2 18.286 5 16.001 5H7.999C5.713 5 4.42 5.2 3.578 5.428A3.13 3.13 0 0 0 1.425 7.58C1.2 8.426 1 9.719 1 12.003c0 2.285.2 3.578.425 4.422a3.13 3.13 0 0 0 2.153 2.153C4.42 18.805 5.713 19 7.999 19h8.002c2.285 0 3.579-.195 4.42-.422a3.13 3.13 0 0 0 2.151-2.153c.224-.844.428-2.137.428-4.422ZM10 15.5v-7l6 3.5-6 3.5Z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.901 2H22l-6.767 7.734L23 22h-6.32l-4.948-7.697L4.995 22H1.894l7.238-8.274L1 2h6.48l4.472 7.081L18.901 2Zm-1.106 18h1.747L6.532 3.896H4.66L17.795 20Z"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M15.9 2c.48 2.81 2.15 4.67 5.1 4.86v3.12c-1.79.17-3.38-.42-4.91-1.37v6.37c0 4.7-5.1 7.64-9.17 5.2C2 17.57 2.7 10.5 8.6 9.6v3.29c-1.63.53-2.54 1.63-2.3 3.42.38 2.84 3.95 3.64 5.45 1.22.41-.66.64-1.52.64-2.81V2h3.51Z"/>
    </svg>
  );
}

const socials = [
  { label: "YouTube", href: "/", icon: <YouTubeIcon /> },
  { label: "Instagram", href: "/", icon: <InstagramIcon /> },
  { label: "X", href: "https://x.com/PlayESBGames", icon: <XIcon /> },
  { label: "TikTok", href: "https://www.tiktok.com/@esb.games", icon: <TikTokIcon /> },
] as const;

export default function Footer() {
  return (
    <footer className="site-footer home-site-footer">
      <div className="home-footer-grid">
        <div className="home-footer-brand">
          <Logo />
          <p>The next-generation gaming universe - where players become creators and creators reach millions.</p>
          <div className="home-social-row">
            {socials.map((item) => {
              const external = item.href.startsWith("http");
              return (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                >
                  {item.icon}
                </a>
              );
            })}
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
