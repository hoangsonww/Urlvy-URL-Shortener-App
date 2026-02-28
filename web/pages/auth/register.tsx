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
import { useAuth } from "@/context/Auth";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import AuthShell from "@/components/AuthShell";

export default function Register() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    void submit();
  };

  const submit = async () => {
    if (!email || !pw1 || !pw2) {
      toast.error("All fields are required");
      return;
    }
    if (pw1 !== pw2) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        email,
        password: pw1,
      });
      login(data.accessToken);
      toast.success("Account created! Redirecting…");
      await router.push("/app/links");
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your workspace"
      description="Set up your Urlvy account and start publishing branded short links with analytics and AI-generated context."
      eyebrow="New workspace"
      pageTitle="Register — Urlvy"
      pageDescription="Create an account to manage your shortened URLs and view their stats"
      asideTitle="Turn link management into a polished operating surface"
      asideDescription="The upgraded Urlvy experience is built to feel fast and trustworthy from the first session, with production-grade visual consistency across auth, dashboard, and detail pages."
      asideBullets={[
        "Launch campaigns with a cleaner creation flow and stronger at-a-glance summaries.",
        "Move from raw URLs to readable slugs and analytics-ready tracking in one place.",
        "Stay aligned across desktop and mobile with responsive, clearer workspace layouts.",
      ]}
      footer={
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-foreground hover:text-primary"
          >
            Log in instead
          </Link>
        </p>
      }
    >
      <Card className="relative overflow-hidden border-border/70 bg-card py-0 shadow-none">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_52%),linear-gradient(180deg,color-mix(in_oklab,var(--color-primary)_10%,var(--color-card)_90%)_0%,color-mix(in_oklab,var(--color-card)_94%,var(--color-chart-2)_6%)_58%,color-mix(in_oklab,var(--color-card)_98%,transparent)_100%)]" />
        <form onSubmit={handleSubmit} className="relative">
          <CardHeader className="border-b border-border/70 pb-5">
            <CardTitle className="text-xl">Start free</CardTitle>
            <p className="text-sm text-muted-foreground">
              Create an account to manage links, stats, and AI summaries from
              one dashboard.
            </p>
          </CardHeader>

          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email address
              </label>
              <Input
                id="email"
                placeholder="name@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <PasswordInput
                id="password"
                placeholder="Create a secure password"
                value={pw1}
                onChange={(e) => setPw1(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="confirm-password">
                Confirm password
              </label>
              <PasswordInput
                id="confirm-password"
                placeholder="Repeat your password"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
          </CardContent>

          <CardFooter className="flex-col items-stretch gap-3 border-t border-border/70 pt-5">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account
                </>
              ) : (
                <>
                  Create workspace
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
            <p className="text-xs leading-5 text-muted-foreground">
              You’ll be signed in immediately after registration and redirected
              to the dashboard.
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthShell>
  );
}
