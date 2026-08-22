"use client";

import { useState } from "react";

const messages = {
  success: "You’ve been unsubscribed from ESB Games updates.",
  already_unsubscribed: "This email is already unsubscribed from ESB Games updates.",
  invalid: "This unsubscribe link is invalid or no longer available.",
  rate_limited: "Too many attempts. Please wait a moment and try again.",
  unavailable: "We couldn’t update your subscription right now. Please try again later.",
} as const;

type State = "idle" | "loading" | keyof typeof messages;

export default function NewsletterUnsubscribe({ token }: { token: string }) {
  const [state, setState] = useState<State>(token ? "idle" : "invalid");

  async function unsubscribe() {
    if (!token || state === "loading") return;
    setState("loading");
    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const body = await response.json() as { status?: string };
      const next = body.status && body.status in messages ? body.status as keyof typeof messages : "unavailable";
      setState(next);
    } catch {
      setState("unavailable");
    }
  }

  const complete = state === "success" || state === "already_unsubscribed";
  const error = state === "invalid" || state === "rate_limited" || state === "unavailable";

  return (
    <>
      {!complete && <button className="button button-primary" type="button" onClick={unsubscribe} disabled={state === "loading" || !token}>{state === "loading" ? "Updating…" : "Unsubscribe"}</button>}
      {state !== "idle" && state !== "loading" && <p className={`newsletter-unsubscribe-message ${complete ? "success" : error ? "error" : ""}`} role="status">{messages[state]}</p>}
    </>
  );
}
