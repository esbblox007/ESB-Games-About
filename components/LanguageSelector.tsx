"use client";

import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent } from "react";

export const languages = [
  { locale: "en", google: "en", label: "English" },
  { locale: "es", google: "es", label: "Español" },
  { locale: "pt-BR", google: "pt", label: "Português do Brasil" },
  { locale: "fr", google: "fr", label: "Français" },
  { locale: "de", google: "de", label: "Deutsch" },
  { locale: "zh-CN", google: "zh-CN", label: "简体中文" },
  { locale: "zh-TW", google: "zh-TW", label: "繁體中文" },
  { locale: "ja", google: "ja", label: "日本語" },
  { locale: "ko", google: "ko", label: "한국어" },
  { locale: "id", google: "id", label: "Bahasa Indonesia" },
  { locale: "hi", google: "hi", label: "हिन्दी" },
] as const;

function setTranslationCookie(googleCode: string) {
  const reset = googleCode === "en";
  const expires = reset ? "Thu, 01 Jan 1970 00:00:00 GMT" : "Fri, 31 Dec 9999 23:59:59 GMT";
  const value = reset ? "" : `/en/${googleCode}`;
  document.cookie = `googtrans=${value};expires=${expires};path=/;SameSite=Lax`;

  const hostname = window.location.hostname;
  const parentDomain = hostname.split(".").slice(-2).join(".");
  if (hostname.includes(".")) {
    document.cookie = `googtrans=${value};expires=${expires};path=/;domain=.${hostname};SameSite=Lax`;
    if (parentDomain !== hostname) document.cookie = `googtrans=${value};expires=${expires};path=/;domain=.${parentDomain};SameSite=Lax`;
  }
}

export default function LanguageSelector({ variant = "footer" }: { variant?: "footer" | "mobile" }) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [locale, setLocale] = useState("en");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const saved = window.localStorage.getItem("esb-language");
    if (saved && languages.some((language) => language.locale === saved)) setLocale(saved);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    window.setTimeout(() => searchRef.current?.focus(), 20);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return normalized ? languages.filter((language) => language.label.toLowerCase().includes(normalized) || language.locale.toLowerCase().includes(normalized)) : languages;
  }, [query]);

  useEffect(() => setActiveIndex(0), [query, open]);

  const selected = languages.find((language) => language.locale === locale) || languages[0];

  const selectLanguage = (nextLocale: string) => {
    const language = languages.find((item) => item.locale === nextLocale) || languages[0];
    setLocale(language.locale);
    setOpen(false);
    setQuery("");
    window.localStorage.setItem("esb-language", language.locale);
    document.documentElement.lang = language.locale;
    setTranslationCookie(language.google);
    window.dispatchEvent(new CustomEvent("esb-language-change", { detail: { locale: language.locale, google: language.google } }));

    const googleSelect = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (googleSelect) {
      googleSelect.value = language.google;
      googleSelect.dispatchEvent(new Event("change"));
    } else {
      window.setTimeout(() => window.location.reload(), 80);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!open && ["Enter", " ", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (event.key === "Escape") { setOpen(false); return; }
    if (event.key === "ArrowDown") { event.preventDefault(); setActiveIndex((index) => (index + 1) % Math.max(filtered.length, 1)); }
    if (event.key === "ArrowUp") { event.preventDefault(); setActiveIndex((index) => (index - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1)); }
    if (event.key === "Enter" && filtered[activeIndex]) { event.preventDefault(); selectLanguage(filtered[activeIndex].locale); }
  };

  return (
    <div ref={rootRef} className={`language-selector language-selector-${variant} notranslate`} translate="no" onKeyDown={onKeyDown}>
      <button type="button" className="language-trigger" aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}-menu`} onClick={() => setOpen((value) => !value)}>
        <span className="language-globe" aria-hidden="true">◎</span>
        <span>{selected.label}</span>
        <span className="language-chevron" aria-hidden="true">⌄</span>
      </button>
      {open && (
        <div id={`${id}-menu`} className="language-menu" role="listbox" aria-label="Choose language">
          <label className="language-search"><span className="sr-only">Search languages</span><input ref={searchRef} value={query} onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} placeholder="Search languages" /></label>
          <div className="language-options">
            {filtered.map((language, index) => (
              <button id={`${id}-option-${index}`} type="button" role="option" aria-selected={language.locale === locale} className={`${index === activeIndex ? "active" : ""}${language.locale === locale ? " selected" : ""}`} key={language.locale} onMouseEnter={() => setActiveIndex(index)} onClick={() => selectLanguage(language.locale)}>
                <span lang={language.locale}>{language.label}</span>
                {language.locale === locale && <span aria-hidden="true">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
