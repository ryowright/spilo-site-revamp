"use client";

import { useEffect, useState } from "react";
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
  { id: "session", label: "The Session" },
  { id: "pricing", label: "Coaching" },
  { id: "about", label: "About" },
  { id: "faq", label: "FAQ" },
] as const;

export function SiteNav() {
  const [activeId, setActiveId] = useState<string | null>(null);

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
    <nav className="site-nav">
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
            Schedule a call
          </a>
        </div>
      </div>
    </nav>
  );
}
