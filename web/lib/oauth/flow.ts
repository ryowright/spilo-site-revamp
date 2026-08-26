// Shared OAuth helpers. Both Twitch and Patreon use the same pattern: stash
// state + return-to in the session, redirect to the provider, validate state
// in the callback, set discount on success.

import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/session";
import { getCallbackUrl, getSiteUrl } from "@/lib/site-url";
import type { DiscountKind } from "@/lib/session";

// Warn at most once per process, per provider — same pattern as the
// SESSION_SECRET check in lib/session.ts.
const warnedMissingCredentials = new Set<string>();

/**
 * Decide whether a provider runs its mock flow, which auto-verifies without
 * contacting the provider at all.
 *
 * Gated on NODE_ENV, deliberately, and NOT on the credential alone. Missing
 * credentials mean "still building this" in dev but "misconfigured deploy" in
 * production, and those must not resolve the same way: treating an absent
 * credential as permission to skip verification would hand every visitor the
 * discount, silently, with nothing in the logs and no visible symptom. In
 * production a missing credential instead produces a real authorize request
 * that the provider rejects, so the visitor returns unverified at full price.
 * Fail closed.
 */
export function resolveMockMode(
  provider: "twitch" | "patreon",
  clientId: string | undefined,
): boolean {
  if (clientId) return false;

  if (process.env.NODE_ENV === "production") {
    if (!warnedMissingCredentials.has(provider)) {
      warnedMissingCredentials.add(provider);
      console.error(
        `[oauth/${provider}] ${provider.toUpperCase()}_CLIENT_ID is not set in ` +
          `production. Discount verification for this provider cannot succeed — ` +
          `visitors will be sent back unverified at full price. Set the credential.`,
      );
    }
    return false;
  }

  return true;
}

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
  // Tag every return with which provider was attempted so the client can show
  // a provider-specific message on failure (ignored by the client on success,
  // which reads `verified`).
  redirectUrl.searchParams.set("provider", options.provider);

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
