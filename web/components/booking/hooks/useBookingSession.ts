"use client";

import { useEffect, useState } from "react";
import type { DiscountKind } from "@/lib/session";

type SessionPayload = {
  discount: DiscountKind | null;
  verifiedAt: number | null;
};

/**
 * Reads /api/booking/session to see if the user has a verified discount
 * cookie from a prior OAuth round-trip. Returns null while loading.
 */
export function useBookingSession() {
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/booking/session", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: SessionPayload) => {
        if (!cancelled) setSession(data);
      })
      .catch(() => {
        if (!cancelled) setSession({ discount: null, verifiedAt: null });
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const clear = async () => {
    await fetch("/api/booking/clear-session", { method: "POST" });
    setReloadKey((k) => k + 1);
  };

  const reload = () => setReloadKey((k) => k + 1);

  return { session, clear, reload };
}
