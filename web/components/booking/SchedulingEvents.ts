// Acuity Scheduling appointment-type URLs — one per (tier × format × discount)
// combination. Spilo books through Acuity (Stephano still uses Calendly, see
// coaches.ts).
//
// The owner ID + appointment-type IDs are public identifiers (they end up in
// the iframe src regardless), but we read them from NEXT_PUBLIC_ACUITY_* env so
// the real IDs aren't committed and a deploy without them configured has
// booking safely DISABLED: any unset value → undefined → resolveAcuityUrl
// returns null → the schedule step shows its "message Spilo directly" fallback.
// Set them in .env.local for dev and in Vercel (Production) at launch.
// See .env.local.example for the full list.
//
// There are 8 distinct appointment types: a SINGLE discounted type per format
// shared by Patreon + Twitch (the discounts don't stack), so both discount
// slots point at the same ID. Team has no discounts (full only).

export type Tier = "thirtyMin" | "inDepth" | "team";
export type Format = "default" | "youtube" | "private";
export type Discount = "full" | "patreon" | "twitch";

type EventMap = Partial<Record<Format, Partial<Record<Discount, string>>>>;

// Read in the literal `process.env.NEXT_PUBLIC_*` form so Next.js inlines the
// values into the client bundle at build time (aliasing process.env breaks it).
const OWNER = process.env.NEXT_PUBLIC_ACUITY_OWNER;

const acuity = (appointmentType: string | undefined): string | undefined =>
  OWNER && appointmentType
    ? `https://app.squarespacescheduling.com/schedule.php?owner=${OWNER}&appointmentType=${appointmentType}`
    : undefined;

const THIRTYMIN_FULL = acuity(process.env.NEXT_PUBLIC_ACUITY_30MIN_FULL);
const THIRTYMIN_DISCOUNT = acuity(process.env.NEXT_PUBLIC_ACUITY_30MIN_DISCOUNT);
const INDEPTH_YT_FULL = acuity(process.env.NEXT_PUBLIC_ACUITY_INDEPTH_YT_FULL);
const INDEPTH_YT_DISCOUNT = acuity(process.env.NEXT_PUBLIC_ACUITY_INDEPTH_YT_DISCOUNT);
const INDEPTH_PRIV_FULL = acuity(process.env.NEXT_PUBLIC_ACUITY_INDEPTH_PRIV_FULL);
const INDEPTH_PRIV_DISCOUNT = acuity(process.env.NEXT_PUBLIC_ACUITY_INDEPTH_PRIV_DISCOUNT);
const TEAM_YT_FULL = acuity(process.env.NEXT_PUBLIC_ACUITY_TEAM_YT_FULL);
const TEAM_PRIV_FULL = acuity(process.env.NEXT_PUBLIC_ACUITY_TEAM_PRIV_FULL);

export const ACUITY_EVENTS: Record<Tier, EventMap> = {
  thirtyMin: {
    default: {
      full:    THIRTYMIN_FULL,
      patreon: THIRTYMIN_DISCOUNT,
      twitch:  THIRTYMIN_DISCOUNT,
    },
  },
  inDepth: {
    youtube: {
      full:    INDEPTH_YT_FULL,
      patreon: INDEPTH_YT_DISCOUNT,
      twitch:  INDEPTH_YT_DISCOUNT,
    },
    private: {
      full:    INDEPTH_PRIV_FULL,
      patreon: INDEPTH_PRIV_DISCOUNT,
      twitch:  INDEPTH_PRIV_DISCOUNT,
    },
  },
  team: {
    // Team tier has no discounted variants.
    youtube: { full: TEAM_YT_FULL },
    private: { full: TEAM_PRIV_FULL },
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
