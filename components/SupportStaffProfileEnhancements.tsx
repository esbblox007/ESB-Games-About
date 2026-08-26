"use client";

import { useEffect, useMemo, useState } from "react";
import { authHeaders } from "@/lib/client-auth";

type PublicStaffProfile = {
  displayName: string;
  publicTitle: string;
  bio: string;
  avatarUrl: string | null;
  verified: boolean;
};

type ConversationMessage = {
  senderType: string;
  senderName: string;
  senderStaffId?: string | null;
};

type ConversationProfilePayload = {
  messages?: ConversationMessage[];
  staffProfiles?: Record<string, PublicStaffProfile>;
};

function initials(value: string) {
  return value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "ES";
}

export default function SupportStaffProfileEnhancements() {
  const [profilesBySender, setProfilesBySender] = useState<Record<string, PublicStaffProfile>>({});
  const [selected, setSelected] = useState<PublicStaffProfile | null>(null);

  const ticketToken = useMemo(() => {
    if (typeof window === "undefined") return null;
    const match = window.location.pathname.match(/^\/support\/ticket\/([^/]+)/i);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  }, []);

  useEffect(() => {
    if (!ticketToken) return;
    let active = true;

    const loadProfiles = async () => {
      try {
        const response = await fetch(`/api/support/tickets/${encodeURIComponent(ticketToken)}`, {
          headers: authHeaders(),
          cache: "no-store",
        });
        if (!response.ok) return;
        const body = await response.json() as ConversationProfilePayload;
        const next: Record<string, PublicStaffProfile> = {};
        for (const message of body.messages ?? []) {
          if (message.senderType !== "Staff" || !message.senderStaffId) continue;
          const profile = body.staffProfiles?.[message.senderStaffId];
          if (profile) next[message.senderName] = profile;
        }
        if (active) setProfilesBySender(next);
      } catch {
        // The core ticket remains fully usable if public-profile decoration fails.
      }
    };

    void loadProfiles();
    return () => { active = false; };
  }, [ticketToken]);

  useEffect(() => {
    if (!ticketToken || !Object.keys(profilesBySender).length) return;
    let frame = 0;

    const decorate = () => {
      frame = 0;
      for (const article of document.querySelectorAll<HTMLElement>(".support-customer-message.staff")) {
        const sender = article.querySelector<HTMLElement>(".support-message-content header strong")?.textContent?.trim() ?? "";
        const profile = profilesBySender[sender];
        const avatar = article.querySelector<HTMLElement>(".support-message-avatar");
        if (!avatar || !profile) continue;
        avatar.classList.add("support-profile-trigger");
        avatar.dataset.supportProfileSender = sender;
        avatar.setAttribute("role", "button");
        avatar.setAttribute("tabindex", "0");
        avatar.setAttribute("aria-label", `View ${profile.displayName}'s ESB Games support profile`);
        avatar.setAttribute("title", `View ${profile.displayName}'s support profile`);
        if (profile.avatarUrl) {
          avatar.classList.add("has-support-photo");
          avatar.style.backgroundImage = `url("${profile.avatarUrl.replace(/"/g, "%22")}")`;
          avatar.textContent = "";
        }
      }
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(decorate);
    };

    const openFromTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const trigger = target.closest<HTMLElement>(".support-profile-trigger");
      if (!trigger) return false;
      const sender = trigger.dataset.supportProfileSender ?? "";
      const profile = profilesBySender[sender];
      if (!profile) return false;
      setSelected(profile);
      return true;
    };

    const onClick = (event: MouseEvent) => { openFromTarget(event.target); };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (openFromTarget(event.target)) event.preventDefault();
    };

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey, true);
    decorate();

    return () => {
      observer.disconnect();
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey, true);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [profilesBySender, ticketToken]);

  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  if (!selected) return null;

  return (
    <div className="support-public-profile-backdrop" role="presentation" onMouseDown={() => setSelected(null)}>
      <section className="support-public-profile-card" role="dialog" aria-modal="true" aria-label={`${selected.displayName} support profile`} onMouseDown={(event) => event.stopPropagation()}>
        <button className="support-public-profile-close" type="button" onClick={() => setSelected(null)} aria-label="Close staff profile">×</button>
        <div className={`support-public-profile-avatar ${selected.avatarUrl ? "has-photo" : ""}`} style={selected.avatarUrl ? { backgroundImage: `url("${selected.avatarUrl.replace(/"/g, "%22")}")` } : undefined}>{selected.avatarUrl ? null : initials(selected.displayName)}</div>
        <span className="support-public-profile-badge"><i>✓</i> Verified ESB Games staff</span>
        <h2>{selected.displayName}</h2>
        <strong>{selected.publicTitle}</strong>
        <p>{selected.bio}</p>
        <div className="support-public-profile-footer"><span>ESB Games Support</span><small>This is a public outreach profile. Internal staff-account details are never shown here.</small></div>
      </section>
    </div>
  );
}
