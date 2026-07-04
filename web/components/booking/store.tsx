"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Format, Tier } from "./SchedulingEvents";
import type { DiscountKind } from "@/lib/session";

export type VerifyError = { provider: DiscountKind; reason: string };

type OpenArgs = {
  tier: Tier;
  // Preselected format (restored from the reopen key after an OAuth round-trip).
  format?: Format;
  // A failed verification to surface on the combined options step.
  verifyError?: VerifyError | null;
};

type BookingState = {
  isOpen: boolean;
  tier: Tier | null;
  format: Format | null;
  verifyError: VerifyError | null;
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
  const [verifyError, setVerifyError] = useState<VerifyError | null>(null);

  const value = useMemo<BookingState>(
    () => ({
      isOpen: tier !== null,
      tier,
      format,
      verifyError,
      open: ({ tier, format, verifyError }) => {
        setTier(tier);
        setFormat(format ?? null);
        setVerifyError(verifyError ?? null);
      },
      close: () => {
        setTier(null);
        setFormat(null);
        setVerifyError(null);
      },
    }),
    [tier, format, verifyError],
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
