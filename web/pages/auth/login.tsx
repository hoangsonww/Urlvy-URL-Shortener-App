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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import AuthShell from "@/components/AuthShell";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    void submit();
  };

  const submit = async () => {
    setLoading(true);
    setErr("");
    try {
      const { data } = await api.post("/auth/login", { email, password: pw });
      login(data.accessToken);
      await router.push("/app/links");
    } catch (e: any) {
      setErr(e.response?.data?.message ?? "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      description="Log in to manage branded links, review click performance, and launch new redirects without friction."
      eyebrow="Account access"
      pageTitle="Login - Urlvy URL Shortener"
      pageDescription="Log in to manage your shortened URLs and view their stats"
      asideTitle="Run every link from one clean workspace"
      asideDescription="Urlvy keeps creation, analytics, and AI summaries in the same environment so you can move from idea to publish without switching tools."
      asideBullets={[
        "Create short links in seconds with strong visual hierarchy and fast feedback.",
        "Track campaign performance with clearer charts, summaries, and filtered views.",
        "Keep your team aligned with a consistent dashboard experience across devices.",
      ]}
      footer={
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            No account yet?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-foreground hover:text-primary"
            >
              Create one
            </Link>
          </p>
          <p>
            Forgot your password?{" "}
            <Link
              href="/auth/forgot"
              className="font-medium text-foreground hover:text-primary"
            >
              Reset it here
            </Link>
          </p>
        </div>
      }
    >
      <Card className="relative overflow-hidden border-border/70 bg-card py-0 shadow-none">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_52%),linear-gradient(180deg,color-mix(in_oklab,var(--color-primary)_10%,var(--color-card)_90%)_0%,color-mix(in_oklab,var(--color-card)_94%,var(--color-chart-2)_6%)_58%,color-mix(in_oklab,var(--color-card)_98%,transparent)_100%)]" />
        <form onSubmit={handleSubmit} className="relative">
          <CardHeader className="border-b border-border/70 pb-5">
            <CardTitle className="text-xl">Sign in</CardTitle>
            <p className="text-sm text-muted-foreground">
              Use your email and password to continue to your dashboard.
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
                placeholder="Enter your password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            {err ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Unable to sign in</AlertTitle>
                <AlertDescription>{err}</AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-3 border-t border-border/70 pt-5">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in
                </>
              ) : (
                <>
                  Enter workspace
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
            <p className="text-xs leading-5 text-muted-foreground">
              By continuing, you access your link performance data, summaries,
              and account settings.
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthShell>
  );
}
