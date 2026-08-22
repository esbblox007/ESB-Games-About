import Link from "next/link";

export default function NewsletterForm() {
  return (
    <div className="home-newsletter-form" aria-label="ESB Games update availability">
      <div className="home-newsletter-input-row">
        <Link className="button button-primary" href="/news">View News &amp; Updates</Link>
        <Link className="button button-secondary" href="/privacy-policy">Privacy information</Link>
      </div>
      <p className="newsletter-status" role="status">Email subscriptions will open after the public Privacy Policy and subscriber notice have completed final review.</p>
      <p className="newsletter-privacy">No newsletter email address is collected from this page while the public privacy documentation is still being finalised.</p>
    </div>
  );
}
