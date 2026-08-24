import { NextResponse, type NextRequest } from "next/server";

const SHARED_ACCESS_COOKIE = "esb_access";
const LEGACY_ACCESS_COOKIE = "__Host-esb_access";

export function middleware(request: NextRequest) {
  if (request.headers.has("authorization")) return NextResponse.next();

  const accessToken = request.cookies.get(SHARED_ACCESS_COOKIE)?.value
    ?? request.cookies.get(LEGACY_ACCESS_COOKIE)?.value;
  if (!accessToken) return NextResponse.next();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("authorization", `Bearer ${accessToken}`);
  requestHeaders.set("x-esb-shared-session", "1");

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: [
    "/api/support/:path*",
  ],
};
