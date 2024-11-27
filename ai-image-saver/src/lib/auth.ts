import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../prisma/prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      try {
        if (session.user) {
          session.user.id = user.id;
          // Fetch additional user data from the database
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
          });
          console.log("dbUser:", dbUser);
          //   if (dbUser) {
          //     (session.user as any).isHandyman = dbUser.isHandyman;
          //     (session.user as any).handyman = dbUser.handyman;
          //   }
        }
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },
  },
});
