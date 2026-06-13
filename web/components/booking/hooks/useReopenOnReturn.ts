"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { decodeReopenKey } from "@/lib/booking/resolve-url";
import { useBooking } from "../store";

/**
 * On the first mount after an OAuth round-trip, the URL contains
 * `?reopen=<tier>:<format>&verified=<patreon|twitch|none>`. This hook reads
 * those params and reopens the booking modal at the schedule step so the
 * user lands back in the Calendly embed with the verified discount applied.
 *
 * Cleans the URL params after reading (so a back-button / reload doesn't
 * trigger the same flow twice).
 */
export function useReopenOnReturn() {
  const { open } = useBooking();
  const params = useSearchParams();

  useEffect(() => {
    const reopenKey = params.get("reopen");
    if (!reopenKey) return;

    const decoded = decodeReopenKey(reopenKey);
    if (!decoded) return;

    open({ tier: decoded.tier, format: decoded.format, jumpToSchedule: true });

    // Strip the OAuth-return query params from the URL so the modal doesn't
    // reopen on every navigation. We keep the path/hash, just clean the search.
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("reopen");
      url.searchParams.delete("verified");
      url.searchParams.delete("verifyError");
      window.history.replaceState(null, "", url.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
