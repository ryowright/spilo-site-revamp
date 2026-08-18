"use client";

import { encodeReopenKey } from "@/lib/booking/resolve-url";
import type { DiscountKind } from "@/lib/session";
import type { VerifyError } from "../store";
import { TIER_META, type Format, type Tier } from "../SchedulingEvents";
import { FORMAT_LABEL, SPILO_PRICES } from "../coaches";

// Display prices per (tier × format), derived from the tier cards in coaches.ts
// so the modal and the pricing section cannot drift apart.
const FORMAT_PRICE: Record<Tier, Partial<Record<Format, number>>> = SPILO_PRICES;

// A verified Twitch sub / Patreon patron takes a flat $5 off each session on
// the discountable tiers (Team never discounts). Twitch and Patreon are the
// same amount and don't stack.
const DISCOUNT_AMOUNT = 5;

// The provider name alone — the discount row, the applied-discount confirmation
// and the scheduler banner all name the provider in a context that already
// supplies "discount", so spelling out "patron"/"subscriber" only adds length.
export const DISCOUNT_LABEL: Record<DiscountKind, string> = {
  patreon: "Patreon",
  twitch: "Twitch",
};

const VERIFY_SUBJECT: Record<DiscountKind, string> = {
  patreon: "Patreon membership",
  twitch: "Twitch subscription",
};

function verifyErrorMessage({ provider, reason }: VerifyError): string {
  const subject = VERIFY_SUBJECT[provider];
  if (reason === "not_eligible") {
    return `We couldn't find an active ${subject} on that account. Make sure you're signed into the right account${
      provider === "twitch" ? " and subscribed to Spilo's channel" : ""
    } — or continue at full price.`;
  }
  return `Something went wrong verifying your ${subject} — please try again, or continue at full price.`;
}

type Props = {
  tier: Tier;
  selectedFormat: Format;
  appliedDiscount: DiscountKind | null;
  verifyError?: VerifyError | null;
  onClearApplied: () => Promise<void>;
  onBack: () => void;
  onContinue: () => void;
};

/**
 * Verify a Patreon/Twitch discount and confirm the price, between the coach
 * step (which picks the coach and the format) and the scheduler. Tiers with no
 * discounts skip this step entirely — see BookingModal.
 */
export function DiscountStep({
  tier,
  selectedFormat,
  appliedDiscount,
  verifyError,
  onClearApplied,
  onBack,
  onContinue,
}: Props) {
  const meta = TIER_META[tier];

  // A verified Twitch sub / Patreon patron knocks $5 off each session on the
  // discountable tiers. Resolve the full + net price for a format so both the
  // format cards and the single-format price line render it the same way.
  const isDiscounted = meta.discountsApply && appliedDiscount !== null;
  const priceFor = (f: Format) => {
    const full = FORMAT_PRICE[tier][f];
    if (full === undefined) return null;
    return { full, net: isDiscounted ? full - DISCOUNT_AMOUNT : full };
  };

  // OAuth return URL carries the live format selection so it survives the
  // round-trip and the visitor lands back here with it intact. The #pricing
  // fragment puts the Coaching section behind the reopened modal rather than
  // the hero — safeReturnTo and the callback both preserve the hash, and the
  // cleanup on arrival strips only the search params.
  const returnQuery = encodeURIComponent(
    `/?reopen=${encodeReopenKey(tier, selectedFormat)}#pricing`,
  );

  return (
    <div className="booking-step">
      {meta.discountsApply && (
        <section className="booking-section">
          <div className="booking-section-head">
            <h3 className="booking-section-title">Discounts</h3>
            <p className="booking-section-sub">
              My Twitch subscribers and Patreon patrons get a discount on
              individual coaching. (These discounts don&apos;t stack.)
            </p>
          </div>

          {appliedDiscount ? (
            <div className="booking-discount-applied">
              <div className="booking-discount-applied-head">
                <span className="booking-discount-applied-eyebrow">
                  Discount Verified
                </span>
                <span className="booking-discount-applied-label">
                  {DISCOUNT_LABEL[appliedDiscount]} discount will be applied.
                </span>
              </div>
              <button
                type="button"
                className="booking-discount-remove"
                onClick={() => {
                  void onClearApplied();
                }}
              >
                Use a Different One
              </button>
            </div>
          ) : (
            <>
              {verifyError && (
                <div className="booking-discount-error" role="alert">
                  {verifyErrorMessage(verifyError)}
                </div>
              )}
              <div className="booking-discount-rows">
                <div className="booking-discount-row">
                  <div className="booking-discount-row-info">
                    <span className="booking-discount-row-label">
                      {DISCOUNT_LABEL.twitch}
                    </span>
                  </div>
                  <a
                    className="btn btn-ghost btn-sm"
                    href={`/api/auth/twitch?return=${returnQuery}`}
                  >
                    Sign in to Twitch
                  </a>
                </div>
                <div className="booking-discount-row">
                  <div className="booking-discount-row-info">
                    <span className="booking-discount-row-label">
                      {DISCOUNT_LABEL.patreon}
                    </span>
                  </div>
                  <a
                    className="btn btn-ghost btn-sm"
                    href={`/api/auth/patreon?return=${returnQuery}`}
                  >
                    Sign in to Patreon
                  </a>
                </div>
              </div>
            </>
          )}
        </section>
      )}

      {/* The format was chosen on the coach step, so this only confirms it back
          — for every tier, not just single-format ones, and for the format the
          visitor actually picked rather than the tier's first. */}
      {(() => {
        const p = priceFor(selectedFormat);
        if (!p) return null;
        return (
          <section className="booking-section">
            <div className="booking-section-head">
              <h3 className="booking-section-title">Format</h3>
            </div>
            <div className="booking-price-line">
              <span className="booking-price-line-label">
                {FORMAT_LABEL[selectedFormat]}
              </span>
              <span className="booking-format-card-price">
                {isDiscounted && (
                  <span className="booking-format-card-price-was">
                    ${p.full}
                  </span>
                )}
                ${p.net}
              </span>
            </div>
          </section>
        );
      })()}

      <div className="booking-step-actions">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          <span className="arrow-back">←</span> Back
        </button>
        <button type="button" className="btn btn-red" onClick={onContinue}>
          Continue <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
}
