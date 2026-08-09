"use client";

import { ChangeEvent, FormEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { authHeaders } from "@/lib/client-auth";

type Attachment = { id: string; name: string; type: string; size: number; scanState: string; validationState?: string; moderationState: string; sensitive: boolean; href: string };
type Message = { id: string; senderType: "Account" | "Guest" | "Staff" | "System"; senderName: string; body: string; createdAt: string; editedAt?: string | null; attachments: Attachment[] };
type TypingEntry = { actor_type: "Customer" | "Staff"; actor_key: string; display_name: string; is_typing: boolean; expires_at: string; updated_at: string };
type TicketData = { ticket: { reference: string; subject: string; categoryId: string; status: string; createdAt: string; updatedAt: string }; messages: Message[]; typing?: TypingEntry[] };
type CodeResponse = { error?: string; maskedEmail?: string; expiresInSeconds?: number; deliveryReference?: string; reference?: string };

const MAX_FILES = 8;
const MAX_FILE = 100 * 1024 * 1024;
const MAX_COMBINED = 400 * 1024 * 1024;

export default function SupportTicketClient({ accessToken }: { accessToken: string }) {
  const [data, setData] = useState<TicketData | null>(null);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [draft, setDraft] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [deliveryReference, setDeliveryReference] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<{ src: string; name: string } | null>(null);
  const [newMessages, setNewMessages] = useState(false);
  const messageCountRef = useRef(0);
  const threadRef = useRef<HTMLDivElement | null>(null);
  const nearBottomRef = useRef(true);
  const initialScrollRef = useRef(false);
  const autoRequestedRef = useRef(false);
  const typingStopRef = useRef<number | null>(null);
  const lastTypingSentRef = useRef(0);
  const draftNonceRef = useRef("");
  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const submittingRef = useRef(false);
  const endpoint = `/api/support/tickets/${encodeURIComponent(accessToken)}`;

  const readJsonSafely = useCallback(async <T extends Record<string, unknown>>(response: Response): Promise<T> => {
    const raw = await response.text();
    if (!raw.trim()) return {} as T;
    try { return JSON.parse(raw) as T; }
    catch { throw new Error(response.ok ? "The support service returned an unreadable response." : `The support service failed (${response.status}). Please try again.`); }
  }, []);

  function scrollLatest(smooth = true) {
    const node = threadRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    nearBottomRef.current = true;
    setNewMessages(false);
  }

  const load = useCallback(async (announce = false) => {
    try {
      const response = await fetch(endpoint, { headers: authHeaders(), cache: "no-store" });
      const body = await readJsonSafely<TicketData & { error?: string; verificationRequired?: boolean }>(response);
      if (response.status === 401) {
        setVerificationRequired(true); setData(null); setError(null); return;
      }
      if (!response.ok) throw new Error(body.error ?? "The ticket could not be loaded.");
      const previous = messageCountRef.current;
      const added = body.messages.length > previous && previous > 0;
      if (announce && added) notifyReply(body.ticket.reference);
      if (added && !nearBottomRef.current) setNewMessages(true);
      messageCountRef.current = body.messages.length;
      setVerificationRequired(false); setData(body); setError(null);
      if (!initialScrollRef.current || nearBottomRef.current) {
        initialScrollRef.current = true;
        requestAnimationFrame(() => scrollLatest(false));
      }
    } catch (caught) { setError(caught instanceof Error ? caught.message : "The ticket could not be loaded."); }
  }, [endpoint, readJsonSafely]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (!data) return;
    // This GET both refreshes the conversation and records a short customer-presence
    // window server-side, which suppresses unnecessary staff-reply email while viewed.
    const poll = () => { if (!document.hidden) void load(true); };
    const timer = window.setInterval(poll, 10000);
    const onVisibility = () => { if (!document.hidden) void load(true); };
    document.addEventListener("visibilitychange", onVisibility); window.addEventListener("focus", onVisibility);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", onVisibility); window.removeEventListener("focus", onVisibility); };
  }, [data?.ticket.reference, load]);
  useEffect(() => { if (countdown <= 0) return; const timer = window.setInterval(() => setCountdown((value) => Math.max(0, value - 1)), 1000); return () => window.clearInterval(timer); }, [countdown]);
  useEffect(() => () => { if (typingStopRef.current) window.clearTimeout(typingStopRef.current); void setTyping(false); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function requestCode() {
    setBusy(true); setError(null);
    try {
      const response = await fetch(`${endpoint}/request-code`, { method: "POST", cache: "no-store" });
      const body = await readJsonSafely<CodeResponse>(response);
      if (!response.ok) throw new Error(body.error ?? "The verification code could not be sent.");
      setCodeSent(true); setMaskedEmail(body.maskedEmail ?? null); setCountdown(body.expiresInSeconds ?? 180); setDeliveryReference(body.deliveryReference ?? null);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "The verification code could not be sent."); }
    finally { setBusy(false); }
  }
  useEffect(() => { if (!verificationRequired || codeSent || busy || autoRequestedRef.current) return; autoRequestedRef.current = true; void requestCode(); }, [verificationRequired, codeSent, busy]); // eslint-disable-line react-hooks/exhaustive-deps

  async function verifyCode(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(null);
    try {
      const response = await fetch(`${endpoint}/verify-code`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }), cache: "no-store" });
      const body = await readJsonSafely<{ error?: string }>(response);
      if (!response.ok) throw new Error(body.error ?? "The code could not be verified.");
      setCode(""); setCodeSent(false); setCountdown(0); setDeliveryReference(null); setVerificationRequired(false); autoRequestedRef.current = false; initialScrollRef.current = false; await load();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "The code could not be verified."); }
    finally { setBusy(false); }
  }

  async function setTyping(typing: boolean) {
    if (!data || ["Closed", "Resolved", "Spam"].includes(data.ticket.status)) return;
    try { await fetch(`${endpoint}/typing`, { method: "POST", headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify({ typing }), keepalive: true }); } catch { /* presence is best effort */ }
  }
  function composerChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setDraft(event.currentTarget.value);
    event.currentTarget.style.height = "auto";
    event.currentTarget.style.height = `${Math.min(Math.max(event.currentTarget.scrollHeight, 58), 118)}px`;
    const now = Date.now();
    if (now - lastTypingSentRef.current > 1800) { lastTypingSentRef.current = now; void setTyping(true); }
    if (typingStopRef.current) window.clearTimeout(typingStopRef.current);
    typingStopRef.current = window.setTimeout(() => void setTyping(false), 2800);
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || submittingRef.current || !draft.trim()) return;
    submittingRef.current = true;
    setBusy(true); setError(null); setNotice(null);
    const formElement = event.currentTarget;
    try {
      const form = new FormData(formElement);
      form.set("body", draft.trim());
      if (!draftNonceRef.current) draftNonceRef.current = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
      form.set("clientMessageId", draftNonceRef.current);
      files.forEach((file) => form.append("files", file));
      const response = await fetch(endpoint, { method: "POST", headers: authHeaders(), body: form });
      const body = await readJsonSafely<{ error?: string; attachmentError?: string | null }>(response);
      if (!response.ok) throw new Error(body.error ?? "The reply could not be sent.");
      formElement.reset(); setDraft(""); setFiles([]); draftNonceRef.current = ""; if (composerRef.current) composerRef.current.style.height = "58px"; await setTyping(false); setNotice(body.attachmentError ? `Your message was sent, but an attachment could not be stored: ${body.attachmentError}` : null); nearBottomRef.current = true; await load();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "The reply could not be sent."); }
    finally { submittingRef.current = false; setBusy(false); }
  }
  function composerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    if (busy || !draft.trim()) return;
    event.currentTarget.form?.requestSubmit();
  }
  function addFiles(incoming: File[]) {
    const merged = [...files, ...incoming].filter((file,index,all) => all.findIndex((candidate) => candidate.name === file.name && candidate.size === file.size && candidate.lastModified === file.lastModified) === index).slice(0, MAX_FILES);
    if (merged.some((file) => file.size > MAX_FILE)) return setError("Each attachment must be 100 MB or smaller.");
    if (merged.reduce((total,file) => total + file.size,0) > MAX_COMBINED) return setError("Combined attachments for one reply must be 400 MB or smaller.");
    setError(null); setFiles(merged);
  }
  function trackScroll() { const node = threadRef.current; if (!node) return; nearBottomRef.current = node.scrollHeight - node.scrollTop - node.clientHeight < 90; if (nearBottomRef.current) setNewMessages(false); }

  async function openAttachment(attachment: Attachment) {
    setError(null);
    try {
      const response = await fetch(attachment.href, { headers: authHeaders(), redirect: "follow", cache: "no-store" });
      if (!response.ok) throw new Error("The attachment could not be opened.");
      const blob = await response.blob(); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = attachment.name; anchor.rel = "noopener"; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "The attachment could not be opened."); }
  }

  if (verificationRequired) return <VerificationWorkspace busy={busy} code={code} codeSent={codeSent} countdown={countdown} deliveryReference={deliveryReference} error={error} maskedEmail={maskedEmail} onCodeChange={setCode} onRequestCode={requestCode} onVerifyCode={verifyCode}/>;
  if (!data) return <section className="support-case-page"><div className="container support-case-loading"><span className="support-case-loader"/><div><strong>Opening your private support case</strong><p>Checking secure access and loading the conversation.</p></div>{error && <div className="form-alert error" role="alert">{error}</div>}</div></section>;

  const canReply = !["Closed", "Resolved", "Spam"].includes(data.ticket.status);
  const staffTyping = data.typing?.filter((entry) => entry.actor_type === "Staff" && entry.is_typing && new Date(entry.expires_at).getTime() > Date.now()) ?? [];

  return <section className="support-case-page support-ticket-app-page">
    <div className="support-customer-workspace support-customer-app">
      <div className="support-customer-case-header support-customer-compact-header"><div><span className="eyebrow">{data.ticket.reference}</span><h1>{data.ticket.subject}</h1><p>{categoryLabel(data.ticket.categoryId)} · Opened {formatDate(data.ticket.createdAt)}</p><small className="support-customer-inline-security">Never share passwords, full payment-card details or verification codes in a support ticket.</small></div><div className="support-customer-badges"><span className="status">{data.ticket.status}</span></div></div>
      <main className="support-customer-conversation support-customer-app-conversation">
        <div ref={threadRef} className="support-customer-thread support-customer-app-thread" aria-live="polite" onScroll={trackScroll}>
          <div className="support-thread-date"><span>Case opened · {formatDate(data.ticket.createdAt)}</span></div>
          {data.messages.map((message) => <article key={message.id} className={`support-customer-message ${message.senderType.toLowerCase()}`}><div className="support-message-avatar">{message.senderType === "Staff" ? "ESB" : initials(message.senderName)}</div><div className="support-message-content"><header><div><strong>{message.senderName}</strong><span>{message.senderType === "Staff" ? "ESB Games Support" : message.senderType === "System" ? "Case system" : "Customer"}</span></div><time dateTime={message.createdAt}>{formatDate(message.createdAt)}</time></header><p>{message.body}</p>{message.attachments.length > 0 && <div className="support-customer-files support-customer-message-attachments">{message.attachments.map((attachment) => <CustomerAttachment key={attachment.id} attachment={attachment} onDownload={() => openAttachment(attachment)} onPreview={(src) => setImagePreview({src,name:attachment.name})}/>)}</div>}</div></article>)}
          {staffTyping.length > 0 && <div className="support-customer-typing" role="status"><span className="typing-dots"><i/><i/><i/></span><span>{staffTyping[0]?.display_name ?? "ESB Games Support"} is typing…</span></div>}
        </div>
        {newMessages && <button type="button" className="support-new-messages" onClick={() => scrollLatest(true)}>New messages ↓</button>}
        {canReply ? <form className="support-customer-reply support-customer-app-composer support-customer-compact-composer" onSubmit={sendMessage}>
          <div className="support-customer-compact-toolbar"><label className="support-customer-file-icon" title="Attach evidence" aria-label="Attach evidence"><EvidenceIcon/><input type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime,audio/mpeg,audio/wav,audio/ogg,audio/mp4,application/pdf,text/plain,text/csv,application/json,application/zip,.zip" onChange={(event: ChangeEvent<HTMLInputElement>) => { addFiles(Array.from(event.currentTarget.files ?? [])); event.currentTarget.value = ""; }}/></label><span className="support-customer-attachment-hint">{files.length ? `${files.length} file${files.length === 1 ? "" : "s"} selected` : "Up to 8 files · 100 MB each · 400 MB combined"}</span><span className="support-customer-enter-hint">Enter to send · Shift+Enter for new line</span></div>
          {files.length > 0 && <CustomerSelectedFilePreview files={files} onRemove={(index) => setFiles((current) => current.filter((_,fileIndex) => fileIndex !== index))}/>} 
          <div className="support-customer-compose-row"><textarea ref={composerRef} name="body" value={draft} maxLength={20000} rows={2} required onChange={composerChanged} onKeyDown={composerKeyDown} placeholder="Message ESB Games Support…" aria-label="Message ESB Games Support"/><button className="support-customer-send-icon" aria-label="Send message" disabled={busy || !draft.trim()}><SendIcon/></button></div>
          {notice && <div className="form-alert warning support-inline-notice" role="status">{notice}</div>}{error && <div className="form-alert error support-inline-error" role="alert">{error}</div>}
        </form> : <div className="support-customer-closed support-customer-app-composer"><strong>This case is {data.ticket.status.toLowerCase()}.</strong><p>The conversation is read-only. Use the Support Centre if you need help accessing the case.</p></div>}
      </main>
      {imagePreview && <div className="support-image-lightbox" role="dialog" aria-modal="true" aria-label={`Preview ${imagePreview.name}`} onClick={() => setImagePreview(null)}><button type="button" className="support-image-lightbox-close" onClick={() => setImagePreview(null)} aria-label="Close image preview">×</button><div onClick={(event) => event.stopPropagation()}><img src={imagePreview.src} alt={imagePreview.name}/><span>{imagePreview.name}</span></div></div>}
    </div>
  </section>;
}

