"use client";

import { useEffect, useState } from "react";

const languages = [
  ["en", "English"],
  ["es", "Español"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["it", "Italiano"],
  ["pt", "Português"],
  ["nl", "Nederlands"],
  ["pl", "Polski"],
  ["ja", "日本語"],
  ["ko", "한국어"],
] as const;

function setTranslationCookie(language: string) {
  const expires = language === "en" ? "Thu, 01 Jan 1970 00:00:00 GMT" : "Fri, 31 Dec 9999 23:59:59 GMT";
  const value = language === "en" ? "" : `/en/${language}`;
  document.cookie = `googtrans=${value};expires=${expires};path=/;SameSite=Lax`;

  const hostname = window.location.hostname;
  if (hostname.includes(".")) {
    document.cookie = `googtrans=${value};expires=${expires};path=/;domain=.${hostname};SameSite=Lax`;
    const parts = hostname.split(".");
    if (parts.length > 2) {
      const parentDomain = parts.slice(-2).join(".");
      document.cookie = `googtrans=${value};expires=${expires};path=/;domain=.${parentDomain};SameSite=Lax`;
    }
  }
}

export default function LanguageSelector() {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("esb-language");
    if (saved && languages.some(([value]) => value === saved)) setLanguage(saved);
  }, []);

  const changeLanguage = (nextLanguage: string) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem("esb-language", nextLanguage);
    setTranslationCookie(nextLanguage);

    const googleSelect = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (googleSelect) {
      googleSelect.value = nextLanguage;
      googleSelect.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  };

  return (
    <label className="footer-language-selector">
      <span aria-hidden="true">🌐</span>
      <select aria-label="Select language" value={language} onChange={(event) => changeLanguage(event.target.value)}>
        {languages.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
      </select>
    </label>
  );
}
