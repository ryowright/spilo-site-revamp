import type { Tier } from "./SchedulingEvents";

// A second coach (Stephano) is offered alongside Spilo. The coaching section
// renders one coach's cards at a time via a toggle. Spilo's cards book through
// the existing multi-step modal (format → discount → schedule); Stephano's
// redirect straight to his own Calendly links.

export type Coach = "spilo" | "stephano";

type PriceRow = { label: string; amount: number };

// How a card books:
//   - modal: run the existing booking modal, keyed by Tier (Spilo only)
//   - link:  open a Calendly URL directly in a new tab (Stephano)
export type Booking =
  | { kind: "modal"; tier: Tier }
  | { kind: "link"; url: string };

export type PackageCard = {
  key: string;
  len: string; // "30 min · Individual"
  title: string; // may contain "\n" for a manual line break
  desc: string;
  bullets: string[];
  featured?: boolean;
  prices: PriceRow[]; // one or two rows
  sub?: string; // e.g. "Discount for Patreon / Twitch subs"
  booking: Booking;
};

export type CoachConfig = {
  id: Coach;
  label: string; // "Coach Spilo"
  note?: string; // context line shown when this coach is selected
  cards: PackageCard[];
};

// Stephano's real Calendly links. The `?month=...` param from the pasted URLs
// is stripped so the calendar always opens to the current month.
const STEPHANO_30MIN = "https://calendly.com/njoiner1-csub/30min";
const STEPHANO_1HOUR = "https://calendly.com/njoiner1-csub/new-meeting";

export const COACHES: Record<Coach, CoachConfig> = {
  spilo: {
    id: "spilo",
    label: "Coach Spilo",
    cards: [
      {
        key: "spilo-30",
        len: "30 min · Individual",
        title: "30 Minute Gameplay Review",
        desc: "A thorough gameplay review, recorded and sent to you. Request to be in-call if you'd like — not required.",
        bullets: [
          "A list of practice goals for your hero",
          "Answers to any & all questions",
        ],
        prices: [{ label: "30-minute review", amount: 43 }],
        sub: "Discount for Patreon / Twitch subs",
        booking: { kind: "modal", tier: "thirtyMin" },
      },
      {
        key: "spilo-indepth",
        featured: true,
        len: "1 hour · Individual",
        title: "In-Depth\nCoaching Call",
        desc: "Solve exactly what you need to succeed in Overwatch — inside and outside the game.",
        bullets: [
          "Maximize your training efficiency",
          "Improve your gameplay mentality",
          "A list of practice goals for your hero",
          "Answers to any & all questions",
        ],
        prices: [
          { label: "Posted to YouTube", amount: 80 },
          { label: "Private", amount: 90 },
        ],
        sub: "Discount for Patreon / Twitch subs",
        booking: { kind: "modal", tier: "inDepth" },
      },
      {
        key: "spilo-team",
        len: "70 min · Team",
        title: "Complete Team Analysis Call",
        desc: "Solve exactly what your team needs to succeed in Overwatch — inside and outside the game.",
        bullets: [
          "Address your team's concerns & weakpoints",
          "Improve your team's communication & planning",
          "Grow your understanding and execution of compositional Macro",
          "A list of practice goals for your team",
          "Answers to any & all questions",
        ],
        prices: [
          { label: "Posted to YouTube", amount: 90 },
          { label: "Private", amount: 100 },
        ],
        sub: "Sessions billed at the listed price",
        booking: { kind: "modal", tier: "team" },
      },
    ],
  },
  stephano: {
    id: "stephano",
    label: "Coach Stephano",
    note: "A Spilo-approved coach — more affordable, and often available sooner.",
    cards: [
      {
        key: "steph-30",
        len: "30 min · Individual",
        title: "30 Minute Gameplay Review",
        desc: "A thorough gameplay review, recorded and sent to you. Request to be in-call if you'd like — not required.",
        bullets: [
          "A list of practice goals for your hero",
          "Answers to any & all questions",
        ],
        prices: [{ label: "30-minute session", amount: 25 }],
        booking: { kind: "link", url: STEPHANO_30MIN },
      },
      {
        key: "steph-1hr",
        len: "1 hour · Individual",
        title: "In-Depth\nCoaching Call",
        desc: "Solve exactly what you need to succeed in Overwatch — inside and outside the game.",
        bullets: [
          "Maximize your training efficiency",
          "Improve your gameplay mentality",
          "A list of practice goals for your hero",
          "Answers to any & all questions",
        ],
        prices: [{ label: "1-hour session", amount: 40 }],
        booking: { kind: "link", url: STEPHANO_1HOUR },
      },
    ],
  },
};
