"use client";

import { Reveal } from "./motion/Reveal";
import {
  XIcon,
  DiscordIcon,
  InstagramIcon,
  TwitchIcon,
  PatreonIcon,
  YouTubeIcon,
} from "./icons/SocialIcons";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-cta">
        <div className="wrap">
          <Reveal>
            <h2>
              STOP GUESSING<br />START PROGRESSING
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <a href="#pricing" className="btn btn-red">
              Book a Call <span className="arrow-up">↑</span>
            </a>
          </Reveal>
        </div>
      </div>

      <div className="footer-socials">
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

      <div className="footer-bar">
        <span className="footer-copyright">
          © 2026 Coach Spilo. All rights reserved.
        </span>
        <div className="footer-contact">
          <a
            href="https://discord.gg/tv2SR9yPMJ"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord <b>coachspilo</b>
          </a>
          <a href="mailto:jacobclifton@protonmail.com">
            Email <b>jacobclifton@protonmail.com</b>
          </a>
        </div>
      </div>
    </footer>
  );
}
