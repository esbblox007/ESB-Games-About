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
  ["Families", "/parental-controls"],
  ["News", "/news"],
  ["Careers", "/careers"],
  ["Support", "/support"],
] as const;

const platformUrl = "https://esbgames.com";
const loginUrl = "https://esbgames.com/login";
const settingsUrl = "https://esbgames.com/settings";
const switchAccountsUrl = "https://esbgames.com/login?switch=1";

type AccountSession = {
  authenticated: boolean;
  account?: {
    id: string;
    username: string;
    displayName: string;
    email: string | null;
    avatarUrl?: string | null;
  };
};

function JoinButton({ mobile = false }: { mobile?: boolean }) {
  return (
    <a href={platformUrl} className={`button button-primary header-cta${mobile ? " mobile-account-button" : ""}`} data-analytics="explore-platform">
      <RocketIcon size={17} /> Explore Platform
    </a>
  );
}

function initials(value: string) {
  return value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "ES";
}

function HeaderAccount({ mobile = false }: { mobile?: boolean }) {
  const [session, setSession] = useState<AccountSession | null>(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/support/account-session", { credentials: "include", cache: "no-store" })
      .then((response) => response.ok ? response.json() as Promise<AccountSession> : null)
      .then((body) => { if (active) setSession(body ?? { authenticated: false }); })
      .catch(() => { if (active) setSession({ authenticated: false }); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", close);
    window.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", key);
    };
  }, [open]);

  if (!session) return <span className={`header-account-loading${mobile ? " mobile" : ""}`} aria-hidden="true" />;
  if (!session.authenticated || !session.account) return mobile ? <><JoinButton mobile /><a className="button button-secondary" href={loginUrl}>Log In</a></> : <JoinButton />;

  const account = session.account;
  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(account.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  const signOut = async () => {
    try { await fetch("/api/account/logout", { method: "POST", credentials: "include", cache: "no-store" }); }
    finally { window.location.reload(); }
  };

  if (mobile) {
    return (
      <div className="mobile-signed-in-account">
        <div className="mobile-signed-in-head">
          <span className={`header-account-avatar${account.avatarUrl ? " has-photo" : ""}`} style={account.avatarUrl ? { backgroundImage: `url("${account.avatarUrl.replace(/"/g, "%22")}")` } : undefined}>{account.avatarUrl ? null : initials(account.displayName || account.username)}</span>
          <div><small>Signed in as</small><strong>{account.username}</strong></div>
        </div>
        <a href={settingsUrl}>Settings</a>
        <button type="button" onClick={() => void copyId()}>{copied ? "User ID copied" : "Copy User ID"}</button>
        <a href={switchAccountsUrl}>Switch accounts</a>
        <button type="button" className="danger" onClick={() => void signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div className="header-account-wrap" ref={wrapperRef}>
      <button className="header-account-button" type="button" aria-label={`Open account menu for ${account.username}`} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span className={`header-account-avatar${account.avatarUrl ? " has-photo" : ""}`} style={account.avatarUrl ? { backgroundImage: `url("${account.avatarUrl.replace(/"/g, "%22")}")` } : undefined}>{account.avatarUrl ? null : initials(account.displayName || account.username)}</span>
      </button>
      {open ? <div className="header-account-menu" role="menu">
        <div className="header-account-menu-head"><small>Signed in as</small><strong>{account.username}</strong></div>
        <a role="menuitem" href={settingsUrl}>Settings</a>
        <div className="header-account-menu-separator" />
        <button role="menuitem" type="button" onClick={() => void copyId()}>{copied ? "User ID copied" : "Copy User ID"}</button>
        <a role="menuitem" href={switchAccountsUrl}>Switch accounts</a>
        <div className="header-account-menu-separator" />
        <button role="menuitem" type="button" className="danger" onClick={() => void signOut()}>Sign out</button>
      </div> : null}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuPreviousFocusRef = useRef<HTMLElement | null>(null);

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
    menuPreviousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = menuRef.current?.querySelector<HTMLElement>("a,button");
    window.setTimeout(() => first?.focus(), 20);
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(menuRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])") || []);
      if (!focusable.length) return;
      const firstItem = focusable[0];
      const lastItem = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) { event.preventDefault(); lastItem.focus(); }
      else if (!event.shiftKey && document.activeElement === lastItem) { event.preventDefault(); firstItem.focus(); }
    };
    window.addEventListener("keydown", trapFocus);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", trapFocus);
      menuPreviousFocusRef.current?.focus();
    };
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
            <button className="search-button" aria-label="Search ESB Games" onClick={() => setSearchOpen(true)} aria-keyshortcuts="Control+K Meta+K"><SearchIcon size={19} /></button>
            <HeaderAccount />
            <button className="menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <CloseIcon /> : <MenuIcon />}</button>
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
            <div className="mobile-nav-account-actions"><HeaderAccount mobile /></div>
            <div className="mobile-nav-language"><span>Language</span><LanguageSelector variant="mobile" /></div>
          </div>
        </div>
      )}

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
