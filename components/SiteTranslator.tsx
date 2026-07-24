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

function applySelectedLanguage() {
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
    applySelectedLanguage();
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

    return () => window.removeEventListener("esb-language-change" as keyof WindowEventMap, onLanguageChange as EventListener);
  }, []);

  return <div id="google_translate_element" className="google-translate-host notranslate" translate="no" aria-hidden="true" />;
}
