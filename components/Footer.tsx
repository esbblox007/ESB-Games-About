import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <Logo />
          <p className="footer-blurb">A creator-first gaming ecosystem where people can play, build and connect.</p>
        </div>
        <div><strong>Platform</strong><Link href="/">Home</Link><Link href="/developer-hub">Developer Hub</Link><Link href="/subscriptions">Subscriptions</Link></div>
        <div><strong>Company</strong><Link href="/about">About</Link><Link href="/careers">Careers</Link><Link href="/early-access">Early Access</Link></div>
        <div><strong>Help</strong><Link href="/support">Support</Link><a href="mailto:support@esbgames.com">Contact</a><a href="#privacy">Privacy</a></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} ESB Games. All rights reserved.</span><span>Built for about.esbgames.com</span></div>
    </footer>
  );
}
