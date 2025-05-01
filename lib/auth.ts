import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { SessionStrategy } from "next-auth";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: "login-credentials",
      name: "Email Login",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error("Email is required");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.isVerified) {
          throw new Error("User not found or not verified");
        }

        return user;
      },
    }),
    CredentialsProvider({
      id: "signup-otp",
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP Code", type: "text" },
        action: { label: "Action", type: "text" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp || !credentials?.action) {
          throw new Error("Email, OTP, and action are required");
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
          throw new Error("Invalid or expired OTP code");
        }

        await prisma.otp.delete({
          where: {
            id: otpRecord.id,
          },
        });

        if (credentials.action == "signup") {
          const existingUser = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (existingUser) {
            throw new Error("User already exists");
          }

          return await prisma.user.create({
            data: {
              email: credentials.email,
              isVerified: true,
            },
          });
        } else {
          let user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            throw new Error("User not found");
          }

          if (!user.isVerified) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { isVerified: true },
            });
          }

          return user;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  pages: {
    signIn: "/signin",
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
