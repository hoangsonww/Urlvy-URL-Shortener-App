"use client";

import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";
import { ArrowLeft, FileText, Scale, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LegalLayoutProps = {
  title: string;
  description: string;
  pageTitle: string;
  eyebrow: string;
  icon: ReactNode;
  effectiveDate: string;
  children: ReactNode;
};

export default function LegalLayout({
  title,
  description,
  pageTitle,
  eyebrow,
  icon,
  effectiveDate,
  children,
}: LegalLayoutProps) {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
      </Head>

      <section className="page-shell page-section space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="relative overflow-hidden border-border/70 bg-card/94 py-0">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--color-primary)_18%,transparent),transparent_58%),linear-gradient(180deg,color-mix(in_oklab,var(--color-primary)_10%,transparent),transparent_72%)]" />
            <CardHeader className="relative gap-4 border-b border-border/70 pb-5">
              <Badge variant="secondary" className="eyebrow">
                <Scale className="h-3.5 w-3.5" />
                {eyebrow}
              </Badge>
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10 text-primary">
                {icon}
              </div>
              <div className="space-y-3">
                <CardTitle className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {title}
                </CardTitle>
                <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                  {description}
                </p>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-4 pt-6">
              <div className="surface-muted px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Effective date
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {effectiveDate}
                </p>
              </div>

              <div className="surface-muted flex items-start gap-3 px-4 py-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm leading-6 text-muted-foreground">
                  These pages are written to reflect the current behavior of the
                  Urlvy application as implemented in this codebase, including
                  authentication, redirect tracking, analytics, and AI summary
                  features.
                </p>
              </div>

              <div className="surface-muted flex items-start gap-3 px-4 py-4">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm leading-6 text-muted-foreground">
                  For legal or privacy inquiries, contact{" "}
                  <a
                    href="mailto:hoangson091104@gmail.com"
                    className="font-medium text-foreground hover:text-primary"
                  >
                    hoangson091104@gmail.com
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/94 py-0">
            <CardContent className="legal-copy pt-6 text-sm leading-7 text-muted-foreground">
              {children}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
