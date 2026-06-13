import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

// Returns the current booking session — used by the modal to know whether
// the user has a verified discount cookie from a prior OAuth round-trip.
// Always returns 200 with a JSON payload; never leaks the OAuth state.
export async function GET() {
  const session = await getSession();
  return NextResponse.json({
    discount: session.discount ?? null,
    verifiedAt: session.verifiedAt ?? null,
  });
}
