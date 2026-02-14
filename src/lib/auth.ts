import NextAuth from "next-auth";
import { customFetch } from "@auth/core";

// Trim to remove any accidental whitespace from env vars
const clientId = (process.env.X_CLIENT_ID ?? "").trim();
const clientSecret = (process.env.X_CLIENT_SECRET ?? "").trim();

/**
 * Custom fetch for X token endpoint.
 * Tries Public Client mode: sends client_id in body (no Basic Auth).
 * X Public Clients use PKCE only and reject Basic Auth headers.
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

    // Extract body params from oauth4webapi's URLSearchParams
    let bodyParams: URLSearchParams;
    if (init.body instanceof URLSearchParams) {
      bodyParams = new URLSearchParams(init.body);
    } else if (typeof init.body === "string") {
      bodyParams = new URLSearchParams(init.body);
    } else {
      bodyParams = new URLSearchParams();
    }

    // For Public Client: add client_id to body instead of Basic Auth header
    if (!bodyParams.has("client_id")) {
      bodyParams.set("client_id", clientId);
    }

    console.log("[auth] Token exchange to:", url);
    console.log("[auth] Mode: Public Client (PKCE, no Basic Auth)");
    console.log("[auth] ClientID:", clientId.slice(0, 8) + "...");
    console.log("[auth] Body keys:", Array.from(bodyParams.keys()).join(", "));

    const response = await fetch("https://api.x.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyParams.toString(),
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
      client: {
        token_endpoint_auth_method: "none",
      },
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
