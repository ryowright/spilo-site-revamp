"use client";

import { useEffect, useRef, useState } from "react";
import {
  XIcon,
  DiscordIcon,
  InstagramIcon,
  TwitchIcon,
  PatreonIcon,
  YouTubeIcon,
} from "./icons/SocialIcons";

const SECTIONS = [
  { id: "testimonials", label: "Results" },
  { id: "about", label: "About" },
  { id: "pricing", label: "Coaching" },
  { id: "session", label: "The Session" },
  { id: "faq", label: "FAQ" },
] as const;

export function SiteNav() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // While the mobile menu is open, close it on Escape or on any pointer press
  // outside the nav (tap-outside-to-close). Presses on the hamburger or a link
  // land inside the nav, so those are left to their own handlers.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    const targets = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (targets.length === 0) return;

    // Track which sections currently intersect the detection band. As the
    // user scrolls, we pick the last (DOM-order) intersecting section as
    // the active one — matches intuition when scrolling down and self-
    // corrects quickly when scrolling up.
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const active =
          SECTIONS.map((s) => s.id).filter((id) => visible.has(id)).pop() ??
          null;
        setActiveId(active);
      },
      {
        // Thin band ~30% from the top of the viewport. Sections cross it
        // as the user scrolls; the crossed section is "current".
        rootMargin: "-30% 0px -65% 0px",
        threshold: 0,
      },
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="site-nav" ref={navRef}>
      <div className="nav-inner">
        <a className="brand" href="#top" aria-label="Spilo home">
          <span className="mark">SPILO</span>
        </a>
        <div className="nav-links">
          {SECTIONS.map(({ id, label }) => {
            const isActive = activeId === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                className={isActive ? "is-active" : undefined}
                aria-current={isActive ? "location" : undefined}
              >
                {label}
              </a>
            );
          })}
        </div>
        <div className="nav-right">
          <div className="socials">
            <a
              href="https://discord.gg/tv2SR9yPMJ"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
            >
              <DiscordIcon />
            </a>
            <a
              href="https://www.patreon.com/Spilo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Patreon"
            >
              <PatreonIcon />
            </a>
            <a
              href="https://www.youtube.com/@CoachSpilo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <YouTubeIcon />
            </a>
            <a
              href="https://www.twitch.tv/spilo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitch"
            >
              <TwitchIcon />
            </a>
            <a
              href="https://twitter.com/Coach_Spilo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X / Twitter"
            >
              <XIcon />
            </a>
            <a
              href="https://www.instagram.com/coach_spilo/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          </div>
          <a href="#pricing" className="btn btn-red btn-sm">
            Schedule a Call
          </a>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={menuOpen}
            aria-controls="nav-mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="nav-toggle-box" aria-hidden="true">
              <span className="nav-toggle-bar" />
              <span className="nav-toggle-bar" />
              <span className="nav-toggle-bar" />
            </span>
          </button>
        </div>
      </div>
      {/* Mobile-only dropdown — the section links that are hidden from the top
          bar below 940px. */}
      <div
        id="nav-mobile-menu"
        className={`nav-mobile${menuOpen ? " is-open" : ""}`}
      >
        {SECTIONS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={activeId === id ? "is-active" : undefined}
            aria-current={activeId === id ? "location" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
