"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SearchIcon, ArrowIcon } from "./Icons";
import { helpSections } from "@/lib/content/help-centre";

export default function HelpCentreBrowser() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalized) return helpSections;

    return helpSections
      .map((section) => {
        const sectionMatch = `${section.eyebrow} ${section.title} ${section.description}`.toLowerCase().includes(normalized);
        const categories = section.categories.filter((category) => {
          const categoryText = `${category.title} ${category.description} ${category.badge || ""} ${category.articles.map((article) => article.title).join(" ")}`.toLowerCase();
          return sectionMatch || categoryText.includes(normalized);
        });
        return { ...section, categories };
      })
      .filter((section) => section.categories.length > 0);
  }, [normalized]);

  return (
    <>
      <label className="help-search-shell help-search-wide" htmlFor="help-search">
        <SearchIcon size={20} />
        <input
          id="help-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="Search accounts, safety, payments, creator help and more"
          autoComplete="off"
        />
      </label>

      <div className="help-section-stack" aria-live="polite">
        {filtered.map((section) => (
          <section className="help-topic-section" key={section.id}>
            <header className="help-topic-section-header">
              <div>
                <span className="eyebrow">{section.eyebrow}</span>
                <h3>{section.title}</h3>
              </div>
              <p>{section.description}</p>
            </header>

            <div className="help-category-grid">
              {section.categories.map((category) => (
                <Link className="help-category-card help-category-card-link" href={`/help/${category.id}`} key={category.id}>
                  <span className="help-category-card-copy">
                    <span className="help-category-card-heading"><strong>{category.title}</strong>{category.badge && <span className="help-route-badge">{category.badge}</span>}</span>
                    <span>{category.description}</span>
                    <small>{category.articles.length} {category.articles.length === 1 ? "route" : "routes"}</small>
                  </span>
                  <ArrowIcon size={16} />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="help-empty-state">No matching Help Centre topic was found. You can still open Support and we’ll route the request to the right team.</div>
      )}
    </>
  );
}
