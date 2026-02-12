import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const config: NextAuthConfig = {
  ...(prisma ? { adapter: PrismaAdapter(prisma) } : {}),
  providers: [
    {
      id: "twitter",
      name: "X (Twitter)",
      type: "oauth",
      clientId: process.env.X_CLIENT_ID ?? "",
      clientSecret: process.env.X_CLIENT_SECRET ?? "",
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: {
          scope: "tweet.read tweet.write users.read offline.access",
        },
      },
      token: "https://api.twitter.com/2/oauth2/token",
      userinfo: "https://api.twitter.com/2/users/me?user.fields=profile_image_url",
      profile(profile: { data: { id: string; name: string; username: string; profile_image_url?: string } }) {
        return {
          id: profile.data.id,
          name: profile.data.name,
          email: null,
          image: profile.data.profile_image_url,
          xUsername: profile.data.username,
          xId: profile.data.id,
        };
      },
    },
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        (session.user as { id: string }).id = user.id;
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
