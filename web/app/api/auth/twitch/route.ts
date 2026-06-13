import { type NextRequest } from "next/server";
import { startOAuth } from "@/lib/oauth/flow";
import * as twitch from "@/lib/oauth/twitch";

export async function GET(req: NextRequest) {
  return startOAuth(req, {
    provider: "twitch",
    isMockMode: twitch.isMockMode,
    getAuthorizeUrl: twitch.getAuthorizeUrl,
  });
}
