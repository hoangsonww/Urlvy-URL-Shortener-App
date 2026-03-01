"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  LineChart,
  Users,
  Database,
  Gauge,
  Timer,
  Lock,
  Shield,
  Server,
  Briefcase,
  FileText,
  Sparkles,
  ChevronDown,
  Table2Icon as Table,
} from "lucide-react";

function useCountUp(target: number, duration = 1400) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let started = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setVal(Math.floor(p * target));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);

  return { ref, val };
}

const rotate = ["reach", "links", "insight", "content", "product", "traffic"];

const features = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "1-Click shortening",
    desc: "Drop a URL & get a branded slug instantly with smart suggestions.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Enterprise-grade security",
    desc: "MFA-ready, RBAC, and tamper-evident audit trails.",
  },
  {
    icon: <BarChart2 className="h-6 w-6" />,
    title: "Real-time analytics",
    desc: "Live dashboards update the moment a click lands.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Auto-expiry & TTL",
    desc: "Set lifetimes per campaign or per link with overrides.",
  },
  {
    icon: <RefreshCcw className="h-6 w-6" />,
    title: "AI summaries",
    desc: "Auto-generated previews and tags keep links consistent.",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Global visibility",
    desc: "See who clicked, where they are, and when they engaged.",
  },
  {
    icon: <LineChart className="h-6 w-6" />,
    title: "Attribution insights",
    desc: "Multi-touch attribution for social, email, and paid channels.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Team workspaces",
    desc: "Approval workflows and shared dashboards for every team.",
  },
  {
    icon: <Database className="h-6 w-6" />,
    title: "Exports & webhooks",
    desc: "Stream events to your data lake or BI tools.",
  },
];

const howSteps = [
  {
    icon: <Link2 />,
    t: "Paste any link",
    d: "Auto-suggested slugs, tags, and branded domains.",
  },
  {
    icon: <Cpu />,
    t: "AI enriches it",
    d: "Title, summary, and intent labels generated instantly.",
  },
  {
    icon: <TrendingUp />,
    t: "Share & optimize",
    d: "Live performance data powers quick iterations.",
  },
];

const integrations = [
  { icon: <Slack size={26} />, label: "Slack" },
  { icon: <Cloud size={26} />, label: "Zapier" },
  { icon: <GitBranch size={26} />, label: "GitHub" },
  { icon: <PieChart size={26} />, label: "Google Analytics" },
  { icon: <ZapOff size={26} />, label: "Segment" },
];

const metrics = [
  {
    value: 148_000,
    suffix: "+",
    label: "Monthly redirects processed",
    detail: "Across campaigns, docs, and product flows.",
  },
  {
    value: 230_000,
    suffix: "+",
    label: "Unique visitors tracked",
    detail: "Deduplicated across domains and workspaces.",
  },
  {
    value: 28_400,
    suffix: "+",
    label: "Teams onboarded",
    detail: "Marketing, product, and engineering orgs.",
  },
  {
    value: 1_250,
    suffix: "+",
    label: "Custom domains managed",
    detail: "SSL-ready with automated verification.",
  },
  {
    value: 86,
    suffix: "ms",
    label: "Median redirect time",
    detail: "Global edge delivery with cached routing.",
  },
  {
    value: 41,
    suffix: "%",
    label: "Bot traffic filtered",
    detail: "Noise removed from reporting insights.",
  },
  {
    value: 9999,
    suffix: "%",
    label: "Uptime target",
    detail: "Measured over trailing 12 months.",
    format: (v: number) => (v / 100).toFixed(2),
  },
  {
    value: 72,
    suffix: "mo",
    label: "Data retention",
    detail: "Configurable storage for long-term trends.",
  },
];

