"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { CloseIcon, MenuIcon, SearchIcon, RocketIcon } from "./Icons";

const nav = [
  ["Home", "/"],
  ["About", "/about"],
  ["Creator Hub", "/developer-hub"],
  ["Parental Controls", "/parental-controls"],
  ["News", "/news"],
  ["Careers", "/careers"],
  ["Support", "/support"],
] as const;

const searchItems = [
  { title: "Home", description: "Play, create and connect.", href: "/" },
  { title: "About ESB Games", description: "Our mission, principles and platform vision.", href: "/about" },
  { title: "Creator Hub", description: "ESB Studio, publishing and creator tools.", href: "/developer-hub" },
  { title: "Parental Controls", description: "Safety, family settings and account supervision.", href: "/parental-controls" },
  { title: "News", description: "Company updates, product blogs and announcements.", href: "/news" },
  { title: "Careers", description: "Open roles and life at ESB Games.", href: "/careers" },
  { title: "Support", description: "Help articles, tickets and platform status.", href: "/support" },
  { title: "Create an account", description: "Join ESB Games and reserve your account.", href: "/signup" },
  { title: "Log in", description: "Return to your ESB Games account.", href: "/login" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = searchItems.filter((item) =>
    `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Logo />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {nav.map(([label, href]) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return <Link key={href} href={href} className={active ? "active" : ""}>{label}</Link>;
            })}
          </nav>
          <div className="header-actions">
            <button className="search-button" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <SearchIcon size={19} />
            </button>
            <Link href="/signup" className="button button-primary header-cta">
              <RocketIcon size={17} /> Join Now
            </Link>
            <button className="menu-button" aria-label="Open menu" onClick={() => setMenuOpen((value) => !value)}>
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
            <Link href="/signup">Join Now</Link>
            <Link href="/login">Log In</Link>
          </nav>
        )}
      </header>

      {searchOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSearchOpen(false)}>
          <section className="search-modal" role="dialog" aria-modal="true" aria-label="Search ESB Games" onMouseDown={(e) => e.stopPropagation()}>
            <div className="search-field-wrap">
              <SearchIcon size={20} />
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search pages…" />
              <kbd>ESC</kbd>
            </div>
            <div className="search-results">
              {filtered.length ? filtered.map((item) => (
                <button key={item.href} onClick={() => router.push(item.href)}>
                  <strong>{item.title}</strong><span>{item.description}</span>
                </button>
              )) : <p className="empty-result">No results found.</p>}
            </div>
            <p className="search-tip">Tip: press Ctrl/⌘ + K anywhere to search.</p>
          </section>
        </div>
      )}
    </>
  );
}
