"use client";

import { InlineWidget } from "react-calendly";
import { resolveCalendlyUrl } from "@/lib/booking/resolve-url";
import type { Discount, Format, Tier } from "../CalendlyEvents";

type Props = {
  tier: Tier;
  format: Format;
  discount: Discount;
  onBack: () => void;
};

export function ScheduleStep({ tier, format, discount, onBack }: Props) {
  const url = resolveCalendlyUrl(tier, format, discount);

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
          Pricing in Calendly reflects the discount.
        </div>
      )}

      <div className="booking-calendly-frame">
        <InlineWidget
          url={url}
          styles={{ height: "100%", minWidth: "100%" }}
          // Match the dark page treatment without bleeding the wrong tone
          // through the Calendly iframe.
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
