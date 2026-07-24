"use client";

import { useEffect } from "react";
import { languages } from "./LanguageSelector";

declare global {
  interface Window {
    google?: { translate?: { TranslateElement?: new (options: Record<string, unknown>, elementId: string) => unknown } };
    googleTranslateElementInit?: () => void;
  }
}

const supportedLanguages = languages.map((language) => language.google).join(",");

function applySavedLanguage() {
  const savedLocale = window.localStorage.getItem("esb-language") || "en";
  const language = languages.find((item) => item.locale === savedLocale) || languages[0];
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
  applySavedLanguage();
}

export default function SiteTranslator() {
  useEffect(() => {
    applySavedLanguage();
    window.googleTranslateElementInit = initialiseTranslator;
    const onLanguageChange = () => applySavedLanguage();
    window.addEventListener("esb-language-change", onLanguageChange);

    if (window.google?.translate?.TranslateElement) initialiseTranslator();
    else if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    return () => window.removeEventListener("esb-language-change", onLanguageChange);
  }, []);

  return <div id="google_translate_element" className="google-translate-host notranslate" translate="no" aria-hidden="true" />;
}
