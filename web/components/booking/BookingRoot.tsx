"use client";

import { Suspense, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { BookingProvider } from "./store";
import { BookingModal } from "./BookingModal";
import { useReopenOnReturn } from "./hooks/useReopenOnReturn";

/**
 * Tiny client component that reads `?reopen=...&verified=...` after an OAuth
 * round-trip and reopens the booking modal at the schedule step. Lives in
 * its own Suspense boundary because useSearchParams suspends during SSR
 * in the Next.js App Router.
 */
function ReopenHandler() {
  useReopenOnReturn();
  return null;
}

/**
 * Wraps page content so every SchedulingButton across the page dispatches
 * into a single shared BookingProvider, and a single BookingModal is
 * rendered at the root.
 */
export function BookingRoot({ children }: { children: ReactNode }) {
  return (
    // reducedMotion="user" makes Framer Motion honor the OS "reduce motion"
    // setting for every animation on the page: transform/layout animations are
    // skipped, opacity fades still play (the accessible-safe default).
    <MotionConfig reducedMotion="user">
      <BookingProvider>
        {children}
        <BookingModal />
        <Suspense fallback={null}>
          <ReopenHandler />
        </Suspense>
      </BookingProvider>
    </MotionConfig>
  );
}
