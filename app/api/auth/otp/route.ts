import { prisma } from "@/lib/prisma";
import { sendOTP } from "@/lib/brevo";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, action } = await req.json();

    if (!email || !action) {
      return NextResponse.json(
        { error: "Email and action are required" },
        { status: 400 }
      );
    }

    if (action === "signup") {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email already registered. Please login instead." },
          { status: 400 }
        );
      }
    }

    else if (action === "verify-login") {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Account not found. Please sign up instead." },
          { status: 400 }
        );
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await prisma.otp.deleteMany({
      where: {
        email: email,
      },
    });

    await prisma.otp.create({
      data: {
        email: email,
        code: otp,
        expiresAt: expiresAt,
      },
    });

    const optStatus = await sendOTP(email, otp);
    if (optStatus.status !== 200) {
      return NextResponse.json({ error: optStatus.message }, { status: 500 });
    }
    console.log("OTP response:", optStatus);
    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in OTP route:", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing your request.",
      },
      {
        status: 500,
      }
    );
  }
}
