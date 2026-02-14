import NextAuth from "next-auth";
import { customFetch } from "@auth/core";

// Trim to remove any accidental whitespace from env vars
const clientId = (process.env.X_CLIENT_ID ?? "").trim();
const clientSecret = (process.env.X_CLIENT_SECRET ?? "").trim();

if (!clientId || !clientSecret) {
  console.warn("[auth] WARNING: X_CLIENT_ID or X_CLIENT_SECRET is not set!");
}

/**
 * Custom fetch wrapper that fully controls the token exchange request.
 * Constructs a fresh request with explicit Basic Auth header to ensure
 * correct authentication with X's token endpoint.
 */
async function xFetch(
  ...args: Parameters<typeof fetch>
): ReturnType<typeof fetch> {
  const url =
    args[0] instanceof URL
      ? args[0].toString()
      : args[0] instanceof Request
        ? args[0].url
        : String(args[0]);

  if (url.includes("oauth2/token")) {
    const init = args[1] ?? {};

    // Extract body as string (oauth4webapi passes URLSearchParams)
    let bodyStr: string;
    if (init.body instanceof URLSearchParams) {
      bodyStr = init.body.toString();
    } else if (typeof init.body === "string") {
      bodyStr = init.body;
    } else {
      bodyStr = String(init.body ?? "");
    }

    // Use Buffer.from for reliable base64 in Node.js (no URL-encoding needed
    // since these credentials contain only unreserved URI characters)
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );

    console.log("[auth] Token exchange to:", url);
    console.log("[auth] ClientID:", clientId.slice(0, 8) + "...");
    console.log("[auth] Secret length:", clientSecret.length);
    console.log("[auth] Auth header prefix:", `Basic ${credentials.slice(0, 12)}...`);
    console.log("[auth] Body params:", bodyStr.replace(/code=[^&]+/, "code=***").slice(0, 300));

    // Build the request completely from scratch to avoid any header/body issues
    const response = await fetch("https://api.x.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`,
      },
      body: bodyStr,
    });

    if (!response.ok) {
      const errorText = await response.clone().text();
      console.error("[auth] Token FAILED:", response.status, errorText);
    } else {
      console.log("[auth] Token SUCCESS:", response.status);
    }
    return response;
  }

  return fetch(...args);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    {
      id: "twitter",
      name: "Twitter",
      type: "oauth",
      checks: ["pkce", "state"],
      clientId,
      clientSecret,
      authorization: {
        url: "https://x.com/i/oauth2/authorize",
        params: {
          scope: "tweet.read tweet.write users.read offline.access",
        },
      },
      token: "https://api.x.com/2/oauth2/token",
      userinfo: "https://api.x.com/2/users/me?user.fields=profile_image_url",
      [customFetch]: xFetch,
      profile(profile: { data: { id: string; name: string; username: string; email?: string; profile_image_url?: string } }) {
        return {
          id: profile.data.id,
          name: profile.data.name,
          email: profile.data.email ?? null,
          image: profile.data.profile_image_url,
        };
      },
    },
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (profile) {
        const p = profile as { data?: { id: string; username: string } };
        if (p.data) {
          token.sub = p.data.id;
          token.username = p.data.username;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      (session as unknown as Record<string, unknown>).accessToken =
        token.accessToken;
      return session;
    },
  },
  pages: { signIn: "/" },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});
