"use client";

import { encodeReopenKey } from "@/lib/booking/resolve-url";
import type { DiscountKind } from "@/lib/session";
import type { VerifyError } from "../store";
import { TIER_META, type Format, type Tier } from "../CalendlyEvents";

// Display prices per (tier × format). Mirrors the Spilo tier cards in
// coaches.ts / Pricing.tsx — keep in sync until pricing lives in one place.
const FORMAT_PRICE: Record<Tier, Partial<Record<Format, number>>> = {
  thirtyMin: { default: 43 },
  inDepth: { youtube: 80, private: 90 },
  team: { youtube: 90, private: 100 },
};

// A verified Twitch sub / Patreon patron takes a flat $5 off each session on
// the discountable tiers (Team never discounts). Twitch and Patreon are the
// same amount and don't stack.
const DISCOUNT_AMOUNT = 5;

const FORMAT_LABEL: Record<Format, string> = {
  default: "30-minute review",
  youtube: "Posted to YouTube",
  private: "Private",
};

const DISCOUNT_LABEL: Record<DiscountKind, string> = {
  patreon: "Patreon patron",
  twitch: "Twitch subscriber",
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
  onSelectFormat: (format: Format) => void;
  appliedDiscount: DiscountKind | null;
  verifyError?: VerifyError | null;
  onClearApplied: () => Promise<void>;
  onContinue: () => void;
};

/**
 * Combined "options" step — format choice and discount verification on one
 * page (modeled after the original site), before the schedule step. Sections
 * render conditionally per the tier: Team has no discounts, the 30-min review
 * has no format choice.
 */
export function OptionsStep({
  tier,
  selectedFormat,
  onSelectFormat,
  appliedDiscount,
  verifyError,
  onClearApplied,
  onContinue,
}: Props) {
  const meta = TIER_META[tier];
  const hasFormatChoice = meta.formats.length > 1;

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
  // round-trip and the visitor lands back here with it intact.
  const returnQuery = encodeURIComponent(
    `/?reopen=${encodeReopenKey(tier, selectedFormat)}`,
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
                  Discount verified
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
                Use a different one
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
                      Twitch subscriber
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
                      Patreon patron
                    </span>
                  </div>
                  <a
                    className="btn btn-ghost btn-sm"
                    href={`/api/auth/patreon?return=${returnQuery}`}
                  >
                    Sign in with Patreon
                  </a>
                </div>
              </div>
            </>
          )}
        </section>
      )}

      {hasFormatChoice && (
        <section className="booking-section">
          <div className="booking-section-head">
            <h3 className="booking-section-title">Format</h3>
            <p className="booking-section-sub">
              Posting to YouTube helps me grow my audience and helps other students of the game to learn.
            </p>
          </div>
          <div className="booking-format-grid">
            {meta.formats.map((f) => {
              const p = priceFor(f);
              const isSelected = selectedFormat === f;
              return (
                <label
                  key={f}
                  className={`booking-format-card ${isSelected ? "is-selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="booking-format"
                    checked={isSelected}
                    onChange={() => onSelectFormat(f)}
                  />
                  <div className="booking-format-card-head">
                    <span className="booking-format-card-title">
                      {FORMAT_LABEL[f]}
                    </span>
                    {p && (
                      <span className="booking-format-card-price">
                        {isDiscounted && (
                          <span className="booking-format-card-price-was">
                            ${p.full}
                          </span>
                        )}
                        ${p.net}
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </section>
      )}

      {/* Single-format tiers (30-min review) have no format choice, so show a
          plain price line here instead — still reflecting the discount. */}
      {!hasFormatChoice &&
        (() => {
          const f = meta.formats[0];
          const p = priceFor(f);
          if (!p) return null;
          return (
            <section className="booking-section">
              <div className="booking-section-head">
                <h3 className="booking-section-title">Price</h3>
              </div>
              <div className="booking-price-line">
                <span className="booking-price-line-label">
                  {FORMAT_LABEL[f]}
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
        <button type="button" className="btn btn-red" onClick={onContinue}>
          Continue <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
}
