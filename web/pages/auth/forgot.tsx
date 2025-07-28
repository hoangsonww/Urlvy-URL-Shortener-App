"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { api } from "@/lib/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/PasswordInput";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: verify email exists
  const sendEmail = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/forgot", { email });
      toast.success("Email verified — enter a new password");
      setStep("reset");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to verify email");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: reset password
  const doReset = async () => {
    if (!pw1 || pw1 !== pw2) {
      toast.error(pw1 ? "Passwords must match" : "Please enter a new password");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset", { email, newPassword: pw1 });
      toast.success("Password reset! Redirecting to login…");
      setTimeout(() => router.push("/auth/login"), 1000);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>
          {step === "email" ? "Forgot Password" : "Reset Password"} — Urlvy
        </title>
        <meta name="description" content="Reset your Urlvy password" />
      </Head>

      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>
              {step === "email" ? "Forgot Password" : "Reset Password"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Email input always visible; locked on reset */}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={step === "reset"}
              disabled={step === "reset" || loading}
            />

            {/* Only show password fields in reset step */}
            {step === "reset" && (
              <>
                <PasswordInput
                  placeholder="New password"
                  value={pw1}
                  onChange={(e) => setPw1(e.target.value)}
                  disabled={loading}
                />
                <PasswordInput
                  placeholder="Confirm new password"
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  disabled={loading}
                />
              </>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            {step === "email" ? (
              <Button className="w-full" onClick={sendEmail} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Verify Email
              </Button>
            ) : (
              <Button className="w-full" onClick={doReset} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Reset Password
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
