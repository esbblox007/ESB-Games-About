"use client";

import { useEffect } from "react";

const INTAKE_DRAFT_KEY = "esb:support:intake-draft:v2";
const INTAKE_DRAFT_MAX_AGE = 14 * 24 * 60 * 60 * 1000;
const REPLY_DRAFT_PREFIX = "esb:support:reply-draft:";

type DateRule = "past-or-today" | "today-or-future";
type IntakeDraft = {
  values: Record<string, string>;
  categoryId: string;
  step: number;
  savedAt: number;
};

// Date direction is intentionally configured per question rather than globally.
// Future-oriented questions can use "today-or-future" without changing historical
// questions such as transaction dates, incident dates or last-access dates.
const DATE_RULES: Record<string, DateRule> = {
  lastAccessDate: "past-or-today",
  transactionDate: "past-or-today",
  incidentDate: "past-or-today",
};

function localToday() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function setNativeValue(control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, value: string) {
  const prototype = control instanceof HTMLSelectElement
    ? HTMLSelectElement.prototype
    : control instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
  if (setter) setter.call(control, value);
  else control.value = value;
}

function applyDateRules(root: ParentNode) {
  const today = localToday();
  for (const input of root.querySelectorAll<HTMLInputElement>('input[type="date"][name]')) {
    const rule = DATE_RULES[input.name];
    if (!rule) continue;
    if (rule === "past-or-today") {
      input.max = today;
      input.removeAttribute("min");
      input.title = "Choose today or an earlier date.";
    } else {
      input.min = today;
      input.removeAttribute("max");
      input.title = "Choose today or a later date.";
    }
  }
}

