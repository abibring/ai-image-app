/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../prisma/prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
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
          session.user.id = user?.id;

          const dbUser = await prisma.user.findFirst({
            where: {
              OR: [{ id: user?.id }, { email: session?.user?.email }],
            },
          });

          if (!dbUser) {
            const dbUser = await prisma.user.create({
              data: {
                name: user.name,
                image: user.image,
                email: user.email,
              },
            });

            if (dbUser) {
              (session.user as any).dbInfo = {
                id: dbUser.id,
              };
            }

            return session;
          }

          (session.user as any).dbInfo = {
            id: dbUser.id,
          };

          return session;
        }
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },
  },
});
