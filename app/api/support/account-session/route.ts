import { NextRequest, NextResponse } from "next/server";
import { verifySupabaseAccessToken } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const sharedAccessToken = request.cookies.get("esb_access")?.value
    ?? request.cookies.get("__Host-esb_access")?.value
    ?? null;
  const authorization = request.headers.get("authorization")
    ?? (sharedAccessToken ? `Bearer ${sharedAccessToken}` : null);
  const account = await verifySupabaseAccessToken(authorization);

  if (!account) {
    return NextResponse.json(
      { authenticated: false },
      { status: 200, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const username = String(
    account.userMetadata.username
      ?? account.userMetadata.display_name
      ?? account.userMetadata.full_name
      ?? "ESB Games account",
  ).trim();
  const displayName = String(
    account.userMetadata.display_name
      ?? account.userMetadata.full_name
      ?? account.userMetadata.username
      ?? "ESB Games user",
  ).trim();

  return NextResponse.json(
    {
      authenticated: true,
      account: {
        id: account.id,
        username,
        displayName,
        email: account.email ?? null,
      },
    },
    { status: 200, headers: { "Cache-Control": "private, no-store" } },
  );
}
