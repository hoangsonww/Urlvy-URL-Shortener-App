"use client";

import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type AuthShellProps = {
  title: string;
  description: string;
  eyebrow: string;
  pageTitle: string;
  pageDescription: string;
  asideTitle: string;
  asideDescription: string;
  asideBullets: string[];
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthShell({
  title,
  description,
  eyebrow,
  pageTitle,
  pageDescription,
  asideTitle,
  asideDescription,
  asideBullets,
  children,
  footer,
}: AuthShellProps) {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>

      <section className="page-shell page-section">
        <div className="surface-panel overflow-hidden">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <aside className="relative overflow-hidden border-b border-border/70 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-primary)_14%,transparent),transparent_50%)] p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--color-primary)_22%,transparent),transparent_58%),linear-gradient(180deg,color-mix(in_oklab,var(--color-primary)_10%,transparent),transparent_68%)] opacity-80" />
              <div className="relative space-y-6">
                <Badge variant="secondary" className="eyebrow">
                  <Sparkles className="h-3.5 w-3.5" />
                  {eyebrow}
                </Badge>

                <div className="space-y-4">
                  <h1 className="max-w-lg text-3xl font-semibold tracking-tight sm:text-4xl">
                    {asideTitle}
                  </h1>
                  <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                    {asideDescription}
                  </p>
                </div>

                <div className="grid gap-3">
                  {asideBullets.map((bullet) => (
                    <div
                      key={bullet}
                      className="surface-muted flex items-start gap-3 px-4 py-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <p className="text-sm leading-6 text-muted-foreground">
                        {bullet}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="surface-muted flex items-center justify-between gap-4 px-4 py-4">
                  <div>
                    <p className="text-sm font-medium">
                      Security-first by default
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Trusted routing, fast redirects, and live analytics in one
                      workspace.
                    </p>
                  </div>
                  <ShieldCheck className="h-10 w-10 text-primary" />
                </div>

                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  View the product homepage
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center">
                <div className="mb-8 space-y-3">
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
                    {eyebrow}
                  </p>
                  <h2 className="text-3xl font-semibold tracking-tight">
                    {title}
                  </h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </div>

                {children}

                {footer ? <div className="mt-6">{footer}</div> : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
