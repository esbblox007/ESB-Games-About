"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import Logo from "./Logo";
import LanguageSelector from "./LanguageSelector";
import SearchDialog from "./SearchDialog";
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

const accountUrl = "https://esbgames.com/login";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = menuRef.current?.querySelector<HTMLElement>("a,button");
    window.setTimeout(() => first?.focus(), 20);
    return () => { document.body.style.overflow = previous; };
  }, [menuOpen]);

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Logo />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {nav.map(([label, href]) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return <Link key={href} href={href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>{label}</Link>;
            })}
          </nav>
          <div className="header-actions">
            <button className="search-button" aria-label="Search ESB Games" onClick={() => setSearchOpen(true)} aria-keyshortcuts="Control+K Meta+K">
              <SearchIcon size={19} />
            </button>
            <a href={accountUrl} className="button button-primary header-cta" data-analytics="join-now">
              <RocketIcon size={17} /> Join Now
            </a>
            <button className="menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((value) => !value)}>
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-nav-backdrop" role="presentation" onMouseDown={() => setMenuOpen(false)}>
          <div id="mobile-navigation" className="mobile-nav-sheet" ref={menuRef} role="dialog" aria-modal="true" aria-label="Site navigation" onMouseDown={(event: ReactMouseEvent<HTMLDivElement>) => event.stopPropagation()}>
            <div className="mobile-nav-heading"><strong>Menu</strong><button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><CloseIcon /></button></div>
            <button className="mobile-search-action" type="button" onClick={() => { setMenuOpen(false); setSearchOpen(true); }}><SearchIcon size={18} /> Search ESB Games</button>
            <nav className="mobile-nav" aria-label="Mobile navigation">
              {nav.map(([label, href]) => {
                const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return <Link key={href} href={href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>{label}</Link>;
              })}
            </nav>
            <div className="mobile-nav-account-actions"><a className="button button-primary" href={accountUrl}><RocketIcon size={17} /> Join Now</a><a className="button button-secondary" href={accountUrl}>Log In</a></div>
            <div className="mobile-nav-language"><span>Language</span><LanguageSelector variant="mobile" /></div>
          </div>
        </div>
      )}

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
