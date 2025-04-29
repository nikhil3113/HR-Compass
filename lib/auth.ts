import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { SessionStrategy } from "next-auth";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP Code", type: "text" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          return null;
        }

        const otpRecord = await prisma.otp.findFirst({
          where: {
            email: credentials.email,
            code: credentials.otp,
            expiresAt: {
              gt: new Date(),
            },
          },
        });

        if (!otpRecord) {
          return null;
        }

        await prisma.otp.delete({
          where: {
            id: otpRecord.id,
          },
        });

        let user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              isVerified: true,
            },
          });
        } else if (!user.isVerified) {
          user = await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              isVerified: true,
            },
          });
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.sub;

        const user = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { isVerified: true },
        });

        if (user) {
          session.user.isVerified = user.isVerified;
        }
      }
      return session;
    },
  },
};
