import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Twitter from "next-auth/providers/twitter";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const config: NextAuthConfig = {
  ...(prisma ? { adapter: PrismaAdapter(prisma) } : {}),
  session: { strategy: prisma ? "database" : "jwt" },
  providers: [
    Twitter({
      clientId: process.env.X_CLIENT_ID ?? "",
      clientSecret: process.env.X_CLIENT_SECRET ?? "",
      authorization: {
        url: "https://x.com/i/oauth2/authorize",
        params: {
          scope: "tweet.read tweet.write users.read offline.access",
        },
      },
      profile({ data }) {
        return {
          id: data.id,
          name: data.name,
          email: data.email ?? null,
          image: data.profile_image_url,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        const p = profile as { data?: { id: string; username: string } };
        if (p.data) {
          token.sub = p.data.id;
          token.username = p.data.username;
        }
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session.user) {
        if (token) {
          session.user.id = token.sub ?? "";
        } else if (user) {
          session.user.id = user.id;
        }
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
