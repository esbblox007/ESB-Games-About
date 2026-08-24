"use client";

import { useEffect, useState } from "react";

type Account = {
  id: string;
  username: string;
  displayName: string;
  email: string | null;
};

export default function SupportAccountBridge() {
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/support/account-session", { credentials: "include", cache: "no-store" })
      .then((response) => response.json())
      .then((body: { authenticated?: boolean; account?: Account }) => {
        if (active && body.authenticated && body.account) setAccount(body.account);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!account) return;

    const applyIdentity = () => {
      const nameInput = document.querySelector<HTMLInputElement>("#support-name");
      const emailInput = document.querySelector<HTMLInputElement>("#support-email");
      if (!nameInput || !emailInput) return;

      nameInput.value = account.displayName || account.username;
      nameInput.dispatchEvent(new Event("input", { bubbles: true }));
      nameInput.required = false;
      const nameField = nameInput.closest<HTMLElement>(".field");
      if (nameField) nameField.hidden = true;

      const emailField = emailInput.closest<HTMLElement>(".field");
      if (account.email) {
        emailInput.value = account.email;
        emailInput.dispatchEvent(new Event("input", { bubbles: true }));
        emailInput.required = false;
        if (emailField) emailField.hidden = true;
      } else {
        emailInput.value = "";
        emailInput.required = true;
        if (emailField) emailField.hidden = false;
      }

      const group = nameInput.closest<HTMLElement>(".support-field-group");
      if (group && !group.querySelector("[data-esb-account-bridge]")) {
        const card = document.createElement("div");
        card.dataset.esbAccountBridge = "true";
        card.className = "support-account-identity";
        card.innerHTML = `<div><strong>Signed in as ${escapeHtml(account.username)}</strong><span>${escapeHtml(account.email ?? "Add a contact email below to continue")}</span></div><a href="https://esbgames.com/settings">Manage account</a>`;
        group.appendChild(card);
      }
    };

    applyIdentity();
    const observer = new MutationObserver(applyIdentity);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [account]);

  return null;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}
