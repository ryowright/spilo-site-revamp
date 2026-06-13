// Patreon OAuth + API v2 active-membership verification.
//
// In production this hits real Patreon APIs. When PATREON_CLIENT_ID is unset
// we skip the round-trip and treat the user as verified (mock mode).

const PATREON_AUTH_BASE = "https://www.patreon.com/oauth2";
const PATREON_API_BASE = "https://www.patreon.com/api/oauth2/v2";

export function isMockMode(): boolean {
  return !process.env.PATREON_CLIENT_ID;
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
  const res = await fetch(`${PATREON_AUTH_BASE}/token`, {
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
    attributes?: { patron_status?: string };
    relationships?: {
      campaign?: { data?: { id: string; type: "campaign" } };
    };
  }>;
};

/**
 * Returns true if the authenticated Patreon user is an active patron of the
 * configured campaign. Membership is determined by API v2's `included`
 * resources: any `member` whose campaign relationship matches our campaign
 * and whose patron_status === "active_patron" counts.
 */
export async function isActiveMember(accessToken: string): Promise<boolean> {
  const campaignId = process.env.PATREON_CAMPAIGN_ID;
  if (!campaignId) throw new Error("PATREON_CAMPAIGN_ID is not configured");

  const url =
    `${PATREON_API_BASE}/identity?` +
    new URLSearchParams({
      include: "memberships,memberships.campaign",
      "fields[member]": "patron_status",
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
      entry.attributes?.patron_status === "active_patron" &&
      entry.relationships?.campaign?.data?.id === campaignId,
  );
}
