import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppBar } from "@/components/Appbar";
import { Providers } from "./Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HRCompass | AI Career Assistant",
  description:
    "Get personalized career guidance, resume help, and interview preparation from our AI-powered career assistant.",
  keywords:
    "career advice, job search, resume help, interview preparation, AI assistant, HR bot",
  twitter: {
    card: "summary_large_image",
    title: "HRSpark | AI Career Assistant",
    description: "Expert career guidance powered by AI",
    images: ["/image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AppBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
