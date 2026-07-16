"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: new (
          options: Record<string, unknown>,
          elementId: string,
        ) => unknown;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

const supportedLanguages = "en,es,fr,de,it,pt,nl,pl,ja,ko";

function initialiseTranslator() {
  const target = document.getElementById("google_translate_element");
  if (!target || target.dataset.ready === "true") return;
  const TranslateElement = window.google?.translate?.TranslateElement;
  if (!TranslateElement) return;

  new TranslateElement(
    {
      pageLanguage: "en",
      includedLanguages: supportedLanguages,
      autoDisplay: false,
      multilanguagePage: true,
    },
    "google_translate_element",
  );
  target.dataset.ready = "true";

  const saved = window.localStorage.getItem("esb-language");
  if (saved && saved !== "en") {
    window.setTimeout(() => {
      const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (select && select.value !== saved) {
        select.value = saved;
        select.dispatchEvent(new Event("change"));
      }
    }, 350);
  }
}

export default function SiteTranslator() {
  useEffect(() => {
    window.googleTranslateElementInit = initialiseTranslator;

    if (window.google?.translate?.TranslateElement) {
      initialiseTranslator();
      return;
    }

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return <div id="google_translate_element" className="google-translate-host" aria-hidden="true" />;
}
