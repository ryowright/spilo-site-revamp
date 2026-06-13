// Shared OAuth helpers. Both Twitch and Patreon use the same pattern: stash
// state + return-to in the session, redirect to the provider, validate state
// in the callback, set discount on success.

import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/session";
import { getCallbackUrl, getSiteUrl } from "@/lib/site-url";
import type { DiscountKind } from "@/lib/session";

/**
 * Validate a `returnTo` value is a same-origin path. Prevents open-redirect
 * attacks where someone crafts `/api/auth/twitch?return=https://evil.com` —
 * after OAuth we'd otherwise send the user to evil.com with their session
 * cookie set. Returns "/" for anything we can't verify is same-origin.
 */
function safeReturnTo(returnTo: string | undefined): string {
  if (!returnTo) return "/";
  try {
    const siteOrigin = new URL(getSiteUrl()).origin;
    const resolved = new URL(returnTo, getSiteUrl());
    if (resolved.origin === siteOrigin) {
      return resolved.pathname + resolved.search + resolved.hash;
    }
  } catch {
    // Malformed URL — fall through to safe default.
  }
  return "/";
}

/**
 * Common entry-point logic for /api/auth/{provider} start routes.
 *
 * - Persists OAuth state + returnTo on the session
 * - In mock mode: redirects to the callback with `mock=1` so the dev flow
 *   completes without actually leaving the site
 * - Real mode: returns a 302 to the provider's authorize URL
 */
export async function startOAuth(
  req: NextRequest,
  options: {
    provider: "twitch" | "patreon";
    isMockMode: () => boolean;
    getAuthorizeUrl: (state: string, redirectUri: string) => string;
  },
): Promise<NextResponse> {
  const returnTo = safeReturnTo(req.nextUrl.searchParams.get("return") ?? undefined);
  const state = crypto.randomUUID();

  const session = await getSession();
  session.oauthState = state;
  session.returnTo = returnTo;
  await session.save();

  if (options.isMockMode()) {
    const mockUrl = new URL(
      `/api/auth/${options.provider}/callback`,
      getSiteUrl(),
    );
    mockUrl.searchParams.set("mock", "1");
    mockUrl.searchParams.set("state", state);
    return NextResponse.redirect(mockUrl);
  }

  const authorizeUrl = options.getAuthorizeUrl(
    state,
    getCallbackUrl(options.provider),
  );
  return NextResponse.redirect(authorizeUrl);
}

/**
 * Common callback logic. Validates state, runs the provider-specific
 * verification, and redirects back to the user-facing returnTo path with
 * a `verified=patreon|twitch|none` query for the modal to read.
 */
export async function handleOAuthCallback(
  req: NextRequest,
  options: {
    provider: "twitch" | "patreon";
    discountKind: DiscountKind;
    isMockMode: () => boolean;
    verifyEligibility: (code: string) => Promise<boolean>;
  },
): Promise<NextResponse> {
  const session = await getSession();
  const params = req.nextUrl.searchParams;
  const code = params.get("code");
  const state = params.get("state");
  const mock = params.get("mock") === "1";
  const error = params.get("error");

  // Defense-in-depth: re-validate even though startOAuth already sanitized.
  const returnTo = safeReturnTo(session.returnTo);
  // Always clear the in-flight OAuth fields before redirecting back.
  const expectedState = session.oauthState;
  session.oauthState = undefined;
  session.returnTo = undefined;

  const redirectUrl = new URL(returnTo, getSiteUrl());

  // User declined on the provider's consent screen, or the provider returned
  // an error. Don't fail — just send them back with verified=none.
  if (error) {
    redirectUrl.searchParams.set("verified", "none");
    redirectUrl.searchParams.set("verifyError", error);
    await session.save();
    return NextResponse.redirect(redirectUrl);
  }

  if (!state || state !== expectedState) {
    redirectUrl.searchParams.set("verified", "none");
    redirectUrl.searchParams.set("verifyError", "state_mismatch");
    await session.save();
    return NextResponse.redirect(redirectUrl);
  }

  // Mock mode: the start route redirected us straight here. Treat as success.
  if (mock || options.isMockMode()) {
    session.discount = options.discountKind;
    session.verifiedAt = Date.now();
    await session.save();
    redirectUrl.searchParams.set("verified", options.discountKind);
    return NextResponse.redirect(redirectUrl);
  }

  if (!code) {
    redirectUrl.searchParams.set("verified", "none");
    redirectUrl.searchParams.set("verifyError", "missing_code");
    await session.save();
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const eligible = await options.verifyEligibility(code);
    if (eligible) {
      session.discount = options.discountKind;
      session.verifiedAt = Date.now();
      await session.save();
      redirectUrl.searchParams.set("verified", options.discountKind);
    } else {
      await session.save();
      redirectUrl.searchParams.set("verified", "none");
      redirectUrl.searchParams.set("verifyError", "not_eligible");
    }
  } catch (err) {
    // Surface real error in server logs for Vercel debugging — the user-
    // facing query param only carries a coarse label.
    console.error(`[oauth/${options.provider}] verification failed:`, err);
    await session.save();
    redirectUrl.searchParams.set("verified", "none");
    redirectUrl.searchParams.set(
      "verifyError",
      err instanceof Error ? "api_error" : "unknown",
    );
  }

  return NextResponse.redirect(redirectUrl);
}
