"use client";

import { useEffect } from "react";

function tabByLabel(label: string) {
  return Array.from(document.querySelectorAll<HTMLButtonElement>(".support-account-ticket-tabs button")).find((button) =>
    button.textContent?.trim().toLowerCase().startsWith(label.toLowerCase()),
  ) ?? null;
}

function ticketByReference(reference: string) {
  return Array.from(document.querySelectorAll<HTMLButtonElement>(".support-account-ticket-list .support-account-ticket")).find((button) =>
    button.querySelector("strong")?.textContent?.trim() === reference,
  ) ?? null;
}

export default function SupportTicketLaneDeepLink() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lane = params.get("lane") === "appeals" ? "appeals" : params.get("lane") === "general" ? "general" : null;
    const reference = params.get("reference")?.trim() ?? "";
    if (!lane && !reference) return;

    let frame = 0;
    let attempts = 0;
    let observer: MutationObserver | null = null;

    const apply = () => {
      attempts += 1;
      if (lane) {
        const tab = tabByLabel(lane === "appeals" ? "Appeal support" : "General support");
        if (tab && tab.getAttribute("aria-selected") !== "true") {
          tab.click();
          return false;
        }
      }
      if (reference) {
        const ticket = ticketByReference(reference);
        if (ticket && !ticket.classList.contains("active")) {
          ticket.click();
          return true;
        }
        return Boolean(ticket);
      }
      return true;
    };

    const schedule = () => {
      if (frame || attempts > 80) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (apply()) observer?.disconnect();
      });
    };

    if (!apply()) {
      observer = new MutationObserver(schedule);
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "aria-selected"] });
    }

    return () => {
      observer?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