const playbooks = [
  {
    icon: <Rocket className="h-5 w-5" />,
    title: "Product launch kit",
    desc: "Bundle release notes, demos, and pricing in one branded hub.",
    stat: "42% higher CTR",
    tags: ["Launch", "UTM", "Teams"],
  },
  {
    icon: <Briefcase className="h-5 w-5" />,
    title: "Sales enablement",
    desc: "Create short links for decks, case studies, and follow-ups.",
    stat: "31% faster deal cycles",
    tags: ["Sales", "CRM", "Docs"],
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: "Content syndication",
    desc: "Track who picks up your thought-leadership and where it lands.",
    stat: "18 sources tracked",
    tags: ["Media", "PR", "SEO"],
  },
  {
    icon: <PieChart className="h-5 w-5" />,
    title: "Campaign attribution",
    desc: "Attribute conversions across paid, organic, and social touchpoints.",
    stat: "6-channel clarity",
    tags: ["Paid", "Social", "Email"],
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: "Global rollouts",
    desc: "Geo-aware redirects and localized slugs for regional teams.",
    stat: "120+ locales",
    tags: ["Global", "Region", "Geo"],
  },
  {
    icon: <Layers className="h-5 w-5" />,
    title: "Product adoption",
    desc: "Guide users to tutorials, feature tips, and in-app updates.",
    stat: "23% uplift",
    tags: ["Product", "Onboarding", "CX"],
  },
];

const insightModules = [
  {
    icon: <LineChart className="h-5 w-5" />,
    title: "Attribution modeling",
    desc: "Multi-touch attribution with channel weighting and decay.",
    stat: "18-channel mix",
  },
  {
    icon: <Gauge className="h-5 w-5" />,
    title: "Performance scoring",
    desc: "Automated quality scoring to surface high-performing links.",
    stat: "Top 5% surfaced",
  },
  {
    icon: <Timer className="h-5 w-5" />,
    title: "Engagement timelines",
    desc: "Minute-by-minute click streams and campaign heatmaps.",
    stat: "Real-time feed",
  },
  {
    icon: <Server className="h-5 w-5" />,
    title: "Edge routing",
    desc: "Global routing rules with instant propagation and rollback.",
    stat: "60s deploys",
  },
];

const securityPillars = [
  {
    icon: <Lock className="h-5 w-5" />,
    title: "SSO-ready access",
    desc: "SAML, SCIM, MFA, and role-based governance.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Auditability",
    desc: "Every change logged with time, actor, and provenance.",
  },
  {
    icon: <Server className="h-5 w-5" />,
    title: "Residency options",
    desc: "Route data to US or EU regions with policy controls.",
  },
  {
    icon: <Database className="h-5 w-5" />,
    title: "Retention controls",
    desc: "Configurable TTL, exports, and archive policies.",
  },
];

