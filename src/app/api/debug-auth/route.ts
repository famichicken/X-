import { NextResponse } from "next/server";

/**
 * Debug endpoint to verify X API credentials work for Basic Auth.
 * Makes a test token request with a dummy code to verify the auth header format.
 * DELETE THIS FILE after debugging is complete.
 */
export async function GET() {
  const clientId = (process.env.X_CLIENT_ID ?? "").trim();
  const clientSecret = (process.env.X_CLIENT_SECRET ?? "").trim();

  if (!clientId || !clientSecret) {
    return NextResponse.json({
      error: "Missing credentials",
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
    });
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  // Make a test request to X's token endpoint with a dummy code.
  // We expect a 400 "invalid_request" (bad code) NOT a 401 "unauthorized_client".
  // If we get 401, the credentials themselves are wrong.
  const response = await fetch("https://api.x.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: "test_dummy_code",
      redirect_uri: "https://x-post-generator-theta.vercel.app/api/auth/callback/twitter",
      code_verifier: "test_dummy_verifier",
    }).toString(),
  });

  const body = await response.text();

  return NextResponse.json({
    status: response.status,
    credentialCheck: {
      clientIdPrefix: clientId.slice(0, 8) + "...",
      clientIdLength: clientId.length,
      secretLength: clientSecret.length,
      authHeaderPrefix: `Basic ${credentials.slice(0, 16)}...`,
    },
    // 400 = credentials OK but code is invalid (expected)
    // 401 = credentials themselves are rejected
    interpretation:
      response.status === 400
        ? "CREDENTIALS OK - Auth header accepted (code is invalid as expected)"
        : response.status === 401
          ? "CREDENTIALS REJECTED - Auth header not accepted by X API"
          : `Unexpected status ${response.status}`,
    responseBody: body,
  });
}
