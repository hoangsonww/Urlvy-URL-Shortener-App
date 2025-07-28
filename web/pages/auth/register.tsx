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
import { useAuth } from "@/context/Auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Register() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);

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
    <>
      <Head>
        <title>Register — Urlvy</title>
        <meta
          name="description"
          content="Create an account to manage your shortened URLs and view their stats"
        />
      </Head>

      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Create account</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <PasswordInput
              placeholder="Password"
              value={pw1}
              onChange={(e) => setPw1(e.target.value)}
              disabled={loading}
            />
            <PasswordInput
              placeholder="Confirm password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              disabled={loading}
            />
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button className="w-full" onClick={submit} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Creating…" : "Sign Up"}
            </Button>
            <p className="text-xs text-center">
              Have an account?{" "}
              <a href="/auth/login" className="underline hover:text-primary">
                Log in
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
