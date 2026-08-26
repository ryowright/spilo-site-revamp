// Patreon OAuth + API v2 active-membership verification.
//
// This hits real Patreon APIs whenever PATREON_CLIENT_ID is set, and always in
// production. Outside production an unset credential falls back to mock mode,
// which auto-verifies without leaving the site. See resolveMockMode for why
// that fallback is gated on NODE_ENV rather than on the credential alone.

import { resolveMockMode } from "./flow";

// Patreon quirk: the authorize page lives at /oauth2/authorize, but the token
// exchange endpoint is under /api/oauth2/token (different base path).
const PATREON_AUTH_BASE = "https://www.patreon.com/oauth2";
const PATREON_TOKEN_URL = "https://www.patreon.com/api/oauth2/token";
const PATREON_API_BASE = "https://www.patreon.com/api/oauth2/v2";

export function isMockMode(): boolean {
  return resolveMockMode("patreon", process.env.PATREON_CLIENT_ID);
}

export function getAuthorizeUrl(state: string, redirectUri: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.PATREON_CLIENT_ID ?? "",
    redirect_uri: redirectUri,
    scope: "identity identity.memberships",
    state,
  });
  return `${PATREON_AUTH_BASE}/authorize?${params}`;
}

type TokenResponse = { access_token: string; expires_in: number; token_type: string };

export async function exchangeCodeForToken(
  code: string,
  redirectUri: string,
): Promise<TokenResponse> {
  const res = await fetch(PATREON_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      client_id: process.env.PATREON_CLIENT_ID ?? "",
      client_secret: process.env.PATREON_CLIENT_SECRET ?? "",
      redirect_uri: redirectUri,
    }),
  });
  if (!res.ok) {
    throw new Error(`Patreon token exchange failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

type PatreonIdentityResponse = {
  data: { id: string; type: "user" };
  included?: Array<{
    id: string;
    type: "member" | "campaign";
    attributes?: {
      patron_status?: string;
      // Cents the member is currently entitled to (their active paid pledge).
      // > 0 means a paying patron right now; free members are 0.
      currently_entitled_amount_cents?: number;
    };
    relationships?: {
      campaign?: { data?: { id: string; type: "campaign" } };
    };
  }>;
};

/**
 * Returns true if the authenticated Patreon user is a *paying* patron of the
 * configured campaign. We require both patron_status === "active_patron" AND a
 * positive currently_entitled_amount_cents so that free members (who join a
 * free tier or just follow) do NOT qualify for the discount.
 */
export async function isActiveMember(accessToken: string): Promise<boolean> {
  const campaignId = process.env.PATREON_CAMPAIGN_ID;
  if (!campaignId) throw new Error("PATREON_CAMPAIGN_ID is not configured");

  const url =
    `${PATREON_API_BASE}/identity?` +
    new URLSearchParams({
      include: "memberships,memberships.campaign",
      "fields[member]": "patron_status,currently_entitled_amount_cents",
    });

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`Patreon /identity failed: ${res.status}`);
  }
  const json = (await res.json()) as PatreonIdentityResponse;

  return (json.included ?? []).some(
    (entry) =>
      entry.type === "member" &&
      entry.relationships?.campaign?.data?.id === campaignId &&
      entry.attributes?.patron_status === "active_patron" &&
      (entry.attributes?.currently_entitled_amount_cents ?? 0) > 0,
  );
}
