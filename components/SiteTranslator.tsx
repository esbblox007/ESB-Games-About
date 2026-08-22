"use client";

import { useEffect } from "react";
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
  // Google Translate can inject a banner directly under <body>. When that
  // happens before a sticky header, the banner's layout space becomes the
  // large blank strip visible above the ESB navigation after client routing.
  // The translator host itself is excluded so language switching still works.
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

  // Google sometimes switches body to position:relative when it attempts to
  // reserve space for its banner. The ESB layout does not need that offset.
  forceImportantStyle(document.body, "position", "static");

  const header = document.querySelector<HTMLElement>(".site-header");
  if (header) {
    forceImportantStyle(header, "top", "0px");
    forceImportantStyle(header, "inset-block-start", "0px");
    forceImportantStyle(header, "margin-top", "0px");
    forceImportantStyle(header, "transform", "none");
    forceImportantStyle(header, "translate", "none");
  }
}

function scheduleOffsetCleanup() {
  const delays = [0, 40, 120, 300, 650, 1200, 2200];
  const timers = delays.map((delay) => window.setTimeout(resetGoogleTranslatePageOffset, delay));
  return () => timers.forEach((timer) => window.clearTimeout(timer));
}

function applySelectedLanguage() {
  resetGoogleTranslatePageOffset();
  const preferredLocale = resolvePreferredLocale();
  const language = languages.find((item) => item.locale === preferredLocale) || languages[0];
  document.documentElement.lang = language.locale;
  if (language.google === "en") return;
  window.setTimeout(() => {
    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select && select.value !== language.google) {
      select.value = language.google;
      select.dispatchEvent(new Event("change"));
    }
  }, 400);
}

function initialiseTranslator() {
  const target = document.getElementById("google_translate_element");
  if (!target || target.dataset.ready === "true") return;
  const TranslateElement = window.google?.translate?.TranslateElement;
  if (!TranslateElement) return;
  new TranslateElement({ pageLanguage: "en", includedLanguages: supportedLanguages, autoDisplay: false, multilanguagePage: true }, "google_translate_element");
  target.dataset.ready = "true";
  applySelectedLanguage();
}

export default function SiteTranslator() {
  const pathname = usePathname();

  useEffect(() => {
    resetGoogleTranslatePageOffset();
    const cancelScheduledCleanup = scheduleOffsetCleanup();
    applySelectedLanguage();

    const offsetObserver = new MutationObserver(() => resetGoogleTranslatePageOffset());
    offsetObserver.observe(document.body, {
      childList: true,
      subtree: false,
      attributes: true,
      attributeFilter: ["style", "class"],
    });
    offsetObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    window.googleTranslateElementInit = initialiseTranslator;
    const onLanguageChange = () => {
      applySelectedLanguage();
      scheduleOffsetCleanup();
    };
    window.addEventListener("esb-language-change" as keyof WindowEventMap, onLanguageChange as EventListener);

    if (window.google?.translate?.TranslateElement) initialiseTranslator();
    else if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    return () => {
      cancelScheduledCleanup();
      offsetObserver.disconnect();
      window.removeEventListener("esb-language-change" as keyof WindowEventMap, onLanguageChange as EventListener);
    };
  }, [pathname]);

  return <div id="google_translate_element" className="google-translate-host notranslate" translate="no" aria-hidden="true" />;
}