function readIntakeDraft(): IntakeDraft | null {
  try {
    const raw = window.localStorage.getItem(INTAKE_DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as Partial<IntakeDraft>;
    if (!draft.values || typeof draft.values !== "object" || !draft.savedAt || Date.now() - draft.savedAt > INTAKE_DRAFT_MAX_AGE) {
      window.localStorage.removeItem(INTAKE_DRAFT_KEY);
      return null;
    }
    return {
      values: draft.values as Record<string, string>,
      categoryId: String(draft.categoryId ?? draft.values.category ?? "account-access"),
      step: Math.max(1, Math.min(3, Number(draft.step ?? 1))),
      savedAt: Number(draft.savedAt),
    };
  } catch {
    return null;
  }
}

function intakeStep(form: HTMLFormElement) {
  const active = Array.from(form.querySelectorAll<HTMLElement>(".support-step")).findIndex((node) => node.classList.contains("active"));
  return active >= 0 ? active + 1 : 1;
}

function saveIntakeDraft(form: HTMLFormElement) {
  const values: Record<string, string> = {};
  for (const element of Array.from(form.elements)) {
    if (!(element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement)) continue;
    if (!element.name || element.name === "website" || element.type === "file") continue;
    if (element instanceof HTMLInputElement && (element.type === "checkbox" || element.type === "radio")) {
      if (element.checked) values[element.name] = element.value || "1";
      continue;
    }
    values[element.name] = element.value;
  }
  const category = form.elements.namedItem("category");
  const categoryId = category instanceof HTMLSelectElement ? category.value : "account-access";
  const draft: IntakeDraft = { values, categoryId, step: intakeStep(form), savedAt: Date.now() };
  try { window.localStorage.setItem(INTAKE_DRAFT_KEY, JSON.stringify(draft)); } catch { /* local persistence is best effort */ }
}

function restoreValues(form: HTMLFormElement, draft: IntakeDraft) {
  for (const [name, value] of Object.entries(draft.values)) {
    if (name === "category") continue;
    const control = form.elements.namedItem(name);
    if (!(control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement)) continue;
    if (control.type === "file") continue;
    setNativeValue(control, value);
    control.dispatchEvent(new Event("input", { bubbles: true }));
    control.dispatchEvent(new Event("change", { bubbles: true }));
  }
  applyDateRules(form);
}

function replyDraftKey() {
  const match = window.location.pathname.match(/^\/support\/ticket\/([^/]+)/i);
  return match?.[1] ? `${REPLY_DRAFT_PREFIX}${match[1]}` : null;
}

export default function SupportQaEnhancements() {
  useEffect(() => {
    let restoring = false;
    let scheduled = 0;

    const restoreIntake = (form: HTMLFormElement) => {
      if (form.dataset.qaDraftRestored === "1") {
        applyDateRules(form);
        return;
      }
      form.dataset.qaDraftRestored = "1";
      applyDateRules(form);
      const draft = readIntakeDraft();
      if (!draft) return;

      restoring = true;
      const category = form.elements.namedItem("category");
      if (category instanceof HTMLSelectElement && Array.from(category.options).some((option) => option.value === draft.categoryId)) {
        setNativeValue(category, draft.categoryId);
        category.dispatchEvent(new Event("input", { bubbles: true }));
        category.dispatchEvent(new Event("change", { bubbles: true }));
      }

      window.setTimeout(() => {
        restoreValues(form, draft);
        if (draft.step > 1) {
          const buttons = Array.from(form.querySelectorAll<HTMLButtonElement>(".support-step"));
          buttons[1]?.click();
          window.setTimeout(() => {
            restoreValues(form, draft);
            if (draft.step > 2) buttons[2]?.click();
            window.setTimeout(() => { restoreValues(form, draft); restoring = false; }, 40);
          }, 50);
        } else {
          restoring = false;
        }
      }, 60);
    };

    const restoreReply = (textarea: HTMLTextAreaElement) => {
      if (textarea.dataset.qaReplyRestored === "1") return;
      textarea.dataset.qaReplyRestored = "1";
      const key = replyDraftKey();
      if (!key || textarea.value) return;
      try {
        const saved = window.localStorage.getItem(key);
        if (!saved) return;
        setNativeValue(textarea, saved);
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      } catch { /* local persistence is best effort */ }
    };

    const scan = () => {
      scheduled = 0;
      const intake = document.querySelector<HTMLFormElement>("form.support-intake-form");
      if (intake) restoreIntake(intake);
      const reply = document.querySelector<HTMLTextAreaElement>(".support-customer-app-composer textarea");
      if (reply) restoreReply(reply);
      if (document.querySelector(".support-ticket-created")) {
        try { window.localStorage.removeItem(INTAKE_DRAFT_KEY); } catch { /* ignore */ }
      }
      applyDateRules(document);
    };

    const scheduleScan = () => {
      if (scheduled) return;
      scheduled = window.requestAnimationFrame(scan);
    };

    const onInput = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const intake = target.closest<HTMLFormElement>("form.support-intake-form");
      if (intake && !restoring) saveIntakeDraft(intake);
      const reply = target.closest<HTMLTextAreaElement>(".support-customer-app-composer textarea");
      if (reply) {
        const key = replyDraftKey();
        if (key) {
          try {
            if (reply.value) window.localStorage.setItem(key, reply.value);
            else window.localStorage.removeItem(key);
          } catch { /* local persistence is best effort */ }
        }
      }
      scheduleScan();
    };

    const onClick = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const intake = target.closest<HTMLFormElement>("form.support-intake-form");
      if (intake) window.setTimeout(() => { if (!restoring && document.contains(intake)) saveIntakeDraft(intake); }, 30);
    };

    const onSubmit = (event: Event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || !form.classList.contains("support-customer-app-composer")) return;
      const key = replyDraftKey();
      if (!key) return;
      window.setTimeout(() => {
        const textarea = form.querySelector<HTMLTextAreaElement>("textarea");
        if (textarea && !textarea.value) {
          try { window.localStorage.removeItem(key); } catch { /* ignore */ }
        }
      }, 1200);
    };

    document.addEventListener("input", onInput, true);
    document.addEventListener("change", onInput, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    const observer = new MutationObserver(scheduleScan);
    observer.observe(document.body, { childList: true, subtree: true });
    scan();

    return () => {
      document.removeEventListener("input", onInput, true);
      document.removeEventListener("change", onInput, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
      observer.disconnect();
      if (scheduled) window.cancelAnimationFrame(scheduled);
    };
  }, []);

  return null;
}
