"use client";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Rocket,
  ShieldCheck,
  BarChart2,
  Clock,
  RefreshCcw,
  Globe,
  Zap,
  ArrowRight,
  Check,
  Cpu,
  PieChart,
  TrendingUp,
  Layers,
  ZapOff,
  Slack,
  Cloud,
  GitBranch,
  Star,
  Link2,
} from "lucide-react";

function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return { ref, val };
}

const rotate = ["reach", "links", "insight", "content", "product", "traffic"];

const features = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "1-Click shortening",
    desc: "Drop a URL & get a branded slug instantly.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Enterprise-grade security",
    desc: "JWT, RBAC & audit logs. We safeguard your data.",
  },
  {
    icon: <BarChart2 className="h-6 w-6" />,
    title: "Real-time analytics",
    desc: "Dashboards update the moment someone clicks.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Auto-expiry & TTL",
    desc: "Links self-destruct when you decide.",
  },
  {
    icon: <RefreshCcw className="h-6 w-6" />,
    title: "AI summaries",
    desc: "Gemini crafts a bite-sized preview of every link.",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Track clicks globally",
    desc: "See who clicked, where they are, and when they did.",
  },
];

const howSteps = [
  { icon: <Link2 />, t: "Paste any link" },
  { icon: <Cpu />, t: "AI enriches & stores" },
  { icon: <TrendingUp />, t: "Share & watch clicks roll in" },
];

const integrations = [
  { icon: <Slack size={26} />, label: "Slack" },
  { icon: <Cloud size={26} />, label: "Zapier" },
  { icon: <GitBranch size={26} />, label: "GitHub" },
  { icon: <PieChart size={26} />, label: "Google Analytics" },
  { icon: <ZapOff size={26} />, label: "Segment" },
];

const testimonials = [
  [
    "Urlvy boosted our newsletter CTR by 64 %. The live dashboard is pure gold.",
    "Isabella M.",
    "Growth Lead",
  ],
  [
    "The AI snippet convinces readers to click — we literally see dwell-time rise.",
    "Thomas J.",
    "Content Strategist",
  ],
  [
    "Finally, a short-link tool that our security team actually signed off on.",
    "Priya K.",
    "DevSecOps",
  ],
];

const faq = [
  [
    "Is Urlvy free forever?",
    "All core features are free during beta. Affordable tiers arrive post-launch.",
  ],
  [
    "Do you show ads or interstitial pages?",
    "Absolutely not. Redirects are instant.",
  ],
  ["Can I bring my own domain?", "Custom domains + SSL arrive Q4 2025."],
  ["Is there an SDK?", "REST & GraphQL arrive first; JS SDK follows."],
];

