import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRODUCTION_URL = "https://x-post-generator-theta.vercel.app";

/**
 * Redirect auth signin requests to the production URL.
 * This prevents cookie domain mismatch between preview and production deployments.
 * Cookies set during signin must be on the same domain as the callback URL
 * registered in X Developer Portal.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const origin = request.nextUrl.origin;

  // Only redirect signin requests (not callbacks or session checks)
  if (
    pathname.startsWith("/api/auth/signin") &&
    origin !== PRODUCTION_URL
  ) {
    const redirectUrl = new URL(pathname + search, PRODUCTION_URL);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/:path*"],
};
