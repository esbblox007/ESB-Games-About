"use client";

import { useMemo, useState } from "react";
import { SearchIcon, ArrowIcon } from "./Icons";
import { helpCategories } from "@/lib/content/help-centre";

export default function HelpCentreBrowser() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!normalized) return helpCategories;
    return helpCategories
      .map((category) => ({
        ...category,
        articles: category.articles.filter((article) =>
          `${article.title} ${category.title} ${category.description}`.toLowerCase().includes(normalized),
        ),
      }))
      .filter((category) =>
        category.articles.length > 0 || `${category.title} ${category.description}`.toLowerCase().includes(normalized),
      );
  }, [normalized]);

  return (
    <>
      <label className="help-search-shell" htmlFor="help-search">
        <SearchIcon size={20} />
        <input
          id="help-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="Search the Help Centre"
          autoComplete="off"
        />
      </label>

      <div className="help-category-grid" aria-live="polite">
        {filtered.map((category) => (
          <article className="help-category-card" key={category.id}>
            <header><div><h3>{category.title}</h3><p>{category.description}</p></div></header>
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
      {filtered.length === 0 && <div className="help-empty-state">No matching topic was found. Contact Support and we’ll route your request.</div>}
    </>
  );
}
