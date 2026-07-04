import {
  ACUITY_EVENTS,
  TIER_META,
  type Discount,
  type Format,
  type Tier,
} from "@/components/booking/SchedulingEvents";

const VALID_FORMATS: ReadonlySet<Format> = new Set<Format>([
  "default",
  "youtube",
  "private",
]);

/**
 * Resolve the Acuity appointment-type URL for a given (tier, format, discount).
 *
 * Falls back to the `full` (non-discounted) URL if the tier doesn't support
 * the requested discount — i.e. Team Analysis ignores Patreon / Twitch
 * because Spilo doesn't offer those discounts on team sessions.
 */
export function resolveAcuityUrl(
  tier: Tier,
  format: Format,
  discount: Discount,
): string | null {
  const tierEvents = ACUITY_EVENTS[tier];
  if (!tierEvents) return null;

  const formatEvents = tierEvents[format];
  if (!formatEvents) return null;

  // If the tier doesn't offer this discount, fall back to full price.
  if (!TIER_META[tier].discountsApply && discount !== "full") {
    return formatEvents.full ?? null;
  }

  return formatEvents[discount] ?? formatEvents.full ?? null;
}

/**
 * Encode (tier, format) into a stable string used as the `reopen` query
 * parameter on OAuth round-trips. The hook on the landing page parses this
 * to restore the booking modal at the right step.
 */
export function encodeReopenKey(tier: Tier, format: Format): string {
  return `${tier}:${format}`;
}

export function decodeReopenKey(
  key: string,
): { tier: Tier; format: Format } | null {
  const [tier, format] = key.split(":");
  if (!tier || !format) return null;
  if (!(tier in ACUITY_EVENTS)) return null;
  if (!VALID_FORMATS.has(format as Format)) return null;
  // And ensure this specific tier supports this format (e.g. inDepth does
  // not have "default", thirtyMin does not have "youtube"/"private").
  if (!TIER_META[tier as Tier].formats.includes(format as Format)) return null;
  return { tier: tier as Tier, format: format as Format };
}
