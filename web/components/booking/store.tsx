"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Format, Tier } from "./CalendlyEvents";

type OpenArgs = {
  tier: Tier;
  format?: Format;
  // If true, jump straight to the schedule step (used by the reopen-on-return
  // hook so the user lands back in the Calendly embed after OAuth).
  jumpToSchedule?: boolean;
};

type BookingState = {
  isOpen: boolean;
  tier: Tier | null;
  format: Format | null;
  jumpToSchedule: boolean;
  open: (args: OpenArgs) => void;
  close: () => void;
};

const Ctx = createContext<BookingState | null>(null);

/**
 * Wrap any tree that needs booking-modal control. Provides a single source of
 * truth so SchedulingButtons across the page (and the reopen-on-return hook)
 * all drive the same modal instance.
 */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<Tier | null>(null);
  const [format, setFormat] = useState<Format | null>(null);
  const [jumpToSchedule, setJumpToSchedule] = useState(false);

  const value = useMemo<BookingState>(
    () => ({
      isOpen: tier !== null,
      tier,
      format,
      jumpToSchedule,
      open: ({ tier, format, jumpToSchedule }) => {
        setTier(tier);
        setFormat(format ?? null);
        setJumpToSchedule(!!jumpToSchedule);
      },
      close: () => {
        setTier(null);
        setFormat(null);
        setJumpToSchedule(false);
      },
    }),
    [tier, format, jumpToSchedule],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBooking(): BookingState {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useBooking must be used inside <BookingProvider>");
  }
  return ctx;
}
