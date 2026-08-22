"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { languages, resolvePreferredLocale } from "./LanguageSelector";

declare global {
  interface Window {
    google?: { translate?: { TranslateElement?: new (options: Record<string, unknown>, elementId: string) => unknown } };
    googleTranslateElementInit?: () => void;
  }
}

const supportedLanguages = languages.map((language) => language.google).join(",");

function forceImportantStyle(element: HTMLElement, property: string, value: string) {
  if (element.style.getPropertyValue(property) === value && element.style.getPropertyPriority(property) === "important") return;
  element.style.setProperty(property, value, "important");
}

function removeInjectedTranslateChrome() {
  document.querySelectorAll<HTMLElement>([
    "body > .skiptranslate:not(.google-translate-host)",
    "body > .goog-te-banner-frame",
    "body > .VIpgJd-ZVi9od-ORHb-OEVmcd",
    "body > [class*='VIpgJd-ZVi9od-ORHb']",
  ].join(",")).forEach((element) => element.remove());

  document.querySelectorAll<HTMLIFrameElement>(
    "body > iframe.goog-te-banner-frame, body > iframe[src*='translate.google']",
  ).forEach((frame) => frame.remove());
}

function resetGoogleTranslatePageOffset() {
  removeInjectedTranslateChrome();

  for (const element of [document.body, document.documentElement]) {
    forceImportantStyle(element, "top", "0px");
    forceImportantStyle(element, "inset-block-start", "0px");
    forceImportantStyle(element, "margin-top", "0px");
    forceImportantStyle(element, "padding-top", "0px");
    forceImportantStyle(element, "transform", "none");
    forceImportantStyle(element, "translate", "none");
  }

  const header = document.querySelector<HTMLElement>(".site-header");
  if (header) {
    forceImportantStyle(header, "top", "0px");
    forceImportantStyle(header, "margin-top", "0px");
    forceImportantStyle(header, "transform", "none");
    forceImportantStyle(header, "translate", "none");
  }
}

function scheduleOffsetCleanup() {
  const delays = [0, 60, 180, 500, 1200];
  const timers = delays.map((delay) => window.setTimeout(resetGoogleTranslatePageOffset, delay));
  return () => timers.forEach((timer) => window.clearTimeout(timer));
}

function selectedLanguage() {
  const preferredLocale = resolvePreferredLocale();
  return languages.find((item) => item.locale === preferredLocale) || languages[0];
}

function applySelectedLanguage() {
  resetGoogleTranslatePageOffset();
  const language = selectedLanguage();
  document.documentElement.lang = language.locale;
  if (language.google === "en") return;

  window.setTimeout(() => {
    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select && select.value !== language.google) {
      select.value = language.google;
      select.dispatchEvent(new Event("change"));
    }
  }, 250);
}

function initialiseTranslator() {
  const target = document.getElementById("google_translate_element");
  if (!target || target.dataset.ready === "true") return;
  const TranslateElement = window.google?.translate?.TranslateElement;
  if (!TranslateElement) return;

  new TranslateElement(
    { pageLanguage: "en", includedLanguages: supportedLanguages, autoDisplay: false, multilanguagePage: true },
    "google_translate_element",
  );
  target.dataset.ready = "true";
  applySelectedLanguage();
}

function loadTranslatorScript() {
  if (window.google?.translate?.TranslateElement) {
    initialiseTranslator();
    return;
  }

  if (document.getElementById("google-translate-script")) return;
  const script = document.createElement("script");
  script.id = "google-translate-script";
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
}

export default function SiteTranslator() {
  const pathname = usePathname();
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    resetGoogleTranslatePageOffset();
    const preferred = selectedLanguage();

    const ensureObserver = () => {
      if (observerRef.current) return;
      const observer = new MutationObserver(() => resetGoogleTranslatePageOffset());
      observer.observe(document.body, { childList: true, subtree: false, attributes: true, attributeFilter: ["style", "class"] });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class"] });
      observerRef.current = observer;
    };

    window.googleTranslateElementInit = () => {
      initialiseTranslator();
      ensureObserver();
      scheduleOffsetCleanup();
    };

    if (preferred.google !== "en") {
      ensureObserver();
      loadTranslatorScript();
    }

    const onLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ google?: string }>;
      const googleCode = customEvent.detail?.google || selectedLanguage().google;
      resetGoogleTranslatePageOffset();

      if (googleCode !== "en") {
        ensureObserver();
        loadTranslatorScript();
        window.setTimeout(applySelectedLanguage, 120);
      }
      scheduleOffsetCleanup();
    };

    window.addEventListener("esb-language-change" as keyof WindowEventMap, onLanguageChange as EventListener);
    return () => {
      window.removeEventListener("esb-language-change" as keyof WindowEventMap, onLanguageChange as EventListener);
    };
  }, []);

  useEffect(() => {
    resetGoogleTranslatePageOffset();
    if (selectedLanguage().google !== "en") {
      window.setTimeout(applySelectedLanguage, 80);
      scheduleOffsetCleanup();
    }
  }, [pathname]);

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return <div id="google_translate_element" className="google-translate-host notranslate" translate="no" aria-hidden="true" />;
}
