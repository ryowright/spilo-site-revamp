// Twitch OAuth + Helix sub-status verification.
//
// This hits real Twitch APIs whenever TWITCH_CLIENT_ID is set, and always in
// production. Outside production an unset credential falls back to mock mode,
// which auto-verifies without leaving the site, so dev work can continue before
// credentials are available. See resolveMockMode for why that fallback is
// gated on NODE_ENV rather than on the credential alone.

import { resolveMockMode } from "./flow";

const TWITCH_AUTH_BASE = "https://id.twitch.tv/oauth2";
const TWITCH_API_BASE = "https://api.twitch.tv/helix";

export function isMockMode(): boolean {
  return resolveMockMode("twitch", process.env.TWITCH_CLIENT_ID);
}

export function getAuthorizeUrl(state: string, redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: process.env.TWITCH_CLIENT_ID ?? "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "user:read:subscriptions",
    state,
  });
  return `${TWITCH_AUTH_BASE}/authorize?${params}`;
}

type TokenResponse = { access_token: string; expires_in: number; token_type: string };

export async function exchangeCodeForToken(
  code: string,
  redirectUri: string,
): Promise<TokenResponse> {
  const res = await fetch(`${TWITCH_AUTH_BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID ?? "",
      client_secret: process.env.TWITCH_CLIENT_SECRET ?? "",
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });
  if (!res.ok) {
    throw new Error(`Twitch token exchange failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

type HelixUser = { id: string; login: string };

async function getCurrentUser(accessToken: string): Promise<HelixUser> {
  const res = await fetch(`${TWITCH_API_BASE}/users`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Client-Id": process.env.TWITCH_CLIENT_ID ?? "",
    },
  });
  if (!res.ok) {
    throw new Error(`Twitch /users failed: ${res.status}`);
  }
  const json = (await res.json()) as { data: HelixUser[] };
  if (!json.data?.[0]) throw new Error("Twitch /users returned no user");
  return json.data[0];
}

/**
 * Returns true if the authenticated user is a current subscriber to the
 * configured broadcaster channel. Returns false if the API responds 404
 * (user is not subscribed), throws on other errors.
 */
export async function isSubscribedToChannel(accessToken: string): Promise<boolean> {
  const channelId = process.env.TWITCH_CHANNEL_ID;
  if (!channelId) throw new Error("TWITCH_CHANNEL_ID is not configured");

  const user = await getCurrentUser(accessToken);
  const params = new URLSearchParams({
    broadcaster_id: channelId,
    user_id: user.id,
  });
  const res = await fetch(
    `${TWITCH_API_BASE}/subscriptions/user?${params}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-Id": process.env.TWITCH_CLIENT_ID ?? "",
      },
    },
  );
  if (res.status === 404) return false; // not subscribed — documented response
  if (!res.ok) {
    throw new Error(`Twitch /subscriptions/user failed: ${res.status}`);
  }
  const json = (await res.json()) as { data: unknown[] };
  return (json.data?.length ?? 0) > 0;
}
