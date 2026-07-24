"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import Logo from "./Logo";
import LanguageSelector from "./LanguageSelector";
import SearchDialog from "./SearchDialog";
import { CloseIcon, MenuIcon, SearchIcon, RocketIcon } from "./Icons";
import { getClientAccountProfile, type SiteAccountProfile } from "@/lib/client/account";

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
const accountHomeUrl = "https://esbgames.com/home";

function AccountButton({ profile, mobile = false }: { profile: SiteAccountProfile | null; mobile?: boolean }) {
  if (!profile) {
    return (
      <a href={accountUrl} className={`button button-primary header-cta${mobile ? " mobile-account-button" : ""}`} data-analytics="join-now">
        <RocketIcon size={17} /> Join Now
      </a>
    );
  }

  const initials = profile.displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || profile.username.slice(0, 2).toUpperCase();

  return (
    <a href={accountHomeUrl} className={`header-account-chip${mobile ? " mobile-account-chip" : ""}`} data-analytics="open-account">
      <span className="header-account-avatar" aria-hidden="true">
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt="" width={30} height={30} />
        ) : (
          initials
        )}
      </span>
      <span className="header-account-copy">
        <strong>{profile.displayName}</strong>
        <small>@{profile.username}</small>
      </span>
    </a>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profile, setProfile] = useState<SiteAccountProfile | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const syncProfile = () => setProfile(getClientAccountProfile());
    syncProfile();
    window.addEventListener("storage", syncProfile);
    window.addEventListener("focus", syncProfile);
    return () => {
      window.removeEventListener("storage", syncProfile);
      window.removeEventListener("focus", syncProfile);
    };
  }, []);

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
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const mobileSecondaryHref = useMemo(() => (profile ? accountHomeUrl : accountUrl), [profile]);
  const mobileSecondaryLabel = profile ? "Open account" : "Log In";

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
            <AccountButton profile={profile} />
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
            <div className="mobile-nav-account-actions">
              <AccountButton profile={profile} mobile />
              <a className="button button-secondary" href={mobileSecondaryHref}>{mobileSecondaryLabel}</a>
            </div>
            <div className="mobile-nav-language"><span>Language</span><LanguageSelector variant="mobile" /></div>
          </div>
        </div>
      )}

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
