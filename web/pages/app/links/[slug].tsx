"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  ArrowUpRight,
  ChevronLeft,
  Copy,
  MousePointerClick,
  Smartphone,
  TimerReset,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import ChatDialog from "@/components/ChatDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import {
  formatCompactNumber,
  formatDate,
  formatDateTime,
  getHostname,
  getShortUrl,
} from "@/lib/link-utils";

type Click = {
  id: string;
  ip: string;
  userAgent: string;
  createdAt: string;
};

type LinkDetail = {
  id: string;
  slug: string;
  destination: string;
  title?: string | null;
  summary?: string | null;
  createdAt: string;
  clicks: Click[];
};

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

const normalizeClicks = (clicks: unknown): Click[] => {
  if (!Array.isArray(clicks)) return [];
  return clicks.filter((click): click is Click =>
    Boolean(click && typeof (click as Click).createdAt === "string"),
  );
};

export default function Details() {
  const { query } = useRouter();
  const slug = Array.isArray(query.slug) ? query.slug[0] : query.slug;
  const [link, setLink] = useState<LinkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [daily, setDaily] = useState<{ day: string; count: number }[] | null>(
    null,
  );

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([
      api.get<{ data: LinkDetail }>(`/urls/${slug}/details`),
      api.get<{ day: string; count: string }[]>(`/stats/${slug}/daily`, {
        params: { days: 30 },
      }),
    ])
      .then(([linkResponse, dailyResponse]) => {
        const rawLink = linkResponse.data.data;
        const safeLink =
          rawLink && typeof rawLink === "object"
            ? {
                ...(rawLink as LinkDetail),
                clicks: normalizeClicks((rawLink as LinkDetail).clicks),
              }
            : null;

        setLink(safeLink);
        setDaily(
          dailyResponse.data.map((item) => ({
            day: item.day.slice(5, 10),
            count: Number(item.count),
          })),
        );
      })
      .catch(() => {
        toast.error("Failed to load link details");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const clicks = useMemo(() => normalizeClicks(link?.clicks), [link]);

  const hourly = useMemo(() => {
    if (!link) return [];
    const counts: Record<number, number> = {};
    for (let hour = 0; hour < 24; hour += 1) counts[hour] = 0;
    clicks.forEach((click) => {
      counts[new Date(click.createdAt).getHours()] += 1;
    });
    return Object.entries(counts).map(([hour, count]) => ({
      hour: `${hour.padStart(2, "0")}:00`,
      count,
    }));
  }, [clicks, link]);

  const device = useMemo(() => {
    if (!link) return [];
    let mobile = 0;
    let desktop = 0;
    clicks.forEach((click) => {
      if (/Mobi/i.test(click.userAgent)) mobile += 1;
      else desktop += 1;
    });
    return [
      { name: "Desktop", value: desktop },
      { name: "Mobile", value: mobile },
    ];
  }, [clicks, link]);

  const weekdays = useMemo(() => {
    if (!link) return [];
    const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts: Record<number, number> = {};
    names.forEach((_, index) => {
      counts[index] = 0;
    });
    clicks.forEach((click) => {
      counts[new Date(click.createdAt).getDay()] += 1;
    });
    return names.map((day, index) => ({ day, count: counts[index] }));
  }, [clicks, link]);

  const hist = useMemo(() => {
    if (!link) return [];
    const times = clicks
      .map((click) => new Date(click.createdAt).getTime())
      .sort((a, b) => a - b);
    const bins: Record<string, number> = {
      "0-1m": 0,
      "1-5m": 0,
      "5-10m": 0,
      "10m+": 0,
    };
    for (let index = 1; index < times.length; index += 1) {
      const minutes = (times[index] - times[index - 1]) / 60000;
      if (minutes <= 1) bins["0-1m"] += 1;
      else if (minutes <= 5) bins["1-5m"] += 1;
      else if (minutes <= 10) bins["5-10m"] += 1;
      else bins["10m+"] += 1;
    }
    return Object.entries(bins).map(([range, count]) => ({ range, count }));
  }, [clicks, link]);

  const scatter = useMemo(() => {
    if (!link) return [];
    const times = clicks
      .map((click) => new Date(click.createdAt).getTime())
      .sort((a, b) => a - b);
    const points: { idx: number; interval: number }[] = [];
    for (let index = 1; index < times.length; index += 1) {
      points.push({
        idx: index,
        interval:
          Math.round(((times[index] - times[index - 1]) / 60000) * 10) / 10,
      });
    }
    return points;
  }, [clicks, link]);

  const recentClicks = useMemo(
    () =>
      [...clicks]
        .sort(
          (left, right) =>
            new Date(right.createdAt).getTime() -
            new Date(left.createdAt).getTime(),
        )
        .slice(0, 8),
    [clicks],
  );

  if (loading || !link || !daily) {
    return (
      <section className="page-shell page-section space-y-6">
        <Skeleton className="h-14 w-40 rounded-full" />
        <Skeleton className="h-72 rounded-[1.75rem]" />
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-80 rounded-[1.5rem]" />
          ))}
        </div>
      </section>
    );
  }

  const shortUrl = getShortUrl(link.slug);
  const totalClicks = clicks.length;
  const mobileShare = device[1]?.value
    ? Math.round((device[1].value / Math.max(totalClicks, 1)) * 100)
    : 0;
  const recent30DayClicks = daily.reduce((sum, item) => sum + item.count, 0);
  const peakDay = [...daily].sort((a, b) => b.count - a.count)[0];
  const topHour = [...hourly].sort((a, b) => b.count - a.count)[0];

  return (
    <>
      <Head>
        <title>Urlvy - {link.slug} Details</title>
        <meta
          name="description"
          content={`View detailed stats for ${link.slug}`}
        />
      </Head>

      <section className="page-shell page-section space-y-8">
        <Link
          href="/app/links"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="hero-grid">
          <Card className="border-border/70 bg-card/94 py-0">
            <CardHeader className="gap-4 border-b border-border/70 pb-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    {getHostname(link.destination)}
                  </Badge>
                  <div className="space-y-2">
                    <CardTitle className="text-3xl font-semibold tracking-tight">
                      {link.slug}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Created {formatDate(link.createdAt)}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  {formatCompactNumber(totalClicks)} clicks
                </Badge>
              </div>

              <div className="surface-muted px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Shortened URL
                </p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <Input value={shortUrl} readOnly className="flex-1" />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(shortUrl);
                        toast.success("Short link copied");
                      }}
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                    <Button asChild>
                      <a
                        href={link.destination}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                        Open destination
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              <div className="surface-muted px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Destination
                </p>
                <a
                  href={link.destination}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block break-all text-sm font-medium text-primary hover:text-primary/80"
                >
                  {link.destination}
                </a>
              </div>

              <div className="surface-muted px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  AI summary
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {link.summary ||
                    "No AI summary has been generated for this link yet."}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <DetailStat
              icon={<MousePointerClick className="h-4 w-4 text-primary" />}
              label="Total clicks"
              value={formatCompactNumber(totalClicks)}
              helper="All recorded traffic for this slug."
            />
            <DetailStat
              icon={<TrendingUp className="h-4 w-4 text-primary" />}
              label="30-day activity"
              value={formatCompactNumber(recent30DayClicks)}
              helper={
                peakDay
                  ? `Peak day ${peakDay.day} with ${peakDay.count} clicks.`
                  : "No recent activity."
              }
            />
            <DetailStat
              icon={<Smartphone className="h-4 w-4 text-primary" />}
              label="Mobile share"
              value={`${mobileShare}%`}
              helper="Based on detected user agent patterns."
            />
            <DetailStat
              icon={<TimerReset className="h-4 w-4 text-primary" />}
              label="Peak hour"
              value={topHour?.hour ?? "No data"}
              helper="Most active hour across recorded clicks."
            />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <ChartCard
            title="30-day trend"
            description="Measure momentum and see whether interest is accelerating or flattening."
          >
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={daily}>
                <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <ReTooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={COLORS[0]}
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Clicks by hour"
            description="Understand the daily rhythm of this audience."
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={hourly}>
                <XAxis dataKey="hour" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <ReTooltip />
                <Bar dataKey="count" fill={COLORS[1]} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Device distribution"
            description="Check whether this link is being consumed more on desktop or mobile."
          >
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={device}
                  dataKey="value"
                  nameKey="name"
                  outerRadius="72%"
                  label
                >
                  {device.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" />
                <ReTooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="By weekday"
            description="See which days consistently carry performance."
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weekdays}>
                <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <ReTooltip />
                <Bar dataKey="count" fill={COLORS[3]} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Inter-click timing"
            description="Review how tightly user activity clusters from one click to the next."
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={hist}>
                <XAxis dataKey="range" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <ReTooltip />
                <Bar dataKey="count" fill={COLORS[4]} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Interval scatter"
            description="Spot bursts and outliers in the spacing between clicks."
          >
            <ResponsiveContainer width="100%" height={260}>
              <ScatterChart>
                <CartesianGrid stroke="var(--border)" />
                <XAxis
                  type="number"
                  dataKey="idx"
                  name="Click #"
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  type="number"
                  dataKey="interval"
                  name="Minutes"
                  stroke="var(--muted-foreground)"
                />
                <ReTooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={scatter} fill={COLORS[5]} />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <ChatDialog
            link={link}
            stats={{
              "30-Day Trend": daily,
              "Hourly Distribution": hourly,
              "Device Split": device,
              "Weekday Distribution": weekdays,
              "Interval Histogram": hist,
              "Scatter Intervals": scatter,
            }}
          />

          <Card className="border-border/70 bg-card/94 py-0">
            <CardHeader className="border-b border-border/70 pb-5">
              <CardTitle className="text-xl">Recent click activity</CardTitle>
              <p className="text-sm text-muted-foreground">
                The latest events help validate freshness, timing, and device
                mix.
              </p>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {recentClicks.length ? (
                recentClicks.map((click) => (
                  <div
                    key={click.id}
                    className="surface-muted flex items-start justify-between gap-4 px-4 py-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {formatDateTime(click.createdAt)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {click.ip || "Unknown IP"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {/Mobi/i.test(click.userAgent) ? "Mobile" : "Desktop"}
                      </p>
                      <p className="mt-1 max-w-48 truncate text-xs text-muted-foreground">
                        {click.userAgent || "Unknown agent"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="surface-muted px-4 py-6 text-sm text-muted-foreground">
                  No click activity recorded yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

function DetailStat({
  icon,
  label,
  value,
  helper,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <Card className="border-border/70 bg-card/94 py-0">
      <CardContent className="space-y-3 pt-6">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          {icon}
          {label}
        </div>
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className="border-border/70 bg-card/94 py-0">
      <CardHeader className="border-b border-border/70 pb-5">
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}
