"use client";

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
        const categories = section.categories
          .map((category) => {
            const categoryMatch = `${category.title} ${category.description} ${category.badge || ""}`.toLowerCase().includes(normalized);
            const articles = category.articles.filter((article) => article.title.toLowerCase().includes(normalized));
            return {
              ...category,
              articles: sectionMatch || categoryMatch ? category.articles : articles,
            };
          })
          .filter((category) => category.articles.length > 0);

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
          placeholder="Search accounts, safety, payments, Creator help and more"
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
                <article className="help-category-card" key={category.id}>
                  <header>
                    <div>
                      <h3>{category.title}</h3>
                      <p>{category.description}</p>
                      {category.badge && <span className="help-route-badge">{category.badge}</span>}
                    </div>
                  </header>
                  <ul>
                    {category.articles.map((article) => (
                      <li key={`${category.id}-${article.title}`}>
                        <a href={article.href} target={article.external ? "_blank" : undefined} rel={article.external ? "noreferrer" : undefined}>
                          <span>{article.title}</span><ArrowIcon size={14} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="help-empty-state">No matching help route was found. Contact Support and we’ll route your request to the right team.</div>
      )}
    </>
  );
}
