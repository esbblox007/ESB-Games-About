"use client";

import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent as ReactMouseEvent } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "./Icons";
import type { SearchResult } from "@/lib/content/types";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

const suggestions = ["Download ESB Studio", "How do I create an account?", "My child’s account", "I forgot my password"];

export default function SearchDialog({ open, onClose }: SearchDialogProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "empty" | "unavailable" | "partial">("idle");
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!open) return;
    window.setTimeout(() => inputRef.current?.focus(), 40);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setState("idle");
      setSelected(0);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setState("loading");
      try {
        const locale = window.localStorage.getItem("esb-language") || "en";
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&locale=${encodeURIComponent(locale)}`, { signal: controller.signal });
        const payload = await response.json() as { results?: SearchResult[]; state?: typeof state };
        setResults(payload.results || []);
        setState(payload.state || "ready");
        setSelected(0);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setState("unavailable");
      }
    }, 180);

    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [query, open]);

  const openResult = (result: SearchResult) => {
    onClose();
    setQuery("");
    if (/^https?:\/\//.test(result.route)) window.location.assign(result.route);
    else router.push(result.route);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") onClose();
    if (event.key === "ArrowDown" && results.length) {
      event.preventDefault();
      setSelected((current) => (current + 1) % results.length);
    }
    if (event.key === "ArrowUp" && results.length) {
      event.preventDefault();
      setSelected((current) => (current - 1 + results.length) % results.length);
    }
    if (event.key === "Enter" && results[selected]) {
      event.preventDefault();
      openResult(results[selected]);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop search-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="search-modal search-modal-expanded" role="dialog" aria-modal="true" aria-labelledby="search-dialog-title" onMouseDown={(event: ReactMouseEvent<HTMLElement>) => event.stopPropagation()}>
        <h2 id="search-dialog-title" className="sr-only">Search ESB Games</h2>
        <div className="search-field-wrap">
          <SearchIcon size={20} />
          <input ref={inputRef} value={query} onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} onKeyDown={onKeyDown} placeholder="Search pages, news, downloads and help…" aria-controls="site-search-results" aria-activedescendant={results[selected] ? `search-result-${selected}` : undefined} />
          <button type="button" className="search-close-button" onClick={onClose} aria-label="Close search">ESC</button>
        </div>

        <div id="site-search-results" className="search-results search-results-expanded" role="listbox" aria-label="Search results">
          {state === "idle" && (
            <div className="search-start-state">
              <strong>Start typing to search ESB Games.</strong>
              <p>Popular searches</p>
              <div>{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => setQuery(suggestion)}>{suggestion}</button>)}</div>
            </div>
          )}
          {state === "loading" && <div className="search-loading" role="status">Searching ESB Games…</div>}
          {(state === "ready" || state === "partial") && results.map((result, index) => (
            <button id={`search-result-${index}`} key={result.id} className={index === selected ? "selected" : ""} type="button" role="option" aria-selected={index === selected} onMouseEnter={() => setSelected(index)} onClick={() => openResult(result)}>
              <span className="search-result-type">{result.type}</span>
              <span className="search-result-copy"><strong>{result.title}</strong><small>{result.matchedText || result.description}</small><em>{result.category} · {result.route}</em></span>
              <span aria-hidden="true">↗</span>
            </button>
          ))}
          {state === "empty" && <div className="search-empty-state"><strong>We couldn’t find an exact match.</strong><p>Try fewer words, search for a product name, or visit Support.</p><div>{suggestions.slice(0, 3).map((suggestion) => <button key={suggestion} type="button" onClick={() => setQuery(suggestion)}>{suggestion}</button>)}</div><a href="/support">Go to Support</a></div>}
          {state === "unavailable" && <div className="search-empty-state"><strong>Search is temporarily unavailable.</strong><p>Please try again or use the main navigation.</p></div>}
          {state === "partial" && <p className="search-partial-note">Some live content could not be searched, so these results may be incomplete.</p>}
        </div>
        <p className="search-tip">Use ↑ and ↓ to move, Enter to open, and Esc to close.</p>
      </section>
    </div>
  );
}
