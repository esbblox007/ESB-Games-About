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

      let link = actions.querySelector<HTMLAnchorElement>(".support-private-back-to-tickets");
      if (!link) {
        link = document.createElement("a");
        link.className = "support-private-back-to-tickets";
        link.textContent = "← Back to tickets";
        actions.prepend(link);
      }
      link.href = href;
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
