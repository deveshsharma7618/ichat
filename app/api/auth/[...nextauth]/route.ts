import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { JWT } from "next-auth/jwt";
import { Account } from "next-auth";

export const AUTH_OPTIONS: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user?: any; account?: Account | null }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }

      // Store OAuth tokens and provider info
      if (account) {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.tokenExpiry = account.expires_at;

        // Save tokens to database for API usage
        try {
          const client = await clientPromise;
          const db = client.db("ichat");
          
          await db.collection("users").updateOne(
            { email: user?.email },
            {
              $set: {
                provider: account.provider,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                tokenExpiry: account.expires_at,
                image: user?.image,
                name: user?.name,
                email: user?.email,
                updatedAt: new Date(),
              },
            },
            { upsert: true }
          );
        } catch (error) {
          console.error("Error saving user tokens:", error);
        }
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        (session.user as any).provider = token.provider;
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).refreshToken = token.refreshToken;
      }
      return session;
    },

    async signIn({ user, account, profile }: { user?: any; account?: Account | null; profile?: any }) {
      try {
        const client = await clientPromise;
        const db = client.db("ichat");

        // Check if user exists, if not create new user
        const existingUser = await db.collection("users").findOne({ email: user?.email });

        if (!existingUser) {
          // Create new user with OAuth data
          await db.collection("users").insertOne({
            email: user?.email,
            name: user?.name,
            image: user?.image,
            provider: account?.provider,
            accessToken: account?.access_token,
            refreshToken: account?.refresh_token,
            tokenExpiry: account?.expires_at,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else {
          // Update existing user with new OAuth data
          await db.collection("users").updateOne(
            { email: user?.email },
            {
              $set: {
                name: user?.name,
                image: user?.image,
                provider: account?.provider,
                accessToken: account?.access_token,
                refreshToken: account?.refresh_token,
                tokenExpiry: account?.expires_at,
                updatedAt: new Date(),
              },
            }
          );
        }

        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Redirect to dashboard after successful sign-in
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl + "/chat";
    },
  },

  events: {
    async signIn({ user, account }: { user?: any; account?: Account | null }) {
    },
    async signOut() {
    },
  },
};

const handler = NextAuth(AUTH_OPTIONS);
export { handler as GET, handler as POST };
