import NextAuth from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    {
      id: "twitter",
      name: "Twitter",
      type: "oauth",
      checks: ["pkce", "state"],
      clientId: process.env.X_CLIENT_ID!,
      clientSecret: process.env.X_CLIENT_SECRET!,
      client: {
        token_endpoint_auth_method: "client_secret_basic",
      },
      authorization: {
        url: "https://x.com/i/oauth2/authorize",
        params: {
          scope: "tweet.read tweet.write users.read offline.access",
        },
      },
      token: "https://api.x.com/2/oauth2/token",
      userinfo: "https://api.x.com/2/users/me?user.fields=profile_image_url",
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
