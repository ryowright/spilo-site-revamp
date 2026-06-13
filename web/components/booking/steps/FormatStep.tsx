"use client";

import { TIER_META, type Format, type Tier } from "../CalendlyEvents";

// Display prices per (tier × format). Single source of truth for what
// shows in the step's selectable cards. Keep in sync with Pricing.tsx
// tier cards until/unless we refactor pricing into one place.
const FORMAT_PRICE: Record<Tier, Partial<Record<Format, number>>> = {
  thirtyMin: { default: 43 },
  inDepth: { youtube: 80, private: 90 },
  team: { youtube: 90, private: 100 },
};

const FORMAT_LABEL: Record<Format, string> = {
  default: "30-minute review",
  youtube: "Posted to YouTube",
  private: "Private",
};

const FORMAT_DESCRIPTION: Record<Format, string> = {
  default: "Recorded review sent to you afterward.",
  youtube: "Coaching session is posted to Spilo's YouTube channel — discounted.",
  private: "Coaching stays between you and Spilo.",
};

type Props = {
  tier: Tier;
  selected: Format;
  onSelect: (format: Format) => void;
  onContinue: () => void;
};

export function FormatStep({ tier, selected, onSelect, onContinue }: Props) {
  const formats = TIER_META[tier].formats;

  return (
    <div className="booking-step">
      <p className="booking-step-intro">
        Choose how you want the session recorded.
      </p>

      <div className="booking-format-grid">
        {formats.map((f) => {
          const price = FORMAT_PRICE[tier][f];
          const isSelected = selected === f;
          return (
            <label
              key={f}
              className={`booking-format-card ${isSelected ? "is-selected" : ""}`}
            >
              <input
                type="radio"
                name="booking-format"
                checked={isSelected}
                onChange={() => onSelect(f)}
              />
              <div className="booking-format-card-head">
                <span className="booking-format-card-title">
                  {FORMAT_LABEL[f]}
                </span>
                {price !== undefined && (
                  <span className="booking-format-card-price">${price}</span>
                )}
              </div>
              <p className="booking-format-card-desc">{FORMAT_DESCRIPTION[f]}</p>
            </label>
          );
        })}
      </div>

      <div className="booking-step-actions">
        <button
          type="button"
          className="btn btn-red"
          onClick={onContinue}
        >
          Continue <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
}
