"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
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
import { ArrowRight, Loader2 } from "lucide-react";
import AuthShell from "@/components/AuthShell";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    if (step === "email") {
      void sendEmail();
    } else {
      void doReset();
    }
  };

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
    <AuthShell
      title={step === "email" ? "Recover your account" : "Set a new password"}
      description="Verify your email first, then choose a new password to regain access to your Urlvy workspace."
      eyebrow="Account recovery"
      pageTitle={`${step === "email" ? "Forgot Password" : "Reset Password"} — Urlvy`}
      pageDescription="Reset your Urlvy password"
      asideTitle="Keep access smooth without compromising trust"
      asideDescription="Recovery should be clear, fast, and reassuring. This flow keeps the steps obvious while preserving the same polished product language as the rest of the app."
      asideBullets={[
        "Simple two-step recovery: verify identity first, then create a new password.",
        "Clear state transitions so users always know what happens next.",
        "Consistent visuals and spacing so recovery feels like part of the product, not an afterthought.",
      ]}
      footer={
        <p className="text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-foreground hover:text-primary"
          >
            Back to login
          </Link>
        </p>
      }
    >
      <Card className="relative overflow-hidden border-border/70 bg-card py-0 shadow-none">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_52%),linear-gradient(180deg,color-mix(in_oklab,var(--color-primary)_10%,var(--color-card)_90%)_0%,color-mix(in_oklab,var(--color-card)_94%,var(--color-chart-2)_6%)_58%,color-mix(in_oklab,var(--color-card)_98%,transparent)_100%)]" />
        <form onSubmit={handleSubmit} className="relative">
          <CardHeader className="border-b border-border/70 pb-5">
            <CardTitle className="text-xl">
              {step === "email" ? "Verify email" : "Create new password"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {step === "email"
                ? "We’ll confirm your account first before allowing a password reset."
                : "Use a new password you haven’t used here before."}
            </p>
          </CardHeader>

          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={step === "reset"}
                disabled={step === "reset" || loading}
                autoComplete="email"
              />
            </div>

            {step === "reset" ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="new-password">
                    New password
                  </label>
                  <PasswordInput
                    id="new-password"
                    placeholder="Create a new password"
                    value={pw1}
                    onChange={(e) => setPw1(e.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="confirm-password"
                  >
                    Confirm new password
                  </label>
                  <PasswordInput
                    id="confirm-password"
                    placeholder="Repeat your new password"
                    value={pw2}
                    onChange={(e) => setPw2(e.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>
              </>
            ) : null}
          </CardContent>

          <CardFooter className="flex-col items-stretch gap-3 border-t border-border/70 pt-5">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {step === "email" ? "Verifying email" : "Resetting password"}
                </>
              ) : (
                <>
                  {step === "email" ? "Continue" : "Reset password"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
            <p className="text-xs leading-5 text-muted-foreground">
              {step === "email"
                ? "After verification, you’ll be able to choose a replacement password immediately."
                : "Once complete, you’ll be redirected back to the login screen."}
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthShell>
  );
}
