"use client";

import { useBooking } from "./store";
import type { Format, Tier } from "./CalendlyEvents";

type Props = {
  tier: Tier;
  format?: Format;
  variant?: "red" | "ghost";
  children: React.ReactNode;
};

/**
 * Replaces the old react-calendly PopupModal. Each "Schedule a call" button
 * dispatches an open action to the shared BookingProvider; a single
 * BookingModal mounted at the page root reads that state and runs the flow.
 */
export function SchedulingButton({
  tier,
  format,
  variant = "red",
  children,
}: Props) {
  const { open } = useBooking();

  return (
    <button
      type="button"
      className={`btn btn-${variant}`}
      onClick={() => open({ tier, format })}
    >
      {children} <span className="arrow">→</span>
    </button>
  );
}
