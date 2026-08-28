"use client";

import { useEffect } from "react";

export default function SupportPrivateTicketNavigation() {
  useEffect(() => {
    let frame = 0;

    const apply = () => {
      const actions = document.querySelector<HTMLElement>(".support-customer-commandbar .support-case-command-actions");
      const header = document.querySelector<HTMLElement>(".support-customer-compact-header");
      if (!actions || !header) return;
      const reference = header.querySelector<HTMLElement>(".eyebrow")?.textContent?.trim() ?? "";
      if (!reference) return;
      const categoryText = header.querySelector<HTMLElement>("p")?.textContent?.toLowerCase() ?? "";
      const title = header.querySelector<HTMLElement>("h1")?.textContent?.toLowerCase() ?? "";
      const lane = categoryText.includes("appeal") || title.startsWith("appeal:") ? "appeals" : "general";
      const href = `/support/tickets?lane=${lane}&reference=${encodeURIComponent(reference)}`;

      // Reuse the command bar's existing navigation link instead of injecting a
      // second one. This keeps the private case header to a single Back control.
      const links = Array.from(actions.querySelectorAll<HTMLAnchorElement>("a"));
      const link = links.find((candidate) => candidate.classList.contains("support-private-back-to-tickets")) ?? links[0];
      if (!link) return;

      link.classList.add("support-private-back-to-tickets");
      link.href = href;
      link.textContent = "← Back to tickets";

      // Remove any duplicate links left behind by an older client render.
      for (const candidate of links) {
        if (candidate !== link) candidate.remove();
      }
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => { frame = 0; apply(); });
    };

    apply();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
