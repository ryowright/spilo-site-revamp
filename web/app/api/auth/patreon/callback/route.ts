import { type NextRequest } from "next/server";
import { handleOAuthCallback } from "@/lib/oauth/flow";
import { getCallbackUrl } from "@/lib/site-url";
import * as patreon from "@/lib/oauth/patreon";

export async function GET(req: NextRequest) {
  return handleOAuthCallback(req, {
    provider: "patreon",
    discountKind: "patreon",
    isMockMode: patreon.isMockMode,
    verifyEligibility: async (code) => {
      const tokens = await patreon.exchangeCodeForToken(
        code,
        getCallbackUrl("patreon"),
      );
      return patreon.isActiveMember(tokens.access_token);
    },
  });
}
