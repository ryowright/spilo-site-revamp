"use client";

import { useBooking } from "./store";
import type { Booking } from "./coaches";

type Props = {
  booking: Booking;
  variant?: "red" | "ghost";
  children: React.ReactNode;
};

/**
 * "Schedule a call" CTA. Two booking modes:
 *   - modal: dispatch to the shared BookingProvider, which runs the
 *     format → discount → schedule flow (Spilo).
 *   - link:  a plain external link straight to the coach's Calendly (Stephano).
 */
export function SchedulingButton({ booking, variant = "red", children }: Props) {
  const { open } = useBooking();

  if (booking.kind === "link") {
    return (
      <a
        className={`btn btn-${variant}`}
        href={booking.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children} <span className="arrow">→</span>
      </a>
    );
  }

  return (
    <button
      type="button"
      className={`btn btn-${variant}`}
      onClick={() => open({ tier: booking.tier })}
    >
      {children} <span className="arrow">→</span>
    </button>
  );
}
