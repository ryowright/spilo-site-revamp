"use client";

import { encodeReopenKey } from "@/lib/booking/resolve-url";
import type { DiscountKind } from "@/lib/session";
import type { Format, Tier } from "../CalendlyEvents";

type Props = {
  tier: Tier;
  format: Format;
  appliedDiscount: DiscountKind | null;
  onSkip: () => void;
  onUseApplied: () => void;
  onClearApplied: () => Promise<void>;
  onBack?: () => void;
};

const DISCOUNT_LABEL: Record<DiscountKind, string> = {
  patreon: "Patreon patron",
  twitch: "Twitch subscriber",
};

export function DiscountStep({
  tier,
  format,
  appliedDiscount,
  onSkip,
  onUseApplied,
  onClearApplied,
  onBack,
}: Props) {
  const returnPath = `/?reopen=${encodeReopenKey(tier, format)}`;
  const returnQuery = encodeURIComponent(returnPath);

  // If the user has a verified discount cookie from a prior round-trip, show
  // an "applied" state so they don't have to re-OAuth.
  if (appliedDiscount) {
    return (
      <div className="booking-step">
        <div className="booking-discount-applied">
          <div className="booking-discount-applied-head">
            <span className="booking-discount-applied-eyebrow">
              Discount verified
            </span>
            <span className="booking-discount-applied-label">
              {DISCOUNT_LABEL[appliedDiscount]} discount will be applied.
            </span>
          </div>
        </div>

        <div className="booking-step-actions">
          {onBack && (
            <button type="button" className="btn btn-ghost" onClick={onBack}>
              <span className="arrow-back">←</span> Back
            </button>
          )}
          <button
            type="button"
            className="btn btn-ghost"
            onClick={async () => {
              await onClearApplied();
            }}
          >
            Use a different discount
          </button>
          <button type="button" className="btn btn-red" onClick={onUseApplied}>
            Continue <span className="arrow">→</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-step">
      <p className="booking-step-intro">
        Patreon patrons and Twitch subscribers get a discount on individual
        sessions. Verify once and we&apos;ll apply it.
      </p>

      <div className="booking-discount-options">
        <a
          href={`/api/auth/patreon?return=${returnQuery}`}
          className="booking-discount-card"
        >
          <div className="booking-discount-card-head">
            <span className="booking-discount-card-title">
              I&apos;m a Patreon patron
            </span>
            <span className="booking-discount-card-cta">
              Verify on Patreon <span className="arrow">→</span>
            </span>
          </div>
          <p className="booking-discount-card-desc">
            One-click sign-in confirms your membership tier without sharing a
            code.
          </p>
        </a>

        <a
          href={`/api/auth/twitch?return=${returnQuery}`}
          className="booking-discount-card"
        >
          <div className="booking-discount-card-head">
            <span className="booking-discount-card-title">
              I&apos;m a Twitch sub
            </span>
            <span className="booking-discount-card-cta">
              Verify on Twitch <span className="arrow">→</span>
            </span>
          </div>
          <p className="booking-discount-card-desc">
            Verifies your subscription to Spilo&apos;s channel via Twitch OAuth.
          </p>
        </a>
      </div>

      <div className="booking-step-actions">
        {onBack && (
          <button type="button" className="btn btn-ghost" onClick={onBack}>
            <span className="arrow-back">←</span> Back
          </button>
        )}
        <button type="button" className="btn btn-ghost" onClick={onSkip}>
          No discount — continue at full price
        </button>
      </div>
    </div>
  );
}