const testimonials = [
  [
    "Urlvy boosted our newsletter CTR by 64%. The live dashboard is pure gold.",
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
  [
    "How long do you retain analytics data?",
    "Retention is configurable per workspace, with export options for long-term storage.",
  ],
  [
    "Do you support team approvals?",
    "Yes. Roles, approval flows, and audit trails are built in.",
  ],
];

const revealStyle = (delay = 0) =>
  ({ "--delay": `${delay}ms` }) as React.CSSProperties;

//  page
export default function Landing() {
  // rotate word in hero
  const [w, setW] = useState(0);
  const wordRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [wordWidth, setWordWidth] = useState<number | null>(null);
  useEffect(() => {
    const id = setInterval(() => setW((i) => (i + 1) % rotate.length), 2300);
    return () => clearInterval(id);
  }, []);
  useLayoutEffect(() => {
    const el = measureRef.current ?? wordRef.current;
    if (!el) return;
    const { width } = el.getBoundingClientRect();
    if (width) setWordWidth(width);
  }, [w]);

  useLayoutEffect(() => {
    const root =
      document.querySelector<HTMLElement>("[data-reveal-root]") ??
      document.body;
    const revealTargets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]"),
    ).filter((el) => !el.classList.contains("reveal-ignore"));
    if (!revealTargets.length) return;

    const reveal = (el: Element) => {
      el.classList.add("reveal-in");
      el.classList.remove("reveal-pending");
    };

    revealTargets.forEach((el) => el.classList.add("reveal-pending"));

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      requestAnimationFrame(() => {
        revealTargets.forEach((el) => reveal(el));
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );

    requestAnimationFrame(() => {
      revealTargets.forEach((el) => observer.observe(el));
    });

    return () => {
      observer.disconnect();
    };
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

      <main data-reveal-root>
        {/* HERO  */}
        <section className="relative flex flex-col items-center justify-center text-center min-h-[calc(100dvh-4rem)] px-4 sm:px-6 py-16 sm:py-20 overflow-hidden">
          {/* animated BG */}
          <div className="absolute inset-0 -z-10 bg-[length:300%_300%] bg-gradient-to-br from-primary via-secondary to-accent animate-gradient" />
          <div className="absolute -top-24 right-[-10%] h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-float" />
          <div className="absolute -bottom-20 left-[-5%] h-72 w-72 rounded-full bg-secondary/40 blur-3xl animate-float-delayed" />

          <Badge
            variant="secondary"
            className="text-xs uppercase tracking-wide text-center max-w-[90vw] whitespace-normal"
            data-reveal
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Built for modern growth teams
          </Badge>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight max-w-4xl mt-6"
            data-reveal
            style={revealStyle(80)}
          >
            Super-charge your&nbsp;
            <span className="relative inline-block align-baseline">
              <span
                ref={wordRef}
                className="inline-block transition-[width] duration-300 force-primary !text-[#21b073]"
                style={{
                  width: wordWidth ? `${wordWidth}px` : "auto",
                  color: "#21b073",
                  WebkitTextFillColor: "#21b073",
                }}
                aria-live="polite"
              >
                {rotate[w]}
              </span>
              <span
                ref={measureRef}
                className="absolute left-0 top-0 opacity-0 pointer-events-none whitespace-nowrap reveal-ignore"
                aria-hidden="true"
              >
                {rotate[w]}
              </span>
            </span>
            &nbsp;with smarter links
          </h1>

          <p
            className="max-w-2xl mx-auto mt-6 text-muted-foreground text-sm sm:text-base"
            data-reveal
            style={revealStyle(140)}
          >
            Urlvy turns unwieldy URLs into memorable slugs, adds AI-powered
            previews, and tells you exactly who clicked — in real time.
          </p>

          <div
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center"
            data-reveal
            style={revealStyle(200)}
          >
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/app/links">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View dashboard
                <Table className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mt-10 sm:mt-14 text-sm">
            <Counter
              icon={<Link2 className="h-4 w-4" />}
              val={lk.val}
              countRef={lk.ref}
              label="Links created"
              delay={260}
            />
            <Counter
              icon={<Star className="h-4 w-4 text-yellow-400" />}
              val="4.9★"
              label="User rating"
              delay={320}
            />
            <Counter
              icon={<Globe className="h-4 w-4" />}
              val={ct.val}
              countRef={ct.ref}
              label="Countries"
              delay={380}
            />
            <Counter
              icon={<Users className="h-4 w-4" />}
              val={us.val}
              countRef={us.ref}
              label="Teams"
              delay={440}
            />
          </div>

          <button
            type="button"
            onClick={() =>
              document.getElementById("impact")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm font-medium text-muted-foreground hover:text-primary transition cursor-pointer flex items-center gap-2"
            data-reveal
            style={revealStyle(520)}
          >
            Learn more <ChevronDown className="h-4 w-4" />
          </button>
        </section>

        {/* METRICS */}
        <Section
          id="impact"
          kicker="Impact"
          title="Proof in numbers"
          subtitle="See the scale behind every short link, with performance metrics you can trust."
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((stat, i) => (
              <StatTile key={stat.label} {...stat} delay={i * 80} />
            ))}
          </div>
        </Section>

        {/* FEATURES GRID  */}
        <Section
          id="features"
          kicker="Platform"
          title="Everything you need to win clicks"
          subtitle="A single workspace to shorten, brand, measure, and optimize — without extra scripts."
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <Card
                key={f.title}
                className="group hover:shadow-xl transition"
                data-reveal
                data-reveal-parent
                style={revealStyle(i * 70)}
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
        <section className="bg-muted/5 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <img
              src="/demo.png"
              alt="Realtime dashboard mock"
              className="w-full rounded-xl border shadow-md"
              data-reveal
            />
            <div className="space-y-6">
              <Badge variant="secondary" className="text-xs" data-reveal>
                DASHBOARD
              </Badge>
              <h2
                className="text-2xl sm:text-3xl font-bold"
                data-reveal
                style={revealStyle(80)}
              >
                Live insights, no setup script
              </h2>
              <p
                className="text-muted-foreground"
                data-reveal
                style={revealStyle(140)}
              >
                Traditional analytics tools need code snippets. Urlvy starts
                capturing data the moment you shorten — zero integration
                required.
              </p>
              <ul className="space-y-3 text-sm">
                {[
                  "Live charts & dashboards",
                  "UTM source / medium breakout",
                  "Precise click tracking with no cookies",
                  "Link health monitoring and status checks",
                ].map((item, i) => (
                  <li
                    key={item}
                    className="flex items-center gap-2"
                    data-reveal
                    style={revealStyle(200 + i * 60)}
                  >
                    <Check className="h-4 w-4 text-primary" /> {item}
                  </li>
                ))}
              </ul>
              <div data-reveal style={revealStyle(420)}>
                <Button variant="outline" className="w-full sm:w-auto">
                  View demo report
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS  */}
        <Section
          kicker="Workflow"
          title="Three simple steps"
          subtitle="Launch smarter links in minutes and keep every campaign aligned."
        >
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {howSteps.map((s, i) => (
              <div
                key={s.t}
                className="flex flex-col items-center gap-4"
                data-reveal
                style={revealStyle(i * 90)}
              >
                <div className="w-16 h-16 rounded-full border flex items-center justify-center bg-background text-primary">
                  {s.icon}
                </div>
                <p className="font-semibold">{s.t}</p>
                <span className="text-muted-foreground text-xs">{s.d}</span>
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Step {i + 1}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* CAROUSEL: PLAYBOOKS */}
        <Section
          kicker="Playbooks"
          title="Ready-made growth workflows"
          subtitle="Swipe through proven setups that teams copy and customize in minutes."
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {playbooks.map((p, i) => (
              <Card
                key={p.title}
                className="w-full hover:shadow-xl transition"
                data-reveal
                data-reveal-parent
                style={revealStyle(i * 80)}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-center gap-2 text-primary">
                    {p.icon}
                    <CardTitle className="text-lg">{p.title}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold text-primary">
                    {p.stat}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[11px]"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        {/* INTEGRATIONS */}
        <Section
          kicker="Integrations"
          title="Plays nice with your stack"
          subtitle="Connect analytics, messaging, and pipelines without custom code."
        >
          <div className="flex flex-wrap justify-center gap-12">
            {integrations.map((i, idx) => (
              <div
                key={i.label}
                className="flex flex-col items-center gap-2"
                data-reveal
                style={revealStyle(idx * 70)}
              >
                {i.icon}
                <span className="text-xs text-muted-foreground">{i.label}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* CAROUSEL: INSIGHTS */}
        <Section
          id="analytics"
          kicker="Analytics"
          title="Insight modules that stay in sync"
          subtitle="The metrics you need, presented as focused modules that scale with your team."
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {insightModules.map((p, i) => (
              <Card
                key={p.title}
                className="w-full hover:shadow-xl transition"
                data-reveal
                data-reveal-parent
                style={revealStyle(i * 80)}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-center gap-2 text-primary">
                    {p.icon}
                    <CardTitle className="text-lg">{p.title}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold text-primary">
                    {p.stat}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        {/* USE-CASES */}
        <Section
          kicker="Teams"
          title="Who is Urlvy for?"
          subtitle="Purpose-built for high-velocity teams that live inside links."
        >
          <div className="grid lg:grid-cols-3 gap-8">
            <UseCase
              icon={<Rocket className="h-6 w-6" />}
              h="Marketers"
              p="Boost CTR & attribute every click with clean campaign data."
              d="Campaign calendars, UTM governance, and share-ready reporting."
              delay={0}
            />
            <UseCase
              icon={<Layers className="h-6 w-6" />}
              h="Product Teams"
              p="Ship releases with concise, trusted links and health checks."
              d="Release hubs, changelog tracking, and adoption flows."
              delay={90}
            />
            <UseCase
              icon={<Cpu className="h-6 w-6" />}
              h="Developers"
              p="Instrument link events with APIs, webhooks, and exports."
              d="Granular permissions, audit logs, and edge routing rules."
              delay={180}
            />
          </div>
        </Section>

        {/* SECURITY */}
        <Section
          id="security"
          kicker="Security"
          title="Governance built for enterprise"
          subtitle="Professional-grade controls that keep every team aligned and compliant."
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityPillars.map((pillar, i) => (
              <Card
                key={pillar.title}
                className="hover:shadow-xl transition"
                data-reveal
                data-reveal-parent
                style={revealStyle(i * 70)}
              >
                <CardHeader className="space-y-3">
                  <div className="w-10 h-10 rounded-full border flex items-center justify-center bg-background text-primary">
                    {pillar.icon}
                  </div>
                  <CardTitle className="text-base">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{pillar.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        {/* TESTIMONIALS */}
        <section className="bg-muted/5 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-10 sm:space-y-12">
            <div
              className="text-center space-y-4"
              data-reveal
              data-reveal-parent
            >
              <Badge variant="secondary" className="text-xs">
                CUSTOMER VOICES
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold">What users say</h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Teams rely on Urlvy for reliable attribution, fast execution,
                and confident reporting.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map(([msg, name, role], i) => (
                <Card
                  key={name}
                  className="hover:shadow-lg transition"
                  data-reveal
                  data-reveal-parent
                  style={revealStyle(i * 80)}
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
        {/*<Section*/}
        {/*  kicker="Pricing"*/}
        {/*  title="Simple, scalable pricing"*/}
        {/*  subtitle="Start free and upgrade only when your growth demands it."*/}
        {/*>*/}
        {/*  <div className="grid md:grid-cols-3 gap-8">*/}
        {/*    {[*/}
        {/*      {*/}
        {/*        tier: "Free",*/}
        {/*        price: "Free forever",*/}
        {/*        desc: "For personal projects and early-stage teams.",*/}
        {/*      },*/}
        {/*      {*/}
        {/*        tier: "Pro",*/}
        {/*        price: "$9/month",*/}
        {/*        desc: "For fast-moving teams who need attribution and controls.",*/}
        {/*      },*/}
        {/*      {*/}
        {/*        tier: "Enterprise",*/}
        {/*        price: "Contact us",*/}
        {/*        desc: "For regulated orgs with advanced security needs.",*/}
        {/*      },*/}
        {/*    ].map((plan, i) => (*/}
        {/*      <Card*/}
        {/*        key={plan.tier}*/}
        {/*        className="flex flex-col hover:shadow-lg transition"*/}
        {/*        data-reveal*/}
        {/*        style={revealStyle(i * 80)}*/}
        {/*      >*/}
        {/*        <CardHeader className="space-y-2">*/}
        {/*          <CardTitle>{plan.tier}</CardTitle>*/}
        {/*          <p className="text-sm text-muted-foreground">{plan.desc}</p>*/}
        {/*        </CardHeader>*/}
        {/*        <CardContent className="space-y-4 flex-1">*/}
        {/*          <h3 className="text-4xl font-bold text-primary">*/}
        {/*            {plan.price}*/}
        {/*          </h3>*/}
        {/*          <ul className="space-y-2 text-sm">*/}
        {/*            <li className="flex gap-2 items-center">*/}
        {/*              <Check size={14} className="text-primary" /> Unlimited links*/}
        {/*            </li>*/}
        {/*            <li className="flex gap-2 items-center">*/}
        {/*              <Check size={14} className="text-primary" /> Real-time*/}
        {/*              analytics*/}
        {/*            </li>*/}
        {/*            <li className="flex gap-2 items-center">*/}
        {/*              <Check size={14} className="text-primary" /> AI summaries*/}
        {/*            </li>*/}
        {/*            {plan.tier !== "Free" && (*/}
        {/*              <li className="flex gap-2 items-center">*/}
        {/*                <Check size={14} className="text-primary" /> Team*/}
        {/*                workspaces*/}
        {/*              </li>*/}
        {/*            )}*/}
        {/*            {plan.tier === "Enterprise" && (*/}
        {/*              <li className="flex gap-2 items-center">*/}
        {/*                <Check size={14} className="text-primary" /> SSO & SLA*/}
        {/*              </li>*/}
        {/*            )}*/}
        {/*          </ul>*/}
        {/*          <Button disabled>Join wait-list</Button>*/}
        {/*        </CardContent>*/}
        {/*      </Card>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*</Section>*/}

        {/* FAQ */}
        <Section
          kicker="FAQ"
          title="Frequently asked"
          subtitle="Short answers to the most common questions about Urlvy."
        >
          <Accordion type="single" collapsible defaultValue="faq-0">
            {faq.map(([q, a], i) => (
              <AccordionItem
                key={q}
                value={`faq-${i}`}
                className="border-b"
                data-reveal
                data-reveal-parent
                style={revealStyle(i * 60)}
              >
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
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold" data-reveal>
              Shrink. Share. Track.
            </h2>
            <p
              className="text-muted-foreground text-sm sm:text-base"
              data-reveal
            >
              Hit &ldquo;Start free&rdquo; and create your first smart link in
              under five seconds.
            </p>
            <Link href="/auth/register" data-reveal>
              <Button size="lg" className="w-full sm:w-auto">
                Start free
              </Button>
            </Link>
            <Link
              href="https://urlvy-url-shortener-app.onrender.com/docs"
              target="_blank"
            >
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                API Docs
              </Button>
            </Link>
            <p
              className="mx-auto max-w-2xl text-xs leading-6 text-muted-foreground mt-6"
              data-reveal
            >
              Review our{" "}
              <Link
                href="/terms"
                className="font-medium text-foreground hover:text-primary"
              >
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-foreground hover:text-primary"
              >
                Privacy Policy
              </Link>{" "}
              before using the platform.
            </p>
          </div>
        </section>
      </main>

      {/* gradient keyframes */}
      <style jsx global>{`
        @keyframes gradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes floatSoft {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -8px, 0);
          }
        }
        .animate-gradient {
          animation: gradientShift 28s linear infinite;
        }
        .animate-float {
          animation: floatSoft 18s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: floatSoft 22s ease-in-out infinite;
          animation-delay: -4s;
        }
        [data-reveal-root] .reveal-pending {
          opacity: 0;
          transform: translateY(8px);
          transition:
            opacity 0.45s ease,
            transform 0.45s ease;
          transition-delay: var(--delay, 0ms);
          will-change: opacity, transform;
        }
        [data-reveal-root] .reveal-in {
          opacity: 1;
          transform: translateY(0);
          transition:
            opacity 0.45s ease,
            transform 0.45s ease;
          transition-delay: var(--delay, 0ms);
        }
        @media (prefers-reduced-motion: reduce) {
          [data-reveal-root] .reveal-pending {
            opacity: 1;
            transform: none;
            transition: none;
          }
          .animate-gradient,
          .animate-float,
          .animate-float-delayed {
            animation: none;
          }
        }
        .hero-rotate-word {
          color: var(--primary-fallback) !important;
          -webkit-text-fill-color: var(--primary-fallback) !important;
        }
      `}</style>
    </>
  );
}

//  reusable section wrapper
function Section({
  id,
  kicker,
  title,
  subtitle,
  children,
}: {
  id?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 space-y-10 sm:space-y-12"
    >
      <div className="space-y-4 text-center" data-reveal data-reveal-parent>
        {kicker && (
          <Badge
            variant="secondary"
            className="text-xs uppercase tracking-wide text-center max-w-[90vw] whitespace-normal"
          >
            {kicker}
          </Badge>
        )}
        <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground max-w-3xl mx-auto text-sm sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

//  tiny pieces
function Counter({
  icon,
  val,
  label,
  countRef,
  delay,
}: {
  icon: React.ReactNode;
  val: number | string;
  label: string;
  countRef?: React.Ref<HTMLSpanElement>;
  delay?: number;
}) {
  return (
    <Badge
      variant="secondary"
      className="flex items-center gap-1 px-3 py-2 text-sm"
      data-reveal
      style={revealStyle(delay)}
    >
      {icon}
      {typeof val === "number" ? (
        <span ref={countRef}>{val.toLocaleString()}</span>
      ) : (
        val
      )}
      <span>{label}</span>
    </Badge>
  );
}

function StatTile({
  value,
  suffix,
  label,
  detail,
  delay,
  format,
}: {
  value: number;
  suffix?: string;
  label: string;
  detail: string;
  delay?: number;
  format?: (value: number) => string;
}) {
  const count = useCountUp(value, 1600);
  const display = format ? format(count.val) : count.val.toLocaleString();
  return (
    <Card
      className="p-6 hover:shadow-xl transition"
      data-reveal
      data-reveal-parent
      style={revealStyle(delay)}
    >
      <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
        <span ref={count.ref}>{display}</span>
        {suffix && <span className="text-primary">{suffix}</span>}
      </div>
      <p className="mt-3 text-sm font-semibold">{label}</p>
      <p className="text-xs text-muted-foreground mt-2">{detail}</p>
    </Card>
  );
}

function UseCase({
  icon,
  h,
  p,
  d,
  delay,
}: {
  icon: React.ReactNode;
  h: string;
  p: string;
  d: string;
  delay: number;
}) {
  return (
    <Card
      className="hover:shadow-xl transition"
      data-reveal
      data-reveal-parent
      style={revealStyle(delay)}
    >
      <CardHeader className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full border flex items-center justify-center bg-background text-primary">
          {icon}
        </div>
        <CardTitle>{h}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground text-center">{p}</p>
        <p className="text-xs text-muted-foreground text-center">{d}</p>
      </CardContent>
    </Card>
  );
}
