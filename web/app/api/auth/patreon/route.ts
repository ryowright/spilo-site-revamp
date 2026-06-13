import { type NextRequest } from "next/server";
import { startOAuth } from "@/lib/oauth/flow";
import * as patreon from "@/lib/oauth/patreon";

export async function GET(req: NextRequest) {
  return startOAuth(req, {
    provider: "patreon",
    isMockMode: patreon.isMockMode,
    getAuthorizeUrl: patreon.getAuthorizeUrl,
  });
}