function CustomerSelectedFilePreview({ files, onRemove }: { files: File[]; onRemove: (index: number) => void }) {
  const [urls,setUrls]=useState<(string|null)[]>([]);
  useEffect(() => { const next=files.map((file)=>file.type.startsWith("image/")?URL.createObjectURL(file):null); setUrls(next); return ()=>next.forEach((url)=>url&&URL.revokeObjectURL(url)); },[files]);
  return <div className="support-customer-selected-attachments" aria-label="Selected attachments">{files.map((file,index)=><div className="support-customer-selected-attachment" key={`${file.name}-${file.lastModified}-${index}`}>{urls[index]?<img src={urls[index]??undefined} alt=""/>:<span>＋</span>}<div><strong>{file.name}</strong><small>{file.type||"Unknown type"} · {formatBytes(file.size)} · Ready</small></div><button type="button" onClick={()=>onRemove(index)} aria-label={`Remove ${file.name}`}>×</button></div>)}</div>;
}

function CustomerAttachment({ attachment, onDownload, onPreview }: { attachment: Attachment; onDownload: () => void; onPreview: (src: string) => void }) {
  const [previewUrl,setPreviewUrl]=useState<string|null>(null); const [previewFailed,setPreviewFailed]=useState(false);
  const available=(attachment.validationState??attachment.scanState)==="Available"||attachment.scanState==="Clean";
  useEffect(()=>{ if(!attachment.type.startsWith("image/")||!available)return; let alive=true; let url:string|null=null; void(async()=>{try{const response=await fetch(attachment.href,{headers:authHeaders(),redirect:"follow",cache:"no-store"});if(!response.ok)throw new Error();const blob=await response.blob();url=URL.createObjectURL(blob);if(alive)setPreviewUrl(url)}catch{if(alive)setPreviewFailed(true)}})();return()=>{alive=false;if(url)URL.revokeObjectURL(url)}},[attachment.href,attachment.type,available]);
  if(!available)return <div className="support-customer-file-card pending"><span aria-hidden="true">▣</span><div><strong>{attachment.name}</strong><small>{formatBytes(attachment.size)} · {attachment.validationState??attachment.scanState??"Processing"}</small></div></div>;
  if(attachment.type.startsWith("image/")&&previewUrl&&!previewFailed)return <button className="support-customer-inline-image" type="button" onClick={()=>onPreview(previewUrl)} title={`Preview ${attachment.name}`}><img src={previewUrl} alt={attachment.name}/><span><strong>{attachment.name}</strong><small>{formatBytes(attachment.size)} · Available</small></span></button>;
  return <button className="support-customer-file-card" type="button" onClick={onDownload}><span>↗</span><div><strong>{attachment.name}</strong><small>{formatBytes(attachment.size)} · Available{attachment.sensitive?" · Sensitive evidence":""}</small></div></button>;
}

