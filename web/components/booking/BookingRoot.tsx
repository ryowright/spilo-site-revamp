"use client";

import { Suspense, type ReactNode } from "react";
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
    <BookingProvider>
      {children}
      <BookingModal />
      <Suspense fallback={null}>
        <ReopenHandler />
      </Suspense>
    </BookingProvider>
  );
}
