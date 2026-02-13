import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Twitter from "next-auth/providers/twitter";

const config: NextAuthConfig = {
  providers: [
    Twitter({
      clientId: process.env.X_CLIENT_ID!,
      clientSecret: process.env.X_CLIENT_SECRET!,
      authorization: {
        url: "https://x.com/i/oauth2/authorize",
        params: {
          scope: "tweet.read tweet.write users.read offline.access",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const p = profile as { data?: { id: string; username: string } };
        if (p.data) {
          token.sub = p.data.id;
          token.username = p.data.username;
        }
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-placeholder",
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
