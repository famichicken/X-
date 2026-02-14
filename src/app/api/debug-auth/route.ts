import { NextResponse } from "next/server";

/**
 * Debug endpoint to test X API credentials in both modes.
 * DELETE THIS FILE after debugging is complete.
 */
export async function GET() {
  const clientId = (process.env.X_CLIENT_ID ?? "").trim();
  const clientSecret = (process.env.X_CLIENT_SECRET ?? "").trim();

  if (!clientId) {
    return NextResponse.json({ error: "X_CLIENT_ID not set" });
  }

  const dummyBody = {
    grant_type: "authorization_code",
    code: "test_dummy_code",
    redirect_uri:
      "https://x-post-generator-theta.vercel.app/api/auth/callback/twitter",
    code_verifier: "test_dummy_verifier",
  };

  // Test 1: Public Client mode (client_id in body, no auth header)
  const publicRes = await fetch("https://api.x.com/2/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      ...dummyBody,
      client_id: clientId,
    }).toString(),
  });
  const publicBody = await publicRes.text();

  // Test 2: Confidential Client mode (Basic Auth header)
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );
  const confidentialRes = await fetch("https://api.x.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams(dummyBody).toString(),
  });
  const confidentialBody = await confidentialRes.text();

  // 400 = auth accepted, code invalid (good)
  // 401 = auth rejected (bad)
  return NextResponse.json({
    publicClient: {
      status: publicRes.status,
      ok: publicRes.status === 400 ? "AUTH_ACCEPTED" : "AUTH_REJECTED",
      response: publicBody,
    },
    confidentialClient: {
      status: confidentialRes.status,
      ok: confidentialRes.status === 400 ? "AUTH_ACCEPTED" : "AUTH_REJECTED",
      response: confidentialBody,
    },
    credentials: {
      clientIdPrefix: clientId.slice(0, 8) + "...",
      clientIdLength: clientId.length,
      hasSecret: !!clientSecret,
      secretLength: clientSecret.length,
    },
  });
}
