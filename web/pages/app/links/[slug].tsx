"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ChatDialog from "@/components/ChatDialog";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  CartesianGrid,
  Legend,
} from "recharts";
import { toast } from "sonner";
import { ChevronLeft, Loader2, Copy } from "lucide-react";

const BACKEND_URL = "https://urlvy-url-shortener-app.onrender.com";

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
      api.get<any[]>(`/stats/${slug}/daily`, { params: { days: 30 } }),
    ])
      .then(([lres, dres]) => {
        setLink(lres.data.data);
        setDaily(
          dres.data.map((d) => ({
            day: d.day.slice(5, 10),
            count: +d.count,
          })),
        );
      })
      .catch((e) => {
        console.error(e);
        toast.error("Failed to load");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // 2) Hourly
  const hourly = useMemo(() => {
    if (!link) return null;
    const cnt: Record<number, number> = {};
    for (let h = 0; h < 24; h++) cnt[h] = 0;
    link.clicks.forEach((c) => {
      cnt[new Date(c.createdAt).getHours()]++;
    });
    return Object.entries(cnt).map(([h, v]) => ({
      hour: h.padStart(2, "0") + ":00",
      count: v,
    }));
  }, [link]);

  // 3) Device
  const device = useMemo(() => {
    if (!link) return null;
    let mob = 0,
      desk = 0;
    link.clicks.forEach((c) => {
      /Mobi/.test(c.userAgent) ? mob++ : desk++;
    });
    return [
      { name: "Desktop", value: desk },
      { name: "Mobile", value: mob },
    ];
  }, [link]);

  // 4) Weekday
  const weekdays = useMemo(() => {
    if (!link) return null;
    const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const cnt: Record<number, number> = {};
    names.forEach((_, i) => (cnt[i] = 0));
    link.clicks.forEach((c) => {
      cnt[new Date(c.createdAt).getDay()]++;
    });
    return names.map((n, i) => ({ day: n, count: cnt[i] }));
  }, [link]);

  // 5) Interval histogram bins
  const hist = useMemo(() => {
    if (!link) return null;
    const times = link.clicks
      .map((c) => new Date(c.createdAt).getTime())
      .sort((a, b) => a - b);
    const intervals: number[] = [];
    for (let i = 1; i < times.length; i++) {
      intervals.push((times[i] - times[i - 1]) / 60000);
    }
    const bins: Record<string, number> = {
      "0-1m": 0,
      "1-5m": 0,
      "5-10m": 0,
      "10m+": 0,
    };
    intervals.forEach((min) => {
      if (min <= 1) bins["0-1m"]++;
      else if (min <= 5) bins["1-5m"]++;
      else if (min <= 10) bins["5-10m"]++;
      else bins["10m+"]++;
    });
    return Object.entries(bins).map(([range, count]) => ({
      range,
      count,
    }));
  }, [link]);

  // 6) Scatter of minute intervals
  const scatter = useMemo(() => {
    if (!link) return null;
    const times = link.clicks
      .map((c) => new Date(c.createdAt).getTime())
      .sort((a, b) => a - b);
    const pts: { idx: number; interval: number }[] = [];
    for (let i = 1; i < times.length; i++) {
      pts.push({
        idx: i,
        interval: Math.round(((times[i] - times[i - 1]) / 60000) * 10) / 10,
      });
    }
    return pts;
  }, [link]);

  if (loading || !link || !daily) {
    return (
      <section
        className="mx-auto max-w-3xl space-y-8 py-16 px-6"
        style={{ minWidth: "75vw" }}
      >
        <Skeleton className="h-32 rounded-xl" />
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-60 rounded-xl" />
        ))}
      </section>
    );
  }

  const COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-6)",
  ];

  const fullShortened = `${BACKEND_URL}/urls/${link.slug}`;

  return (
    <>
      <Head>
        <title>Urlvy - {link.slug} Details</title>
        <meta
          name="description"
          content={`View detailed stats for ${link.slug}`}
        />
      </Head>
      <section
        className="mx-auto max-w-3xl space-y-12 py-16 px-6"
        style={{ minWidth: "75vw" }}
      >
        {/* Link info */}
        <Card>
          <CardHeader className="flex-row justify-between items-center py-4">
            <CardTitle className="truncate text-lg leading-snug">
              {link.slug}
            </CardTitle>
            <Badge variant="outline">{link.clicks.length} clicks</Badge>
          </CardHeader>
          <CardContent className="space-y-3 pb-6">
            <p className="text-sm text-muted-foreground">
              {link.summary || "No AI summary."}
            </p>
            <a
              href={link.destination}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline break-all"
            >
              {link.destination}
            </a>
            <div className="flex items-center space-x-2 mt-4">
              <h3 className="text-sm font-semibold">Shortened Link:</h3>
              <Input
                value={fullShortened}
                readOnly
                className="flex-1 break-all"
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(fullShortened);
                  toast.success("Short link copied!");
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* 1) Daily line */}
          <ChartCard title="30-Day Trend">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daily}>
                <XAxis dataKey="day" />
                <YAxis />
                <ReTooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={COLORS[0]}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 2) Hourly bar */}
          <ChartCard title="Clicks by Hour">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourly!}>
                <XAxis dataKey="hour" />
                <YAxis />
                <ReTooltip />
                <Bar dataKey="count" fill={COLORS[1]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 3) Device pie */}
          <ChartCard title="Device Distribution">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={device!}
                  dataKey="value"
                  nameKey="name"
                  outerRadius="60%"
                  label
                >
                  {device!.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" />
                <ReTooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 4) Weekday bar */}
          <ChartCard title="By Weekday">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekdays!}>
                <XAxis dataKey="day" />
                <YAxis />
                <ReTooltip />
                <Bar dataKey="count" fill={COLORS[3]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 5) Interval histogram */}
          <ChartCard title="Inter-Click Interval Histogram">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hist!}>
                <XAxis dataKey="range" />
                <YAxis />
                <ReTooltip />
                <Bar dataKey="count" fill={COLORS[4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 6) Scatter of intervals */}
          <ChartCard title="Inter-Click Scatter">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid />
                <XAxis type="number" dataKey="idx" name="Click #" />
                <YAxis type="number" dataKey="interval" name="Minutes" />
                <ReTooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={scatter!} fill="var(--primary)" />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
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
        <div className="text-center text-sm text-muted-foreground">
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => window.history.back()}
          >
            <ChevronLeft />
            Back to Dashboard
          </Button>
        </div>
      </section>
    </>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="h-60">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-3rem)]">{children}</CardContent>
    </Card>
  );
}
