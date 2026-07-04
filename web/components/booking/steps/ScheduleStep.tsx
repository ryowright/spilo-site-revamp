"use client";

import { resolveAcuityUrl } from "@/lib/booking/resolve-url";
import type { Discount, Format, Tier } from "../SchedulingEvents";

type Props = {
  tier: Tier;
  format: Format;
  discount: Discount;
  onBack: () => void;
};

export function ScheduleStep({ tier, format, discount, onBack }: Props) {
  const url = resolveAcuityUrl(tier, format, discount);

  if (!url) {
    return (
      <div className="booking-step">
        <p className="booking-step-intro">
          Couldn&apos;t resolve a scheduling link for that combination —
          please try again or message Spilo directly.
        </p>
        <div className="booking-step-actions">
          <button type="button" className="btn btn-ghost" onClick={onBack}>
            <span className="arrow-back">←</span> Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-step booking-schedule">
      {discount !== "full" && (
        <div className="booking-schedule-banner">
          {discount === "patreon"
            ? "Patreon patron discount applied."
            : "Twitch subscriber discount applied."}{" "}
          Pricing in Acuity reflects the discount.
        </div>
      )}

      <div className="booking-scheduler-frame">
        <iframe
          src={url}
          title="Schedule your session"
          width="100%"
          height="100%"
          frameBorder={0}
          // Acuity collects payment in a nested Stripe frame — delegate the
          // Payment Request API so Apple Pay / Google Pay work.
          allow="payment"
        />
      </div>

      <div className="booking-step-actions booking-step-actions-tight">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          <span className="arrow-back">←</span> Back
        </button>
      </div>
    </div>
  );
}