function VerificationWorkspace(input:{busy:boolean;code:string;codeSent:boolean;countdown:number;deliveryReference:string|null;error:string|null;maskedEmail:string|null;onCodeChange:(value:string)=>void;onRequestCode:()=>void;onVerifyCode:(event:FormEvent)=>void}) {
  const time=`${Math.floor(input.countdown/60)}:${String(input.countdown%60).padStart(2,"0")}`;
  return <section className="support-case-page support-verification-page"><div className="container support-verification-workspace"><header className="support-customer-commandbar"><div className="support-case-brand"><span>ESB</span><div><small>ESB GAMES SUPPORT</small><strong>Private case access</strong></div></div><div className="support-case-command-actions"><span className="support-secure-state"><i/> Protected by email verification</span><a href="/support">Support centre</a></div></header><div className="support-verification-layout"><main className="support-verification-primary"><div className="support-verification-stack"><span className="support-verification-icon">⌁</span><span className="eyebrow">IDENTITY VERIFICATION</span><h1>Verify your email to open this private support case.</h1><p className="support-verification-lead">The link identifies the requested case but does not authenticate you. We send a short-lived, single-use code to the email associated with the case before any ticket information is shown.</p>{!input.codeSent?<div className="support-verification-action"><div><strong>Send a one-time access code</strong><p>The code expires after three minutes and can only be used once.</p></div><button className="button button-primary" disabled={input.busy} onClick={input.onRequestCode}>{input.busy?"Requesting code…":"Send verification code"}</button></div>:<form onSubmit={input.onVerifyCode} className="support-enterprise-code-form"><div className="support-code-delivery"><span>✓</span><div><strong>Check {input.maskedEmail??"your support email"}</strong><p>Enter the six-digit code below to continue.</p></div></div><label htmlFor="support-code">Enter your six-digit verification code</label><input id="support-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={input.code} onChange={(event:ChangeEvent<HTMLInputElement>)=>input.onCodeChange(event.target.value.replace(/\D/g,"").slice(0,6))} placeholder="000000" required autoFocus/><div className="support-code-controls"><button className="button button-primary" disabled={input.busy||input.code.length!==6}>{input.busy?"Verifying…":"Open private case"}</button><button className="button button-secondary" type="button" disabled={input.busy||input.countdown>120} onClick={input.onRequestCode}>Send another code</button></div><div className="support-code-timer"><span className={input.countdown<=30?"ending":""}>{input.countdown>0?`Code expires in ${time}`:"Code expired"}</span>{input.deliveryReference&&<small>Delivery reference: {input.deliveryReference}</small>}</div></form>}{input.error&&<div className="form-alert error support-verification-error" role="alert">{input.error}</div>}</div></main><aside className="support-verification-aside"><span className="support-case-label">SECURE ACCESS</span><div className="support-verification-security"><strong>Your security matters</strong><p>ESB Games staff will never ask for your password, full payment-card details or this verification code.</p></div></aside></div></div></section>;
}

function EvidenceIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="m9 15 3-3 3 3"/></svg>}
function SendIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>}
function categoryLabel(id:string){return ({"account-access":"Account & Access","billing-payments":"Billing & Payments","creator-developer":"Creator & Developer Support","safety-abuse":"Safety & Abuse","technical-issues":"Technical Issues","something-else":"Something Else"} as Record<string,string>)[id]??id}
function formatDate(value:string){return new Intl.DateTimeFormat("en-GB",{dateStyle:"medium",timeStyle:"short"}).format(new Date(value))}
function formatBytes(bytes:number){return bytes<1024*1024?`${Math.max(1,Math.round(bytes/1024))} KB`:`${(bytes/1024/1024).toFixed(1)} MB`}
function initials(value:string){return value.split(/\s+/).filter(Boolean).slice(0,2).map((part)=>part[0]?.toUpperCase()).join("")||"ES"}
function notifyReply(reference:string){try{const C=window.AudioContext||(window as typeof window&{webkitAudioContext?:typeof AudioContext}).webkitAudioContext;if(C){const context=new C();const oscillator=context.createOscillator();const gain=context.createGain();oscillator.frequency.value=660;gain.gain.value=.035;oscillator.connect(gain);gain.connect(context.destination);oscillator.start();oscillator.stop(context.currentTime+.12)}if("Notification" in window&&Notification.permission==="granted")new Notification(`New reply on ${reference}`,{body:"ESB Games Support has replied to your ticket."})}catch{/* enhancement only */}}
