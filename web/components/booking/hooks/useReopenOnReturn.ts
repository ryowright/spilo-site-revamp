"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { decodeReopenKey } from "@/lib/booking/resolve-url";
import type { DiscountKind } from "@/lib/session";
import { useBooking } from "../store";

/**
 * On the first mount after an OAuth round-trip, the URL carries
 * `?reopen=<tier>:<format>&verified=<patreon|twitch|none>&verifyError=...&provider=...`.
 * Every return reopens the combined options step (with the format preserved):
 *   - success / cancel → the modal reflects `session.discount` (applied or not)
 *   - real failure      → also surface a "couldn't verify" message
 *
 * Cleans the OAuth params off the URL afterward so a reload / back-button
 * doesn't re-trigger the flow.
 */
export function useReopenOnReturn() {
  const { open } = useBooking();
  const params = useSearchParams();

  useEffect(() => {
    const reopenKey = params.get("reopen");
    if (!reopenKey) return;

    const decoded = decodeReopenKey(reopenKey);
    if (!decoded) return;

    const verified = params.get("verified");
    const verifyError = params.get("verifyError");
    const provider = params.get("provider");
    const { tier, format } = decoded;

    // Show the failure banner only for a genuine failed verification — not on
    // success, and not when the user backed out of the consent screen.
    const isRealFailure =
      verified === "none" &&
      verifyError !== null &&
      verifyError !== "access_denied";

    open({
      tier,
      format,
      verifyError:
        isRealFailure && (provider === "patreon" || provider === "twitch")
          ? { provider: provider as DiscountKind, reason: verifyError ?? "unknown" }
          : null,
    });

    // Strip the OAuth-return query params so the modal doesn't reopen on every
    // navigation. Keep the path/hash, just clean the search.
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      ["reopen", "verified", "verifyError", "provider"].forEach((p) =>
        url.searchParams.delete(p),
      );
      window.history.replaceState(null, "", url.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
