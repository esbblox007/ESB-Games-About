"use client";

import { useEffect } from "react";
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

function resetGoogleTranslatePageOffset() {
  forceImportantStyle(document.body, "top", "0px");
  forceImportantStyle(document.body, "margin-top", "0px");
  forceImportantStyle(document.body, "position", "static");
  forceImportantStyle(document.documentElement, "top", "0px");
  forceImportantStyle(document.documentElement, "margin-top", "0px");
  document.querySelector<HTMLElement>(".site-header")?.style.removeProperty("transform");
  document.querySelectorAll<HTMLElement>("body > .skiptranslate:not(.google-translate-host), .goog-te-banner-frame").forEach((element) => {
    forceImportantStyle(element, "display", "none");
    forceImportantStyle(element, "height", "0px");
  });
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
  useEffect(() => {
    resetGoogleTranslatePageOffset();
    applySelectedLanguage();
    const offsetObserver = new MutationObserver(resetGoogleTranslatePageOffset);
    offsetObserver.observe(document.body, { childList: true, subtree: false, attributes: true, attributeFilter: ["style"] });
    offsetObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
    window.googleTranslateElementInit = initialiseTranslator;
    const onLanguageChange = () => applySelectedLanguage();
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
      offsetObserver.disconnect();
      window.removeEventListener("esb-language-change" as keyof WindowEventMap, onLanguageChange as EventListener);
    };
  }, []);

  return <div id="google_translate_element" className="google-translate-host notranslate" translate="no" aria-hidden="true" />;
}
