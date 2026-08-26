"use client";

import { useEffect } from "react";

const accountTicketsEndpoint = "https://esbgames.com/api/platform/support/tickets";

function normaliseReference(value: string | null | undefined) {
  return String(value ?? "").trim().toUpperCase();
}

function sameCaseReference(left: string | null | undefined, right: string | null | undefined) {
  const a = normaliseReference(left);
  const b = normaliseReference(right);
  if (!a || !b) return false;
  if (a === b) return true;
  const suffix = (value: string) => value.match(/([0-9]{6,})$/)?.[1] ?? "";
  return Boolean(suffix(a) && suffix(a) === suffix(b));
}

export default function SupportFlowEnhancements() {
  useEffect(() => {
    const path = window.location.pathname;
    let observer: MutationObserver | null = null;
    let redirected = false;

    const redirect = (href: string) => {
      if (redirected) return;
      redirected = true;
      window.location.replace(href);
    };

    if (path === "/support" || path === "/support/") {
      const enhanceSupportLanding = () => {
        // The account tickets page already owns the sign-in/return flow, so the
        // support card should go there rather than dropping the user at a generic login.
        for (const card of document.querySelectorAll<HTMLElement>(".support-card")) {
          if (card.querySelector("h3")?.textContent?.trim() !== "View Your Tickets") continue;
          const link = card.querySelector<HTMLAnchorElement>("a.card-link");
          if (link) link.href = "/support/tickets";
        }

        const created = document.querySelector<HTMLElement>(".support-ticket-created");
        if (!created) return;
        const reference = created.querySelector("h3")?.textContent?.trim() ?? "";
        const copy = created.textContent ?? "";
        const privateLink = created.querySelector<HTMLAnchorElement>(".support-created-actions a")?.getAttribute("href") ?? "";

        if (/linked to your signed-in ESB Games account/i.test(copy) && reference) {
          redirect(`/support/tickets?ticket=${encodeURIComponent(reference)}`);
          return;
        }

        // Guest cases still require email proof, but there is no reason to make
        // the customer stop on a separate success screen before verification.
        if (privateLink) redirect(privateLink);
      };

      observer = new MutationObserver(enhanceSupportLanding);
      observer.observe(document.body, { childList: true, subtree: true });
      enhanceSupportLanding();
    } else if (path === "/support/tickets" || path === "/support/tickets/") {
      const requestedReference = new URLSearchParams(window.location.search).get("ticket");
      if (requestedReference) {
        const selectRequestedTicket = () => {
          const ticketButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(".support-account-ticket"));
          const target = ticketButtons.find((button) => {
            const displayedReference = button.querySelector(".support-account-ticket-top strong")?.textContent;
            return sameCaseReference(displayedReference, requestedReference);
          });
          if (!target) return;
          if (!target.classList.contains("active")) target.click();
        };
        observer = new MutationObserver(selectRequestedTicket);
        observer.observe(document.body, { childList: true, subtree: true });
        selectRequestedTicket();
      }
    } else if (/^\/support\/ticket\/[^/]+\/?$/.test(path)) {
      // Account-linked private links should converge on the normal account ticket
      // workspace after access has loaded. Guest tickets remain isolated to the
      // verified private case and are never grouped merely because an email matches.
      let checkingAccountList = false;
      const moveAccountLinkedCase = async () => {
        if (redirected || checkingAccountList) return;
        const reference = document.querySelector<HTMLElement>(".support-customer-compact-header .eyebrow")?.textContent?.trim();
        if (!reference) return;
        checkingAccountList = true;
        try {
          const response = await fetch(accountTicketsEndpoint, {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            headers: { Accept: "application/json" },
          });
          if (!response.ok) return;
          const body = await response.json().catch(() => ({})) as { data?: { tickets?: Array<{ reference?: string }> } };
          const linked = (body.data?.tickets ?? []).some((ticket) => sameCaseReference(ticket.reference, reference));
          if (linked) redirect(`/support/tickets?ticket=${encodeURIComponent(reference)}`);
        } catch {
          // Failure to check the account list must never block the private case.
        } finally {
          checkingAccountList = false;
        }
      };

      observer = new MutationObserver(() => void moveAccountLinkedCase());
      observer.observe(document.body, { childList: true, subtree: true });
      void moveAccountLinkedCase();
    }

    return () => observer?.disconnect();
  }, []);

  return null;
}
