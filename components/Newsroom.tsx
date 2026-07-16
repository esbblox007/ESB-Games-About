"use client";

import { useMemo, useState } from "react";
import { ArrowIcon } from "./Icons";

const categories = ["All News", "Updates", "Engineering", "Careers", "Community", "Other"] as const;
type Category = (typeof categories)[number];

const articles = [
  {
    category: "Updates",
    label: "Announcement",
    title: "A first look at the ESB Games ecosystem",
    text: "See how play, creation and community are being brought together across one connected platform.",
    meta: "July 2026 · 5 min read",
    art: "portal",
  },
  {
    category: "Updates",
    label: "Update",
    title: "Designing ESB Studio for every creator",
    text: "A closer look at the accessible workflow, advanced tools and collaborative systems planned for ESB Studio.",
    meta: "July 2026 · 4 min read",
    art: "studio",
  },
  {
    category: "Engineering",
    label: "Engineering",
    title: "Building real-time experiences that scale",
    text: "How the ESB Games engineering vision supports responsive worlds, social systems and creator publishing.",
    meta: "July 2026 · 7 min read",
    art: "code",
  },
  {
    category: "Community",
    label: "Community",
    title: "Creating a universe where everyone belongs",
    text: "The principles guiding ESB Games communities, communication and player-led experiences.",
    meta: "Coming soon · 4 min read",
    art: "community",
  },
  {
    category: "Careers",
    label: "Careers",
    title: "Meet the people shaping ESB Games",
    text: "Explore the teams, disciplines and shared ambition behind the next generation of play and creation.",
    meta: "Coming soon · 6 min read",
    art: "team",
  },
  {
    category: "Other",
    label: "Safety",
    title: "Safety and parental controls by design",
    text: "How family tools, account protection and responsible moderation are being planned from day one.",
    meta: "Coming soon · 5 min read",
    art: "safety",
  },
] as const;

export default function Newsroom() {
  const [category, setCategory] = useState<Category>("All News");
  const visible = useMemo(
    () => category === "All News" ? articles : articles.filter((article) => article.category === category),
    [category],
  );

  return (
    <div className="newsroom-layout">
      <section className="newsroom-main" aria-label="Latest ESB Games articles">
        <nav className="newsroom-tabs" aria-label="Filter news articles">
          {categories.map((item) => (
            <button key={item} type="button" className={item === category ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>
          ))}
        </nav>
        <div className="newsroom-list">
          {visible.map((article) => (
            <article className="newsroom-list-card" key={article.title}>
              <div className={`newsroom-thumb ${article.art}`} aria-hidden="true"><i /><b>ESB</b></div>
              <div>
                <span>{article.label}</span>
                <h3>{article.title}</h3>
                <p>{article.text}</p>
                <small>{article.meta}</small>
              </div>
              <button type="button" aria-label={`Read ${article.title}`}><ArrowIcon size={19} /></button>
            </article>
          ))}
        </div>
        <button className="newsroom-view-all" type="button">View All News <ArrowIcon size={16} /></button>
      </section>

      <aside className="newsroom-popular">
        <h2>⌁ Popular Articles</h2>
        {articles.slice(0, 5).map((article, index) => (
          <article key={article.title}>
            <span>{index + 1}</span>
            <div className={`newsroom-mini-art ${article.art}`} aria-hidden="true"><i /></div>
            <div><h3>{article.title}</h3><small>{article.meta.split(" · ")[0]}</small></div>
          </article>
        ))}
        <button type="button">View All Articles <ArrowIcon size={15} /></button>
      </aside>
    </div>
  );
}
