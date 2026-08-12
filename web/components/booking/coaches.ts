import type { Format, Tier } from "./SchedulingEvents";

// The coaching packages, keyed by Tier so both coaches' prices can sit on the
// same card. Previously this was keyed by coach (one card set each, swapped by
// a toggle); the section now presents Spilo and Stephano side by side, so a
// tier is the shared identity and each card carries a price row per coach.
//
// Booking still differs per coach: Spilo runs the multi-step modal (format →
// discount → schedule), Stephano redirects to his own Calendly links.

export type Coach = "spilo" | "stephano";

export const COACH_LABEL: Record<Coach, string> = {
  spilo: "Coach Spilo",
  stephano: "Coach Stephano",
};

// Kept for the coach-choice modal (see the follow-up pass) — no longer rendered
// as a toggle tooltip now that the switch is gone from the section.
export const STEPHANO_NOTE =
  "A Spilo-approved coach — more affordable, and often available sooner.";

// How a booking destination behaves:
//   - modal: run the existing booking modal, keyed by Tier (Spilo only)
//   - link:  open a Calendly URL directly in a new tab (Stephano)
export type Booking =
  | { kind: "modal"; tier: Tier }
  | { kind: "link"; url: string };

export type FormatPrice = { format: Format; amount: number };

export type CoachPrice = {
  coach: Coach;
  // Ordered format → amount. The rendered LABEL joins the format names
  // ("YouTube / Private") while the VALUE joins the DISTINCT amounts. That one
  // shape covers both cases: Spilo charges differently per format ("$80 / $90"),
  // Stephano charges one flat price for either, which collapses to "$40".
  amounts: FormatPrice[];
  booking: Booking;
};

export type PackageCard = {
  key: Tier;
  title: string;
  desc: string;
  bullets: string[];
  featured?: boolean;
  coaches: CoachPrice[]; // Stephano first, then Spilo
  booking: Booking; // the card's own CTA
};

// Stephano's real Calendly links. The `?month=...` param from the pasted URLs
// is stripped so the calendar always opens to the current month.
const STEPHANO_30MIN = "https://calendly.com/njoiner1-csub/30min";
const STEPHANO_1HOUR = "https://calendly.com/njoiner1-csub/new-meeting";

export const PACKAGES: PackageCard[] = [
  {
    key: "thirtyMin",
    title: "30-Minute Review",
    desc: "A thorough gameplay review. Join live if you want — or just get the recording.",
    bullets: [
      "A recorded VOD you can keep & rewatch",
      "Personalized practice goals",
    ],
    coaches: [
      {
        coach: "stephano",
        amounts: [{ format: "private", amount: 25 }],
        booking: { kind: "link", url: STEPHANO_30MIN },
      },
      {
        // "default" is the Acuity format key for this tier; it renders as
        // "Private" because the 30-minute review is never posted.
        coach: "spilo",
        amounts: [{ format: "default", amount: 43 }],
        booking: { kind: "modal", tier: "thirtyMin" },
      },
    ],
    booking: { kind: "modal", tier: "thirtyMin" },
  },
  {
    key: "inDepth",
    featured: true,
    title: "1-Hour Individual Coaching",
    desc: "Solve exactly what you need to succeed in Overwatch.",
    bullets: [
      "Maximize your training efficiency",
      "Improve your gameplay mentality",
      "Personalized practice goals",
    ],
    coaches: [
      {
        // Same $40 either way, so the value collapses to a single amount.
        coach: "stephano",
        amounts: [
          { format: "youtube", amount: 40 },
          { format: "private", amount: 40 },
        ],
        booking: { kind: "link", url: STEPHANO_1HOUR },
      },
      {
        coach: "spilo",
        amounts: [
          { format: "youtube", amount: 80 },
          { format: "private", amount: 90 },
        ],
        booking: { kind: "modal", tier: "inDepth" },
      },
    ],
    booking: { kind: "modal", tier: "inDepth" },
  },
  {
    key: "team",
    title: "70-Minute Team Coaching",
    desc: "Solve exactly what your team needs to succeed in Overwatch.",
    bullets: [
      "Address your team's concerns & weakpoints",
      "Improve your team's communication & planning",
      "Personalized practice goals",
    ],
    coaches: [
      {
        // Stephano's team sessions reuse his 1-hour Calendly link until he has
        // a dedicated team event.
        coach: "stephano",
        amounts: [
          { format: "youtube", amount: 40 },
          { format: "private", amount: 40 },
        ],
        booking: { kind: "link", url: STEPHANO_1HOUR },
      },
      {
        coach: "spilo",
        amounts: [
          { format: "youtube", amount: 90 },
          { format: "private", amount: 100 },
        ],
        booking: { kind: "modal", tier: "team" },
      },
    ],
    booking: { kind: "modal", tier: "team" },
  },
];

// Shared by the card price rows and the booking modal's format cards.
export const FORMAT_LABEL: Record<Format, string> = {
  default: "Private",
  youtube: "Posted to YouTube",
  private: "Private",
};

export type PriceRow = { label: string; value: string };

/**
 * The rendered price lines for one coach. A coach charging different amounts per
 * format gets a line each — "Coach Spilo (YouTube)" $80, "Coach Spilo (Private)"
 * $90 — while a flat price collapses to a single unqualified line, since naming
 * the formats only earns its place when it explains a difference.
 */
export function priceRows(price: CoachPrice): PriceRow[] {
  const coach = COACH_LABEL[price.coach];
  const distinct = new Set(price.amounts.map((a) => a.amount));
  if (distinct.size <= 1) {
    return [{ label: coach, value: `$${price.amounts[0].amount}` }];
  }
  return price.amounts.map((a) => ({
    label: `${coach} (${FORMAT_LABEL[a.format]})`,
    value: `$${a.amount}`,
  }));
}

// Single source of truth for Spilo's prices, consumed by the booking modal's
// options step so the card and the modal can't drift apart.
export const SPILO_PRICES: Record<Tier, Partial<Record<Format, number>>> =
  Object.fromEntries(
    PACKAGES.map((card) => [
      card.key,
      Object.fromEntries(
        (card.coaches.find((c) => c.coach === "spilo")?.amounts ?? []).map(
          ({ format, amount }) => [format, amount],
        ),
      ),
    ]),
  ) as Record<Tier, Partial<Record<Format, number>>>;
