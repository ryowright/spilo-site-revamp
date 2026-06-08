import {
  XIcon,
  DiscordIcon,
  InstagramIcon,
  TwitchIcon,
  PatreonIcon,
  YouTubeIcon,
} from "./icons/SocialIcons";

export function SiteNav() {
  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <a className="brand" href="#top" aria-label="Spilo home">
          <span className="mark">SPILO</span>
          <span className="dot"></span>
        </a>
        <div className="nav-links">
          <a href="#testimonials">Results</a>
          <a href="#pricing">Coaching</a>
          <a href="#about">About</a>
          <a href="#faq">FAQ</a>
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
