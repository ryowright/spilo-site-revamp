import { type NextRequest } from "next/server";
import { handleOAuthCallback } from "@/lib/oauth/flow";
import { getCallbackUrl } from "@/lib/site-url";
import * as twitch from "@/lib/oauth/twitch";

export async function GET(req: NextRequest) {
  return handleOAuthCallback(req, {
    provider: "twitch",
    discountKind: "twitch",
    isMockMode: twitch.isMockMode,
    verifyEligibility: async (code) => {
      const tokens = await twitch.exchangeCodeForToken(
        code,
        getCallbackUrl("twitch"),
      );
      return twitch.isSubscribedToChannel(tokens.access_token);
    },
  });
}
