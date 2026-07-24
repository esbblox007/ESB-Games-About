"use client";

import { FormEvent, useState } from "react";

const messages: Record<string, string> = {
  success: "You’re subscribed. We’ll send major ESB Games updates to this address.",
  exists: "You’re already subscribed with this email address.",
  invalid: "Enter a valid email address.",
  rate_limited: "Too many attempts. Please wait a moment and try again.",
  unavailable: "Subscriptions are temporarily unavailable. Please try again later.",
};

export default function NewsletterForm() {
  const [state, setState] = useState<"idle" | "loading" | keyof typeof messages>("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "loading") return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const email = String(form.get("email") || "").trim();
    const website = String(form.get("website") || "");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setState("invalid");
      return;
    }

    setState("loading");
    try {
      const locale = window.localStorage.getItem("esb-language") || "en";
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, website }),
      });
      const result = await response.json() as { status?: string };
      const next = result.status && result.status in messages ? result.status as keyof typeof messages : "unavailable";
      setState(next);
      if (next === "success") formElement.reset();
    } catch {
      setState("unavailable");
    }
  }

  const message = state !== "idle" && state !== "loading" ? messages[state] : "";
  const isSuccess = state === "success" || state === "exists";

  return (
    <form className="home-newsletter-form" onSubmit={submit} noValidate>
      <label className="sr-only" htmlFor="newsletter-email">Email address</label>
      <span className="newsletter-mail-icon" aria-hidden="true">✉</span>
      <input id="newsletter-email" type="email" name="email" placeholder="you@example.com" autoComplete="email" aria-describedby="newsletter-privacy newsletter-status" required />
      <input className="newsletter-honeypot" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button className="button button-primary" type="submit" disabled={state === "loading"}>{state === "loading" ? "Subscribing…" : "Subscribe"}</button>
      <p id="newsletter-status" className={`newsletter-status${isSuccess ? " success" : ""}`} role="status" aria-live="polite">{message}</p>
      <p id="newsletter-privacy" className="newsletter-privacy">By subscribing, you agree to receive major ESB Games updates. You can unsubscribe from any email.</p>
    </form>
  );
}
