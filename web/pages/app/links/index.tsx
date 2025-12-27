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

type CreatedRange = "all" | "7d" | "30d" | "90d" | "365d";
type SortBy =
  | "created-desc"
  | "created-asc"
  | "clicks-desc"
  | "clicks-asc"
  | "slug-asc"
  | "slug-desc";

const normalizeClicks = (clicks: unknown): Click[] => {
  if (!Array.isArray(clicks)) return [];
  return clicks.filter((click): click is Click =>
    Boolean(click && typeof (click as Click).createdAt === "string"),
  );
};

const normalizeLink = (link: unknown): LinkItem | null => {
  if (!link || typeof link !== "object") return null;
  return {
    ...(link as LinkItem),
    clicks: normalizeClicks((link as any).clicks),
  };
};

const normalizeLinks = (data: unknown): LinkItem[] => {
  if (!Array.isArray(data)) return [];
  return data
    .map((link) => normalizeLink(link))
    .filter((link): link is LinkItem => Boolean(link));
};

const selectClassName =
  "border-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

const createdRangeDays: Record<CreatedRange, number> = {
  all: 0,
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "365d": 365,
};

export default function Links() {
  const [dest, setDest] = useState("");
  const [links, setLinks] = useState<LinkItem[] | null>(null);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [tab, setTab] = useState<"all" | "with-summary">("all");
  const [query, setQuery] = useState("");
  const [createdRange, setCreatedRange] = useState<CreatedRange>("all");
  const [sortBy, setSortBy] = useState<SortBy>("created-desc");
  const [minClicks, setMinClicks] = useState("");
  const [maxClicks, setMaxClicks] = useState("");

  // Fetch links once
  useEffect(() => {
    api
      .get("/urls")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setLinks(normalizeLinks(data));
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
      const normalizedLink = normalizeLink(newLink);
      if (!normalizedLink) {
        throw new Error("Invalid link payload");
      }
      setLinks((prev) => (prev ? [normalizedLink, ...prev] : [normalizedLink]));
      toast.success("URL shortened", { icon: <Check /> });
      setDest("");
    } catch {
      toast.error("Failed to shorten URL");
    } finally {
      setLoadingAdd(false);
    }
  };

  const filteredBase = useMemo(() => {
    if (!links) return null;
    const trimmedQuery = query.trim().toLowerCase();
    const minClicksValue = minClicks.trim() ? Number(minClicks) : null;
    const maxClicksValue = maxClicks.trim() ? Number(maxClicks) : null;
    const hasMinClicks =
      minClicksValue !== null && Number.isFinite(minClicksValue);
    const hasMaxClicks =
      maxClicksValue !== null && Number.isFinite(maxClicksValue);
    const cutoff =
      createdRange === "all"
        ? null
        : (() => {
            const days = createdRangeDays[createdRange];
            const date = new Date();
            date.setDate(date.getDate() - days);
            return date;
          })();

    const filtered = links.filter((link) => {
      const clickCount = Array.isArray(link.clicks) ? link.clicks.length : 0;
      if (!trimmedQuery && !cutoff && !hasMinClicks && !hasMaxClicks)
        return true;
      if (trimmedQuery) {
        const haystack = [link.slug, link.destination, link.summary ?? ""]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(trimmedQuery)) return false;
      }
      if (hasMinClicks && clickCount < minClicksValue!) return false;
      if (hasMaxClicks && clickCount > maxClicksValue!) return false;
      if (cutoff) {
        const createdTime = Date.parse(link.createdAt);
        if (!Number.isFinite(createdTime)) return false;
        if (createdTime < cutoff.getTime()) return false;
      }
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const aClicks = Array.isArray(a.clicks) ? a.clicks.length : 0;
      const bClicks = Array.isArray(b.clicks) ? b.clicks.length : 0;
      const aTime = Date.parse(a.createdAt) || 0;
      const bTime = Date.parse(b.createdAt) || 0;

      switch (sortBy) {
        case "clicks-asc":
          return aClicks - bClicks;
        case "clicks-desc":
          return bClicks - aClicks;
        case "created-asc":
          return aTime - bTime;
        case "created-desc":
          return bTime - aTime;
        case "slug-desc":
          return b.slug.localeCompare(a.slug);
        case "slug-asc":
        default:
          return a.slug.localeCompare(b.slug);
      }
    });

    return sorted;
  }, [links, query, createdRange, sortBy, minClicks, maxClicks]);

  const filteredSummary = useMemo(
    () =>
      filteredBase?.filter((l) => Boolean(l.summary && l.summary !== "N/A")) ??
      null,
    [filteredBase],
  );

  // Flatten all clicks
  const allClicks = useMemo<Click[]>(
    () => (links ?? []).flatMap((l) => normalizeClicks(l?.clicks)),
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

        {/* Filters & sorting */}
        <Card>
          <CardHeader>
            <CardTitle>Filter & Sort</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              placeholder="Search slug, destination, summary"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className={selectClassName}
              value={createdRange}
              onChange={(e) => setCreatedRange(e.target.value as CreatedRange)}
            >
              <option value="all">All time</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="365d">Last 12 months</option>
            </select>
            <Input
              type="number"
              min="0"
              placeholder="Min clicks"
              value={minClicks}
              onChange={(e) => setMinClicks(e.target.value)}
            />
            <Input
              type="number"
              min="0"
              placeholder="Max clicks"
              value={maxClicks}
              onChange={(e) => setMaxClicks(e.target.value)}
            />
            <select
              className={selectClassName}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
            >
              <option value="created-desc">Newest first</option>
              <option value="created-asc">Oldest first</option>
              <option value="clicks-desc">Most clicks</option>
              <option value="clicks-asc">Least clicks</option>
              <option value="slug-asc">Slug A–Z</option>
              <option value="slug-desc">Slug Z–A</option>
            </select>
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setCreatedRange("all");
                setSortBy("created-desc");
                setMinClicks("");
                setMaxClicks("");
              }}
            >
              Clear
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
            <Grid links={filteredBase} />
          </TabsContent>
          <TabsContent value="with-summary">
            <Grid links={filteredSummary} />
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
