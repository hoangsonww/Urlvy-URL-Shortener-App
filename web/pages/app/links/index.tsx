"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatDialog, { ChatDialogProps } from "@/components/ChatDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import LinkCard from "@/components/LinkCard";
import { Plus, Check } from "lucide-react";
import { toast } from "sonner";
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
  Legend,
} from "recharts";
import Head from "next/head";

type Click = {
  id: string;
  ip: string;
  userAgent: string;
  createdAt: string;
};

type LinkItem = {
  id: string;
  slug: string;
  destination: string;
  summary?: string | null;
  createdAt: string;
  clicks: Click[];
};

export default function Links() {
  const [dest, setDest] = useState("");
  const [links, setLinks] = useState<LinkItem[] | null>(null);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [tab, setTab] = useState<"all" | "with-summary">("all");

  // Fetch links once
  useEffect(() => {
    api
      .get("/urls")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setLinks(data);
      })
      .catch(() => {
        toast.error("Failed to load links");
        setLinks([]);
      });
  }, []);

  // Add new
  const add = async () => {
    if (!dest.trim()) return;
    setLoadingAdd(true);
    try {
      const { data } = await api.post("/urls", { destination: dest });
      const newLink = data.data ?? data;
      setLinks((prev) => (prev ? [newLink, ...prev] : [newLink]));
      toast.success("URL shortened", { icon: <Check /> });
      setDest("");
    } catch {
      toast.error("Failed to shorten URL");
    } finally {
      setLoadingAdd(false);
    }
  };

  const filtered =
    links?.filter((l) =>
      tab === "with-summary" ? Boolean(l.summary && l.summary !== "N/A") : true,
    ) ?? null;

  // Flatten all clicks
  const allClicks = useMemo<Click[]>(
    () => (links ?? []).flatMap((l) => l.clicks),
    [links],
  );

  // 1) 30-day trend
  const dailyTrend = useMemo(() => {
    const counts: Record<string, number> = {};
    allClicks.forEach((c) => {
      const day = c.createdAt.slice(0, 10);
      counts[day] = (counts[day] || 0) + 1;
    });
    return Array.from({ length: 30 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      const key = d.toISOString().slice(0, 10);
      return { day: key.slice(5), count: counts[key] || 0 };
    });
  }, [allClicks]);

  // 2) Hourly distribution
  const hourly = useMemo(() => {
    const cnt: Record<number, number> = {};
    for (let h = 0; h < 24; h++) cnt[h] = 0;
    allClicks.forEach((c) => cnt[new Date(c.createdAt).getHours()]++);
    return Object.entries(cnt).map(([h, v]) => ({
      hour: h.padStart(2, "0") + ":00",
      count: v,
    }));
  }, [allClicks]);

  // 3) Weekday distribution
  const weekdays = useMemo(() => {
    const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const cnt: Record<number, number> = {};
    names.forEach((_, i) => (cnt[i] = 0));
    allClicks.forEach((c) => cnt[new Date(c.createdAt).getDay()]++);
    return names.map((n, i) => ({ day: n, count: cnt[i] }));
  }, [allClicks]);

  // 4) Device split
  const deviceSplit = useMemo(() => {
    let mob = 0,
      desk = 0;
    allClicks.forEach((c) => (/Mobi/.test(c.userAgent) ? mob++ : desk++));
    return [
      { name: "Desktop", value: desk },
      { name: "Mobile", value: mob },
    ];
  }, [allClicks]);

  // 5) Top 5 links
  const topLinks = useMemo(() => {
    if (!links) return [];
    return [...links]
      .sort((a, b) => b.clicks.length - a.clicks.length)
      .slice(0, 5)
      .map((l) => ({ name: l.slug, value: l.clicks.length }));
  }, [links]);

  // 6) Inter-click histogram
  const hist = useMemo(() => {
    const times = allClicks
      .map((c) => new Date(c.createdAt).getTime())
      .sort((a, b) => a - b);
    const intervals: number[] = [];
    for (let i = 1; i < times.length; i++) {
      intervals.push((times[i] - times[i - 1]) / 60000);
    }
    const bins: Record<string, number> = {
      "0–1m": 0,
      "1–5m": 0,
      "5–10m": 0,
      "10m+": 0,
    };
    intervals.forEach((min) => {
      if (min <= 1) bins["0–1m"]++;
      else if (min <= 5) bins["1–5m"]++;
      else if (min <= 10) bins["5–10m"]++;
      else bins["10m+"]++;
    });
    return Object.entries(bins).map(([range, count]) => ({ range, count }));
  }, [allClicks]);

  // Chart colors
  const COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-6)",
  ];

  const chartsReady = links !== null;

  const stats = {
    dailyTrend,
    hourly,
    weekdays,
    deviceSplit,
    topLinks,
    hist,
  };

  // build a proper ChatDialogProps.link
  const globalLink: ChatDialogProps["link"] = {
    id: "all",
    slug: "all-links",
    destination: "",
    summary: "Aggregated view of all your links",
    createdAt: new Date().toISOString(),
    clicks: allClicks.map((c) => ({
      id: c.id ?? "N/A",
      ip: c.ip ?? "0.0.0.0",
      userAgent: c.userAgent,
      createdAt: c.createdAt,
    })),
  };

  return (
    <>
      <Head>
        <title>Links - Urlvy URL Shortener</title>
        <meta
          name="description"
          content="Manage your shortened URLs and view their stats"
        />
      </Head>
      <section className="mx-auto max-w-5xl space-y-10 py-16 px-6">
        {/* Add URL */}
        <Card>
          <CardHeader>
            <CardTitle>Add a URL</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="https://example.com"
              value={dest}
              onChange={(e) => setDest(e.target.value)}
            />
            <Button
              onClick={add}
              disabled={loadingAdd}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Shorten
            </Button>
          </CardContent>
        </Card>

        {/* @ts-ignore */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="with-summary">With Summary</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <Grid links={links} />
          </TabsContent>
          <TabsContent value="with-summary">
            <Grid links={filtered} />
          </TabsContent>
        </Tabs>

        {/* Global Stats: 6 charts, 2 per row */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Global Statistics</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {/* 1) Daily trend */}
            <ChartCard title="30-Day Click Trend">
              {chartsReady ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dailyTrend}>
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
              ) : (
                <Skeleton className="h-48 w-full rounded-xl" />
              )}
            </ChartCard>

            {/* 2) Hourly distribution */}
            <ChartCard title="Clicks by Hour">
              {chartsReady ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={hourly}>
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <ReTooltip />
                    <Bar dataKey="count" fill={COLORS[1]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="h-48 w-full rounded-xl" />
              )}
            </ChartCard>

            {/* 3) Weekday distribution */}
            <ChartCard title="Clicks by Weekday">
              {chartsReady ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weekdays}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ReTooltip />
                    <Bar dataKey="count" fill={COLORS[2]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="h-48 w-full rounded-xl" />
              )}
            </ChartCard>

            {/* 4) Device split */}
            <ChartCard title="Device Split">
              {chartsReady ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={deviceSplit}
                      dataKey="value"
                      nameKey="name"
                      outerRadius="60%"
                      label
                    >
                      {deviceSplit.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" />
                    <ReTooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="h-48 w-full rounded-xl" />
              )}
            </ChartCard>

            {/* 5) Top 5 links */}
            <ChartCard title="Top 5 Most-Clicked Links">
              {chartsReady ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={topLinks}
                      dataKey="value"
                      nameKey="name"
                      outerRadius="60%"
                      label
                    >
                      {topLinks.map((_, i) => (
                        <Cell key={i} fill={COLORS[(i + 1) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" />
                    <ReTooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="h-48 w-full rounded-xl" />
              )}
            </ChartCard>

            {/* 6) Inter-click interval histogram */}
            <ChartCard title="Inter-Click Interval Histogram">
              {chartsReady ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={hist}>
                    <XAxis dataKey="range" />
                    <YAxis />
                    <ReTooltip />
                    <Bar dataKey="count" fill="var(--primary)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="h-48 w-full rounded-xl" />
              )}
            </ChartCard>
          </div>
          <section className="mt-12">
            <ChatDialog link={globalLink} stats={stats} />
          </section>
        </section>
      </section>
    </>
  );
}

function Grid({ links }: { links: LinkItem[] | null }) {
  if (links === null) {
    return (
      <div className="grid gap-6 sm:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    );
  }
  if (links.length === 0) {
    return (
      <p className="text-center text-muted-foreground">No links to show.</p>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
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
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
