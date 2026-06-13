// Calendly event URLs — one per (tier × format × discount) combination.
//
// Spilo's setup-day task: create 11 event types in Calendly (each with
// Stripe payment enabled and the correct price), then swap these URLs.
// The Team tier has no Patreon/Twitch discounts, so it only needs the
// `full` slot.
//
// Pattern: https://calendly.com/{username}/{event-type-slug}

export type Tier = "thirtyMin" | "inDepth" | "team";
export type Format = "default" | "youtube" | "private";
export type Discount = "full" | "patreon" | "twitch";

type EventMap = Partial<Record<Format, Partial<Record<Discount, string>>>>;

export const CALENDLY_EVENTS: Record<Tier, EventMap> = {
  thirtyMin: {
    default: {
      full:    "https://calendly.com/ryoanything/30-minute-coaching",
      patreon: "https://calendly.com/ryoanything/30-minute-coaching-patreon",
      twitch:  "https://calendly.com/ryoanything/30-minute-coaching-twitch",
    },
  },
  inDepth: {
    youtube: {
      full:    "https://calendly.com/ryoanything/1-hour-coaching-private-clone",
      patreon: "https://calendly.com/ryoanything/1-hour-coaching-youtube-patreon",
      twitch:  "https://calendly.com/ryoanything/1-hour-coaching-youtube-twitch",
    },
    private: {
      full:    "https://calendly.com/ryoanything/1-hour-coaching",
      patreon: "https://calendly.com/ryoanything/1-hour-coaching-private-patreon",
      twitch:  "https://calendly.com/ryoanything/1-hour-coaching-private-twitch",
    },
  },
  team: {
    // Team tier has no discounted variants.
    youtube: { full: "https://calendly.com/ryoanything/70-minute-team-coaching-private-clone" },
    private: { full: "https://calendly.com/ryoanything/70-minute-team-coaching" },
  },
};

// Static metadata per tier — used by the booking modal to decide which
// steps to render and what to label them.
export const TIER_META: Record<Tier, {
  label: string;
  formats: Format[];
  discountsApply: boolean;
}> = {
  thirtyMin: {
    label: "30 Minute Gameplay Review",
    formats: ["default"],
    discountsApply: true,
  },
  inDepth: {
    label: "In-Depth Coaching Call",
    formats: ["youtube", "private"],
    discountsApply: true,
  },
  team: {
    label: "Complete Team Analysis Call",
    formats: ["youtube", "private"],
    discountsApply: false,
  },
};
