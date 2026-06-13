import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

// Clear the verified-discount cookie. Used when the user wants to re-verify
// (e.g. they were verified Patreon but want to use Twitch instead) or to
// drop a verification without re-running the OAuth flow.
export async function POST() {
  const session = await getSession();
  session.destroy();
  return NextResponse.json({ ok: true });
}
