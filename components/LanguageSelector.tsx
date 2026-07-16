"use client";

import { useEffect, useState } from "react";

const languages = [
  ["en-GB", "English (UK)"],
  ["en-US", "English (US)"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["es", "Español"],
] as const;

export default function LanguageSelector() {
  const [language, setLanguage] = useState("en-GB");

  useEffect(() => {
    const saved = window.localStorage.getItem("esb-language");
    if (saved && languages.some(([value]) => value === saved)) setLanguage(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("esb-language", language);
  }, [language]);

  return (
    <label className="footer-language-selector">
      <span aria-hidden="true">🌐</span>
      <select aria-label="Select language" value={language} onChange={(event) => setLanguage(event.target.value)}>
        {languages.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
      </select>
    </label>
  );
}
