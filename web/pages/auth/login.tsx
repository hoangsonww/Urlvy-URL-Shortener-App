import { useState } from "react";
import { useRouter } from "next/router";
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
import { AlertCircle, Loader2 } from "lucide-react";
import Head from "next/head";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

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
    <>
      <Head>
        <title>Login - Urlvy URL Shortener</title>
        <meta
          name="description"
          content="Log in to manage your shortened URLs and view their stats"
        />
      </Head>
      <Center>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Log in</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <PasswordInput
              placeholder="Password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              disabled={loading}
            />
            {err && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{err}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button className="w-full" onClick={submit} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Enter
            </Button>
            <p className="text-xs">
              No account?{" "}
              <a href="/auth/register" className="underline">
                Sign up
              </a>
            </p>
            <p className="text-xs">
              Forgot your password?{" "}
              <a href="/auth/forgot" className="underline">
                Reset it now
              </a>
            </p>
          </CardFooter>
        </Card>
      </Center>
    </>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4">
      {children}
    </div>
  );
}
