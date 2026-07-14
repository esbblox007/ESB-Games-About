"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckIcon, RocketIcon } from "./Icons";

export default function EarlyAccessForm() {
  const params = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{type:"success"|"error"; text:string} | null>(null);
  const [interest, setInterest] = useState("Player");

  useEffect(() => {
    if (params.get("type") === "creator") setInterest("Creator");
    const plan = params.get("plan");
    if (plan) setInterest(`Subscription: ${plan[0].toUpperCase()}${plan.slice(1)}`);
  }, [params]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitting(true); setMessage(null);
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/early-access", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to join the waitlist.");
      const existing = JSON.parse(localStorage.getItem("esb-early-access") || "[]");
      localStorage.setItem("esb-early-access", JSON.stringify([{...data, joinedAt:new Date().toISOString()}, ...existing].slice(0,10)));
      setMessage({type:"success", text:"You’re on the list. We’ll send launch and testing updates to your email."});
      form.reset(); setInterest("Player");
    } catch (err) { setMessage({type:"error", text:err instanceof Error ? err.message : "Something went wrong."}); }
    finally { setSubmitting(false); }
  }

  return (
    <article className="early-card">
      <span className="eyebrow"><RocketIcon size={14}/> Early Access</span>
      <h2>Reserve your place</h2>
      <p>Join the waitlist for platform previews, creator testing and launch news.</p>
      <form className="early-form" onSubmit={submit}>
        <div className="field"><label htmlFor="ea-name">Name</label><input className="input" id="ea-name" name="name" required minLength={2}/></div>
        <div className="field"><label htmlFor="ea-email">Email address</label><input className="input" id="ea-email" name="email" type="email" required/></div>
        <div className="field"><label htmlFor="ea-interest">I&apos;m joining as a…</label><select className="input" id="ea-interest" name="interest" value={interest} onChange={(e)=>setInterest(e.target.value)}><option>Player</option><option>Creator</option><option>Community owner</option><option>Parent or guardian</option><option>Business or partner</option><option>Subscription: Member</option><option>Subscription: Pro</option><option>Subscription: Plus</option><option>Subscription: Max</option></select></div>
        <label style={{display:"flex",gap:9,alignItems:"flex-start",color:"#8e98b3",fontSize:12,lineHeight:1.5}}><input type="checkbox" name="consent" required style={{marginTop:3}}/> I agree to receive ESB Games early-access and launch emails. I can unsubscribe at any time.</label>
        <button className="button button-primary" disabled={submitting}>{submitting ? "Joining…" : "Join Early Access"}</button>
      </form>
      {message && <div className={`success-box ${message.type === "error" ? "error-box" : ""}`}>{message.text}</div>}
      <p className="fine-print">Your information is used only for ESB Games access and product updates. Configure Supabase and Resend to persist sign-ups and send confirmation emails.</p>
      <div className="benefit-row"><span className="card-icon"><CheckIcon size={18}/></span><div><strong>First access to testing</strong><p>Be considered for staged player and creator previews.</p></div></div>
      <div className="benefit-row"><span className="card-icon"><CheckIcon size={18}/></span><div><strong>Product updates</strong><p>Receive major development and launch announcements.</p></div></div>
    </article>
  );
}