//  page
export default function Landing() {
  // rotate word in hero
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setW((i) => (i + 1) % rotate.length), 2300);
    return () => clearInterval(id);
  }, []);

  // counters
  const lk = useCountUp(252_300);
  const us = useCountUp(17_800);
  const ct = useCountUp(162);

  return (
    <>
      <Head>
        <title>Urlvy – Short links. Infinite insight.</title>
        <meta
          name="description"
          content="Shrink URLs, brand them, and track every click in real-time — with AI summaries built-in."
        />
      </Head>

      {/* HERO  */}
      <section className="relative flex flex-col items-center justify-center text-center h-[calc(100dvh-4rem)] overflow-hidden">
        {/* animated BG */}
        <div className="absolute inset-0 -z-10 bg-[length:300%_300%] bg-gradient-to-br from-primary via-secondary to-accent animate-gradient" />

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight max-w-4xl">
          Super-charge your&nbsp;
          <span className="text-primary">{rotate[w]}</span>&nbsp;with smarter
          links
        </h1>

        <p className="max-w-2xl mx-auto mt-6 text-muted-foreground">
          Urlvy turns unwieldy URLs into memorable slugs, adds AI-powered
          previews, and tells you exactly who clicked — in real time.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link href="/auth/register">
            <Button size="lg">
              Start free
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link
            href="https://urlvy-url-shortener-app.onrender.com/docs"
            target="_blank"
          >
            <Button size="lg" variant="outline">
              API Docs
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mt-16 text-sm">
          <Counter
            icon={<Link2 className="h-4 w-4" />}
            val={lk.val}
            label="Links created"
          />
          <Counter
            icon={<Star className="h-4 w-4 text-yellow-400" />}
            val="4.9★"
            label="User rating"
          />
          <Counter
            icon={<Globe className="h-4 w-4" />}
            val={ct.val}
            label="Countries"
          />
        </div>
      </section>

      {/* FEATURES GRID  */}
      <Section title="Everything you need to win clicks">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <Card
              key={f.title}
              className="group hover:-translate-y-2 hover:shadow-xl transition"
            >
              <CardHeader className="flex items-center gap-3">
                <div className="text-primary">{f.icon}</div>
                <CardTitle>{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* DEEP-DIVE CHART + COPY */}
      <section className="bg-muted/5 py-24">
        <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-16 items-center">
          <img
            src="/demo.png"
            alt="Realtime dashboard mock"
            className="rounded-xl border shadow-md"
          />
          <div className="space-y-6">
            <Badge variant="secondary" className="text-xs">
              DASHBOARD
            </Badge>
            <h2 className="text-3xl font-bold">
              Live insights, no setup script
            </h2>
            <p className="text-muted-foreground">
              Traditional analytics tools need code snippets. Urlvy starts
              capturing data the moment you shorten — zero integration required.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" /> Live charts &
                dashboards
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" /> UTM source / medium
                breakout
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" /> Precise click
                tracking with no cookies
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS  */}
      <Section title="Three simple steps">
        <div className="grid sm:grid-cols-3 gap-8 text-center">
          {howSteps.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full border flex items-center justify-center bg-background text-primary">
                {s.icon}
              </div>
              <p className="font-semibold">{s.t}</p>
              <span className="text-muted-foreground text-xs">
                Step {i + 1}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* INTEGRATIONS */}
      <Section title="Plays nice with your stack">
        <div className="flex flex-wrap justify-center gap-12">
          {integrations.map((i) => (
            <div key={i.label} className="flex flex-col items-center gap-2">
              {i.icon}
              <span className="text-xs text-muted-foreground">{i.label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* USE-CASES */}
      <Section title="Who is Urlvy for?">
        <div className="grid lg:grid-cols-3 gap-8">
          <UseCase
            icon={<Rocket className="h-6 w-6" />}
            h="Marketers"
            p="Boost CTR & attribute every click."
          />
          <UseCase
            icon={<Layers className="h-6 w-6" />}
            h="Product Teams"
            p="Ship release notes with concise links."
          />
          <UseCase
            icon={<Cpu className="h-6 w-6" />}
            h="Developers"
            p="Log link events via REST & Webhooks."
          />
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <section className="bg-muted/5 py-24">
        <div className="mx-auto max-w-6xl px-6 space-y-12">
          <h2 className="text-3xl font-bold text-center">What users say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map(([msg, name, role], i) => (
              <Card
                key={i}
                className="hover:shadow-lg hover:-translate-y-2 transition"
              >
                <CardContent className="p-6 space-y-4">
                  <p>&ldquo;{msg}&rdquo;</p>
                  <p className="font-semibold">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <Section title="Simple pricing">
        <p className="text-center text-muted-foreground mb-8">
          All is free during beta · Upgrade when you outgrow
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {["Free", "Pro", "Enterprise"].map((tier) => (
            <Card
              key={tier}
              className="flex flex-col hover:shadow-lg transition"
            >
              <CardHeader>
                <CardTitle>{tier}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                {tier === "Pro" ? (
                  <h3 className="text-4xl font-bold text-primary">$9/month</h3>
                ) : tier === "Enterprise" ? (
                  <h3 className="text-4xl font-bold text-primary">
                    Contact us
                  </h3>
                ) : (
                  <h3 className="text-4xl font-bold text-primary">
                    Free forever
                  </h3>
                )}
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2 items-center">
                    <Check size={14} className="text-primary" /> Unlimited links
                  </li>
                  <li className="flex gap-2 items-center">
                    <Check size={14} className="text-primary" /> Real-time
                    analytics
                  </li>
                  <li className="flex gap-2 items-center">
                    <Check size={14} className="text-primary" /> AI summaries
                  </li>
                  {tier !== "Free" && (
                    <li className="flex gap-2 items-center">
                      <Check size={14} className="text-primary" /> Team
                      workspaces
                    </li>
                  )}
                  {tier === "Enterprise" && (
                    <li className="flex gap-2 items-center">
                      <Check size={14} className="text-primary" /> SSO & SLA
                    </li>
                  )}
                </ul>
                <Button disabled>Join wait-list</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section title="Frequently asked">
        <Accordion type="single" collapsible defaultValue="faq-0">
          {faq.map(([q, a], i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-b">
              <AccordionTrigger>{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      {/* CTA */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/30 to-secondary/30 blur-2xl -z-10 opacity-20" />
        <div className="mx-auto max-w-6xl px-6 py-24 text-center space-y-6">
          <h2 className="text-4xl font-extrabold">Shrink. Share. Track.</h2>
          <p className="text-muted-foreground">
            Hit &ldquo;Start free&rdquo; and create your first smart link in
            under five seconds.
          </p>
          <Link href="/auth/register">
            <Button size="lg">Start free</Button>
          </Link>
        </div>
      </section>

      {/* gradient keyframes */}
      <style jsx>{`
        @keyframes gradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          animation: gradientShift 18s linear infinite;
        }
      `}</style>
    </>
  );
}

//  reusable section wrapper
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 space-y-12 min-w-[75vw]">
      <h2 className="text-3xl font-bold text-center">{title}</h2>
      {children}
    </section>
  );
}

//  tiny pieces
function Counter({
  icon,
  val,
  label,
}: {
  icon: React.ReactNode;
  val: number | string;
  label: string;
}) {
  return (
    <Badge
      variant="secondary"
      className="flex items-center gap-1 px-3 py-2 text-sm"
    >
      {icon} {typeof val === "number" ? val.toLocaleString() : val} {label}
    </Badge>
  );
}

function UseCase({
  icon,
  h,
  p,
}: {
  icon: React.ReactNode;
  h: string;
  p: string;
}) {
  return (
    <Card className="hover:-translate-y-2 hover:shadow-xl transition">
      <CardHeader className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full border flex items-center justify-center bg-background text-primary">
          {icon}
        </div>
        <CardTitle>{h}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground text-center">{p}</p>
      </CardContent>
    </Card>
  );
}
