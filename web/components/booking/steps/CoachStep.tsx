"use client";

import { ImagePlaceholder } from "../../ImagePlaceholder";
import {
  COACH_LABEL,
  COACH_PHOTO,
  formatRows,
  PACKAGES,
  type Coach,
  type CoachPrice,
} from "../coaches";
import type { Format, Tier } from "../SchedulingEvents";

type Props = {
  tier: Tier;
  // Picking one of Spilo's prices chooses the coach and the format in one go,
  // which is why there is no separate format step any more.
  onChoose: (format: Format) => void;
  // Stephano books externally, so the modal has nothing left to show.
  onClose: () => void;
};

// Spilo first, matching the mockup. The card price rows lead with Stephano
// (cheapest first); here the order is deliberately the other way round.
const ORDER: Coach[] = ["spilo", "stephano"];

function CoachCard({
  price,
  onChoose,
  onClose,
}: {
  price: CoachPrice;
  onChoose: (format: Format) => void;
  onClose: () => void;
}) {
  const booking = price.booking;

  return (
    <div className="booking-coach-card">
      <div className="media-frame">
        <ImagePlaceholder
          src={COACH_PHOTO[price.coach]}
          alt={COACH_LABEL[price.coach]}
          sizes="(max-width: 560px) 90vw, 420px"
        />
        {/* The prices are the only CTAs, so the coach needs a label of their
            own. It sits over the photo, after the slot in DOM order so it
            paints on top. */}
        <h3 className="booking-coach-name">{COACH_LABEL[price.coach]}</h3>
      </div>

      {/* Each price is the button: one click picks the coach and the format.
          Not SchedulingButton — its modal branch calls open({tier}), which would
          re-enter this step instead of advancing past it. */}
      <div className="booking-coach-prices">
        {formatRows(price).map((row) =>
          booking.kind === "link" ? (
            <a
              className="booking-price-line"
              key={row.label}
              href={booking.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
            >
              <span className="booking-price-line-label">{row.label}</span>
              <span className="booking-format-card-price">{row.value}</span>
            </a>
          ) : (
            <button
              type="button"
              className="booking-price-line"
              key={row.label}
              onClick={() => onChoose(row.formats[0])}
            >
              <span className="booking-price-line-label">{row.label}</span>
              <span className="booking-format-card-price">{row.value}</span>
            </button>
          ),
        )}
      </div>
    </div>
  );
}

export function CoachStep({ tier, onChoose, onClose }: Props) {
  const card = PACKAGES.find((c) => c.key === tier);
  if (!card) return null;

  const coaches = ORDER.map((id) =>
    card.coaches.find((c) => c.coach === id),
  ).filter((c): c is CoachPrice => Boolean(c));

  return (
    <div className="booking-step">
      <p className="booking-step-intro">Who would you like coaching from?</p>
      <div className="booking-coach-grid">
        {coaches.map((price) => (
          <CoachCard
            key={price.coach}
            price={price}
            onChoose={onChoose}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
}
