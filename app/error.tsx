"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="public-error-page" role="main">
      <div className="public-error-card">
        <span className="eyebrow">ESB Games</span>
        <h1>Content temporarily unavailable.</h1>
        <p>We couldn&apos;t load this section right now. Please try again shortly.</p>
        <div className="public-error-actions">
          <button className="button button-primary" type="button" onClick={reset}>Try again</button>
          <Link className="button button-secondary" href="/">Return home</Link>
        </div>
      </div>
    </div>
  );
}
