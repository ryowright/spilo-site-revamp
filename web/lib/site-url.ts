/**
 * Resolve the site's absolute base URL. Used to construct OAuth redirect URIs
 * (must exactly match what's whitelisted in Twitch / Patreon dashboards) and
 * any other absolute-URL contexts on the server.
 *
 * Order of precedence:
 *   1. NEXT_PUBLIC_SITE_URL — manual override (custom domain)
 *   2. VERCEL_PROJECT_PRODUCTION_URL — stable project alias on production
 *   3. VERCEL_URL — immutable per-deploy hash URL
 *   4. localhost — dev fallback
 *
 * Mirrors the metadataBase logic in app/layout.tsx.
 */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000")
  );
}

export function getCallbackUrl(provider: "twitch" | "patreon"): string {
  return `${getSiteUrl()}/api/auth/${provider}/callback`;
}
