"use client";

import { FormEvent, useState } from "react";
import { BookIcon, CloseIcon, SearchIcon, TicketIcon } from "./Icons";

type Ticket = {
  id: string;
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
};

function getLocalTickets(): Ticket[] {
  try { return JSON.parse(localStorage.getItem("esb-support-tickets") || "[]"); }
  catch { return []; }
}

export default function SupportClient() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [trackId, setTrackId] = useState("");
  const [tracked, setTracked] = useState<Ticket | null>(null);

  async function submitTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitting(true); setError(null); setResult(null);
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/support", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to submit your ticket.");
      const ticket: Ticket = { id: payload.ticketId, name: String(data.name), email: String(data.email), category: String(data.category), subject: String(data.subject), message: String(data.message), status: payload.status || "Received", createdAt: new Date().toISOString() };
      localStorage.setItem("esb-support-tickets", JSON.stringify([ticket, ...getLocalTickets()].slice(0, 20)));
      setResult(ticket.id); form.reset();
    } catch (err) { setError(err instanceof Error ? err.message : "Something went wrong."); }
    finally { setSubmitting(false); }
  }

  async function trackTicket(event: FormEvent) {
    event.preventDefault(); setTracked(null); setError(null);
    const id = trackId.trim().toUpperCase();
    if (!id) return;
    const local = getLocalTickets().find((ticket) => ticket.id.toUpperCase() === id);
    if (local) { setTracked(local); return; }
    try {
      const response = await fetch(`/api/support/${encodeURIComponent(id)}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Ticket not found.");
      setTracked(payload.ticket);
    } catch (err) { setError(err instanceof Error ? err.message : "Ticket not found."); }
  }

  return (
    <>
      <div className="grid-3 support-cards">
        <article className="card support-card"><span className="card-icon"><BookIcon/></span><h3>Help Centre</h3><p>Browse answers covering accounts, billing, creator tools, safety and more.</p><a className="card-link" href="#quick-help">Browse articles →</a></article>
        <article className="card support-card" id="submit-ticket"><span className="card-icon cyan"><TicketIcon/></span><h3>Submit a Ticket</h3><p>Can&apos;t find an answer? Send a request to the ESB Games support team.</p><button className="card-link" style={{background:"none",border:0,padding:0,cursor:"pointer"}} onClick={() => {setOpen(true);setError(null);setResult(null);}}>Open a ticket →</button></article>
        <article className="card support-card"><span className="card-icon green"><SearchIcon/></span><h3>Track a Ticket</h3><p>Enter your ticket reference to check its current status.</p><form className="track-form" onSubmit={trackTicket}><input className="input" value={trackId} onChange={(e)=>setTrackId(e.target.value)} placeholder="ESB-XXXXXX" aria-label="Ticket ID"/><button className="button button-primary">Go</button></form></article>
      </div>
      {tracked && <div className="success-box" style={{marginTop:18}}><strong>{tracked.id}</strong> {"·"} {tracked.status}. Submitted {new Date(tracked.createdAt).toLocaleString()}.</div>}
      {error && !open && <div className="success-box error-box" style={{marginTop:18}}>{error}</div>}

      {open && <div className="modal-backdrop" onMouseDown={() => setOpen(false)}>
        <section className="form-modal" role="dialog" aria-modal="true" aria-label="Submit a support ticket" onMouseDown={(e)=>e.stopPropagation()}>
          <div className="modal-heading"><div><span className="eyebrow">ESB Games Support</span><h2>Submit a ticket</h2></div><button className="icon-button" aria-label="Close" onClick={()=>setOpen(false)}><CloseIcon/></button></div>
          <form className="form-grid" onSubmit={submitTicket}>
            <div className="field"><label htmlFor="name">Name</label><input className="input" id="name" name="name" required minLength={2}/></div>
            <div className="field"><label htmlFor="email">Email address</label><input className="input" id="email" name="email" type="email" required/></div>
            <div className="field"><label htmlFor="category">Category</label><select className="input" id="category" name="category" defaultValue="Account"><option>Account</option><option>Billing</option><option>Creator tools</option><option>Safety report</option><option>Technical issue</option><option>Other</option></select></div>
            <div className="field"><label htmlFor="subject">Subject</label><input className="input" id="subject" name="subject" required minLength={4}/></div>
            <div className="field full"><label htmlFor="message">How can we help?</label><textarea className="input" id="message" name="message" required minLength={15}/></div>
            <div className="field full"><button className="button button-primary" disabled={submitting}>{submitting ? "Submitting…" : "Submit ticket"}</button></div>
          </form>
          {result && <div className="success-box">Ticket submitted successfully. Your reference is <strong>{result}</strong>. Keep it somewhere safe.</div>}
          {error && <div className="success-box error-box">{error}</div>}
        </section>
      </div>}
    </>
  );
}
