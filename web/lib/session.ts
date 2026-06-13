import type { SessionOptions } from "iron-session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export type DiscountKind = "patreon" | "twitch";

export type BookingSession = {
  // Verified discount the user can apply. Set after a successful OAuth check.
  discount?: DiscountKind;
  verifiedAt?: number;

  // In-flight OAuth state. Cleared after the callback validates.
  oauthState?: string;
  // Where to send the user after the OAuth round-trip. Stored as a relative
  // path with optional `?reopen=<tier>` query so the booking modal restores.
  returnTo?: string;
};

const FALLBACK_DEV_SECRET =
  "this-is-a-development-only-fallback-secret-do-not-use-in-production-32chars+";

export const sessionOptions: SessionOptions = {
  cookieName: "spilo_booking",
  password: process.env.SESSION_SECRET || FALLBACK_DEV_SECRET,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour
  },
};

// Warn once per process if running in production without a real secret.
let warnedAboutSecret = false;

// Next.js 14: cookies() is synchronous. iron-session works with the returned
// ReadonlyRequestCookies object the same way. (In Next 15 this becomes async.)
export async function getSession() {
  if (
    !warnedAboutSecret &&
    process.env.NODE_ENV === "production" &&
    !process.env.SESSION_SECRET
  ) {
    warnedAboutSecret = true;
    console.warn(
      "[session] SESSION_SECRET is not set in production. " +
        "Cookies will be signed with the dev fallback — set this env var.",
    );
  }
  return getIronSession<BookingSession>(cookies(), sessionOptions);
}
