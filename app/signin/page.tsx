"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/chat";

  useEffect(() => {
    console.log(
      "Signin page loaded, search params:",
      Object.fromEntries(searchParams.entries())
    );
  }, [searchParams]);

  async function handleLoginEmail() {
    setIsLoading(true);
    setError("");

    try {
      // For login, first check if user exists and is verified
      const response = await fetch("http://localhost:3000/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      console.log(response)
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || `Server error: ${response.status} ${response.statusText}`;
        // console.error("API Error:", errorMessage, errorData);
        throw new Error(errorMessage);
      }

      const { exists, verified } = await response.json();

      if (!exists) {
        setError("Account not found. Please sign up instead.");
        return;
      }

      if (verified) {
        // User is verified, direct login
        const result = await signIn("login-credentials", {
          email,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        router.push(callbackUrl);
      } else {
        // User exists but needs verification, send OTP
        const otpResponse = await fetch("/api/auth/otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, action: "verify-login" }),
        });

        if (!otpResponse.ok) {
          const data = await otpResponse.json();
          throw new Error(data.error || "Failed to send verification code");
        }

        setIsOtpSent(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignupEmail() {
    setIsLoading(true);
    setError("");

    try {
      // For signup, check if user already exists
      const response = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const { exists } = await response.json();

      if (exists) {
        setError("Email already registered. Please login instead.");
        return;
      }

      // Send OTP for new registration
      const otpResponse = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "signup" }),
      });

      if (!otpResponse.ok) {
        const data = await otpResponse.json();
        throw new Error(data.error || "Failed to send verification code");
      }

      setIsOtpSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start signup");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyOtp() {
    setIsLoading(true);
    setError("");

    try {
      const action = activeTab === "login" ? "verify" : "signup";

      const result = await signIn("signup-otp", {
        email,
        otp,
        action,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push(callbackUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            HR Assistant
          </CardTitle>
          <CardDescription className="text-center">
            {isOtpSent ? "Verify your identity" : "Sign in to your account"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isOtpSent ? (
            <Tabs
              defaultValue={activeTab}
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handleLoginEmail}
                  disabled={isLoading || !email}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Continue with Email"
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-email"
                      placeholder="name@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handleSignupEmail}
                  disabled={isLoading || !email}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="otp"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="pl-10"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Enter the 6-digit code sent to {email}
                </p>
              </div>

              <Button
                className="w-full"
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setIsOtpSent(false)}
                disabled={isLoading}
              >
                Back to {activeTab === "login" ? "Login" : "Sign Up"}
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center text-center text-xs text-gray-500">
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
