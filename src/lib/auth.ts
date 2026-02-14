import NextAuth from "next-auth";
import { customFetch } from "@auth/core";

const clientId = process.env.X_CLIENT_ID ?? "";
const clientSecret = process.env.X_CLIENT_SECRET ?? "";

if (!clientId || !clientSecret) {
  console.warn(
    "[auth] WARNING: X_CLIENT_ID or X_CLIENT_SECRET is not set!",
    { hasClientId: !!clientId, hasClientSecret: !!clientSecret }
  );
}

/**
 * Custom fetch wrapper to ensure Basic Auth is sent for X token endpoint.
 * Works around potential issues with oauth4webapi not sending the header correctly.
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
    const basic = btoa(
      `${encodeURIComponent(clientId)}:${encodeURIComponent(clientSecret)}`
    );
    const init = args[1] ?? {};
    const headers =
      init.headers instanceof Headers
        ? init.headers
        : new Headers(init.headers as HeadersInit);
    headers.set("authorization", `Basic ${basic}`);
    console.log("[auth] Token exchange request to:", url);
    console.log("[auth] Client ID present:", !!clientId, "length:", clientId.length);
    console.log("[auth] Client Secret present:", !!clientSecret, "length:", clientSecret.length);

    const response = await fetch(args[0], { ...init, headers });
    if (!response.ok) {
      const errorText = await response.clone().text();
      console.error("[auth] Token exchange FAILED:", response.status, errorText);
    } else {
      console.log("[auth] Token exchange SUCCESS:", response.status);
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
