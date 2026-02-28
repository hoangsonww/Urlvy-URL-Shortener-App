import Head from "next/head";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertOctagon, ArrowLeft, Compass, Sparkles } from "lucide-react";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 — Page Not Found</title>
        <meta
          name="description"
          content="The page you are looking for could not be found."
        />
      </Head>

      <section className="page-shell page-section flex min-h-[calc(100vh-8rem)] items-center">
        <Card className="mx-auto w-full max-w-4xl overflow-hidden border-border/70 bg-card/94 py-0">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="border-b border-border/70 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-primary)_14%,transparent),transparent_58%)] p-8 lg:border-b-0 lg:border-r lg:p-10">
              <div className="space-y-6">
                <div className="eyebrow">
                  <Sparkles className="h-3.5 w-3.5" />
                  Missing route
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-destructive/20 bg-destructive/10 text-destructive">
                  <AlertOctagon className="h-7 w-7" />
                </div>
                <div className="space-y-3">
                  <h1 className="text-5xl font-semibold tracking-tight">404</h1>
                  <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                    The page you requested does not exist, may have moved, or
                    the link was malformed.
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="flex flex-col justify-center gap-6 p-8 lg:p-10">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Return to a valid Urlvy surface
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Go back to the homepage to create or manage links, or return
                  to the previous page if you came from the dashboard.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button asChild className="w-full">
                  <Link href="/">
                    <Compass className="h-4 w-4" />
                    Go to home
                  </Link>
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go back
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </section>
    </>
  );
}
