"use client";

import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import Head from "next/head";
import {
  Activity,
  Bot,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Clock3,
  Filter,
  Link2,
  Loader2,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import ChatDialog, { ChatDialogProps } from "@/components/ChatDialog";
import LinkCard from "@/components/LinkCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { formatCompactNumber, formatFullNumber } from "@/lib/link-utils";

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

const createdRangeDays: Record<CreatedRange, number> = {
  all: 0,
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "365d": 365,
};

const selectClassName =
  "h-11 w-full appearance-none rounded-xl border border-input bg-background/75 px-4 pr-14 text-sm shadow-xs backdrop-blur-sm outline-none transition-[border-color,box-shadow,background-color] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";
const LINKS_PER_PAGE = 6;

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

const normalizeLink = (link: unknown): LinkItem | null => {
  if (!link || typeof link !== "object") return null;
  return {
    ...(link as LinkItem),
    clicks: normalizeClicks((link as LinkItem).clicks),
  };
};

const normalizeLinks = (data: unknown): LinkItem[] => {
  if (!Array.isArray(data)) return [];
  return data
    .map((item) => normalizeLink(item))
    .filter((item): item is LinkItem => Boolean(item));
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
  const [currentPage, setCurrentPage] = useState(1);

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

  const add = async () => {
    if (!dest.trim()) {
      toast.error("Paste a destination URL first");
      return;
    }

    setLoadingAdd(true);
    try {
      const { data } = await api.post("/urls", { destination: dest.trim() });
      const newLink = normalizeLink(data.data ?? data);
      if (!newLink) throw new Error("Invalid link payload");
      setLinks((prev) => (prev ? [newLink, ...prev] : [newLink]));
      setCurrentPage(1);
      setDest("");
      toast.success("URL shortened", { icon: <Check className="h-4 w-4" /> });
    } catch {
      toast.error("Failed to shorten URL");
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleAddSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loadingAdd) return;
    void add();
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
            const date = new Date();
            date.setDate(date.getDate() - createdRangeDays[createdRange]);
            return date;
          })();

    return [...links]
      .filter((link) => {
        const clickCount = link.clicks.length;
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
          if (!Number.isFinite(createdTime) || createdTime < cutoff.getTime()) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const aClicks = a.clicks.length;
        const bClicks = b.clicks.length;
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
  }, [links, query, createdRange, sortBy, minClicks, maxClicks]);

  const filteredSummary = useMemo(
    () =>
      filteredBase?.filter((link) =>
        Boolean(link.summary && link.summary !== "N/A"),
      ) ?? null,
    [filteredBase],
  );

  const displayedLinks = tab === "all" ? filteredBase : filteredSummary;
  const totalPages = displayedLinks?.length
    ? Math.max(1, Math.ceil(displayedLinks.length / LINKS_PER_PAGE))
    : 1;
  const paginatedLinks = displayedLinks?.slice(
    (currentPage - 1) * LINKS_PER_PAGE,
    currentPage * LINKS_PER_PAGE,
  );
  const pageStart =
    displayedLinks && displayedLinks.length
      ? (currentPage - 1) * LINKS_PER_PAGE + 1
      : 0;
  const pageEnd =
    displayedLinks && displayedLinks.length
      ? Math.min(currentPage * LINKS_PER_PAGE, displayedLinks.length)
      : 0;
  const allClicks = useMemo(
    () => (links ?? []).flatMap((link) => normalizeClicks(link.clicks)),
    [links],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [tab, query, createdRange, sortBy, minClicks, maxClicks]);

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const totals = useMemo(() => {
    const totalLinks = links?.length ?? 0;
    const totalClicks = allClicks.length;
    const linksWithSummary =
      links?.filter((link) => Boolean(link.summary && link.summary !== "N/A"))
        .length ?? 0;
    const summaryRate = totalLinks
      ? Math.round((linksWithSummary / totalLinks) * 100)
      : 0;
    const avgClicks = totalLinks ? Math.round(totalClicks / totalLinks) : 0;

    return {
      totalLinks,
      totalClicks,
      linksWithSummary,
      summaryRate,
      avgClicks,
    };
  }, [allClicks.length, links]);

  const dailyTrend = useMemo(() => {
    const counts: Record<string, number> = {};
    allClicks.forEach((click) => {
      const day = click.createdAt.slice(0, 10);
      counts[day] = (counts[day] || 0) + 1;
    });
    return Array.from({ length: 30 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - index));
      const key = date.toISOString().slice(0, 10);
      return { day: key.slice(5), count: counts[key] || 0 };
    });
  }, [allClicks]);

  const hourly = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let hour = 0; hour < 24; hour += 1) counts[hour] = 0;
    allClicks.forEach((click) => {
      counts[new Date(click.createdAt).getHours()] += 1;
    });
    return Object.entries(counts).map(([hour, count]) => ({
      hour: `${hour.padStart(2, "0")}:00`,
      count,
    }));
  }, [allClicks]);

  const weekdays = useMemo(() => {
    const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts: Record<number, number> = {};
    names.forEach((_, index) => {
      counts[index] = 0;
    });
    allClicks.forEach((click) => {
      counts[new Date(click.createdAt).getDay()] += 1;
    });
    return names.map((day, index) => ({ day, count: counts[index] }));
  }, [allClicks]);

  const deviceSplit = useMemo(() => {
    let mobile = 0;
    let desktop = 0;
    allClicks.forEach((click) => {
      if (/Mobi/i.test(click.userAgent)) mobile += 1;
      else desktop += 1;
    });
    return [
      { name: "Desktop", value: desktop },
      { name: "Mobile", value: mobile },
    ];
  }, [allClicks]);

  const topLinks = useMemo(() => {
    if (!links) return [];
    return [...links]
      .sort((a, b) => b.clicks.length - a.clicks.length)
      .slice(0, 5)
      .map((link) => ({
        name: link.slug,
        value: link.clicks.length,
      }));
  }, [links]);

  const hist = useMemo(() => {
    const times = allClicks
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
  }, [allClicks]);

  const bestLink = topLinks[0];
  const chartsReady = links !== null;
  const stats = {
    dailyTrend,
    hourly,
    weekdays,
    deviceSplit,
    topLinks,
    hist,
  };

  const globalLink: ChatDialogProps["link"] = {
    id: "all",
    slug: "all-links",
    destination: "",
    summary: "Aggregated view of all your links",
    createdAt: new Date().toISOString(),
    clicks: allClicks.map((click) => ({
      id: click.id ?? "N/A",
      ip: click.ip ?? "0.0.0.0",
      userAgent: click.userAgent,
      createdAt: click.createdAt,
    })),
  };

  const activeFilterCount = [
    query.trim(),
    createdRange !== "all",
    minClicks.trim(),
    maxClicks.trim(),
    sortBy !== "created-desc",
    tab !== "all",
  ].filter(Boolean).length;

  return (
    <>
      <Head>
        <title>Links - Urlvy URL Shortener</title>
        <meta
          name="description"
          content="Manage your shortened URLs and view their stats"
        />
      </Head>

      <section className="page-shell page-section space-y-8">
        <div className="hero-grid">
          <div className="surface-panel p-6 sm:p-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="eyebrow">
                  <Sparkles className="h-3.5 w-3.5" />
                  Link workspace
                </div>
                <div className="space-y-3">
                  <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                    Launch, monitor, and optimize every shortened URL from one
                    clean dashboard.
                  </h1>
                  <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                    Create links instantly, filter your catalog with precision,
                    and use charts plus AI summaries to understand traffic
                    patterns faster.
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-3">
                <label className="text-sm font-medium" htmlFor="destination">
                  Destination URL
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="destination"
                      placeholder="https://example.com/product-launch"
                      value={dest}
                      onChange={(event) => setDest(event.target.value)}
                      className="pl-11"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="sm:min-w-40"
                    disabled={loadingAdd}
                  >
                    {loadingAdd ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Shorten URL
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <div className="grid gap-3 sm:grid-cols-3">
                <QuickStat
                  icon={<Link2 className="h-4 w-4 text-primary" />}
                  label="Links created"
                  value={formatCompactNumber(totals.totalLinks)}
                />
                <QuickStat
                  icon={<Activity className="h-4 w-4 text-primary" />}
                  label="Tracked clicks"
                  value={formatCompactNumber(totals.totalClicks)}
                />
                <QuickStat
                  icon={<Bot className="h-4 w-4 text-primary" />}
                  label="AI coverage"
                  value={`${totals.summaryRate}%`}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="border-border/70 bg-card/94 py-0">
              <CardHeader className="border-b border-border/70 pb-5">
                <CardTitle className="text-xl">Operational snapshot</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 pt-6">
                <SnapshotRow
                  label="Average clicks per link"
                  value={formatFullNumber(totals.avgClicks)}
                />
                <SnapshotRow
                  label="Links with summaries"
                  value={formatFullNumber(totals.linksWithSummary)}
                />
                <SnapshotRow
                  label="Visible results"
                  value={formatFullNumber(displayedLinks?.length ?? 0)}
                />
                <SnapshotRow
                  label="Best performer"
                  value={
                    bestLink
                      ? `${bestLink.name} · ${formatFullNumber(bestLink.value)}`
                      : "No data yet"
                  }
                />
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/94 py-0">
              <CardHeader className="border-b border-border/70 pb-5">
                <CardTitle className="text-xl">Current focus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="surface-muted px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Active filters
                  </p>
                  <p className="mt-2 text-lg font-semibold tracking-tight">
                    {activeFilterCount}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Use filters and sorting to isolate campaign-specific
                    behavior quickly.
                  </p>
                </div>
                <div className="surface-muted px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Recommended next step
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Review the 30-day trend and top links together to see
                    whether performance is concentrated or evenly distributed
                    across the catalog.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="border-border/70 bg-card/94 py-0">
          <CardHeader className="flex flex-col gap-4 border-b border-border/70 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-xl">Filter and sort links</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                Narrow the catalog by keyword, age, or click volume to inspect
                the links that matter right now.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setCreatedRange("all");
                setSortBy("created-desc");
                setMinClicks("");
                setMaxClicks("");
                setTab("all");
              }}
            >
              <Filter className="h-4 w-4" />
              Reset filters
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3 pt-6 md:grid-cols-2 xl:grid-cols-5">
            <div className="xl:col-span-2">
              <Input
                placeholder="Search slug, destination, summary"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <SelectField>
              <select
                className={selectClassName}
                value={createdRange}
                onChange={(event) =>
                  setCreatedRange(event.target.value as CreatedRange)
                }
              >
                <option value="all">All time</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="365d">Last 12 months</option>
              </select>
            </SelectField>
            <Input
              type="number"
              min="0"
              placeholder="Min clicks"
              value={minClicks}
              onChange={(event) => setMinClicks(event.target.value)}
            />
            <Input
              type="number"
              min="0"
              placeholder="Max clicks"
              value={maxClicks}
              onChange={(event) => setMaxClicks(event.target.value)}
            />
            <SelectField>
              <select
                className={selectClassName}
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortBy)}
              >
                <option value="created-desc">Newest first</option>
                <option value="created-asc">Oldest first</option>
                <option value="clicks-desc">Most clicks</option>
                <option value="clicks-asc">Least clicks</option>
                <option value="slug-asc">Slug A-Z</option>
                <option value="slug-desc">Slug Z-A</option>
              </select>
            </SelectField>
          </CardContent>
        </Card>

        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Link library
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Review your entire catalog or focus only on links with generated
                summaries.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <Tabs
                value={tab}
                onValueChange={(value) =>
                  setTab(value as "all" | "with-summary")
                }
              >
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="all">All links</TabsTrigger>
                  <TabsTrigger value="with-summary">With summary</TabsTrigger>
                </TabsList>
              </Tabs>
              <p className="text-sm text-muted-foreground">
                {displayedLinks === null
                  ? "Loading links..."
                  : displayedLinks.length
                    ? `Showing ${formatFullNumber(pageStart)}-${formatFullNumber(pageEnd)} of ${formatFullNumber(displayedLinks.length)} links`
                    : "No links match the current view"}
              </p>
            </div>
          </div>

          <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as "all" | "with-summary")}
          >
            <TabsContent value="all">
              <Grid
                links={tab === "all" ? (paginatedLinks ?? null) : filteredBase}
              />
            </TabsContent>
            <TabsContent value="with-summary">
              <Grid
                links={
                  tab === "with-summary"
                    ? (paginatedLinks ?? null)
                    : filteredSummary
                }
                emptyTitle="No summarized links yet"
                emptyDescription="As summaries are generated, the enriched links will appear here for faster review."
              />
            </TabsContent>
          </Tabs>

          {displayedLinks && displayedLinks.length > LINKS_PER_PAGE ? (
            <Card className="border-border/70 bg-card/94 py-0">
              <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  Page {formatFullNumber(currentPage)} of{" "}
                  {formatFullNumber(totalPages)}
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Global analytics
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Read the shape of your traffic across time, devices, and your
                most-clicked assets.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex">
              <SummaryPill
                label="30-day clicks"
                value={formatFullNumber(
                  dailyTrend.reduce((sum, item) => sum + item.count, 0),
                )}
              />
              <SummaryPill
                label="Top link"
                value={bestLink ? bestLink.name : "None"}
              />
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <ChartCard
              title="30-day click trend"
              description="Monitor demand over time and spot momentum changes early."
            >
              {chartsReady ? (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={dailyTrend}>
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
              ) : (
                <Skeleton className="h-64 w-full rounded-2xl" />
              )}
            </ChartCard>

            <ChartCard
              title="Clicks by hour"
              description="See when your audience is most active during the day."
            >
              {chartsReady ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={hourly}>
                    <XAxis dataKey="hour" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <ReTooltip />
                    <Bar
                      dataKey="count"
                      radius={[8, 8, 0, 0]}
                      fill={COLORS[1]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="h-64 w-full rounded-2xl" />
              )}
            </ChartCard>

            <ChartCard
              title="Weekday distribution"
              description="Check which days are carrying the most engagement load."
            >
              {chartsReady ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={weekdays}>
                    <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <ReTooltip />
                    <Bar
                      dataKey="count"
                      radius={[8, 8, 0, 0]}
                      fill={COLORS[2]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="h-64 w-full rounded-2xl" />
              )}
            </ChartCard>

            <ChartCard
              title="Device split"
              description="Understand whether traffic is leaning desktop or mobile."
            >
              {chartsReady ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={deviceSplit}
                      dataKey="value"
                      nameKey="name"
                      outerRadius="72%"
                      label
                    >
                      {deviceSplit.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" />
                    <ReTooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="h-64 w-full rounded-2xl" />
              )}
            </ChartCard>

            <ChartCard
              title="Top 5 most-clicked links"
              description="See which slugs are doing the most work in your portfolio."
            >
              {chartsReady ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={topLinks}
                      dataKey="value"
                      nameKey="name"
                      outerRadius="72%"
                      label
                    >
                      {topLinks.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" />
                    <ReTooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="h-64 w-full rounded-2xl" />
              )}
            </ChartCard>

            <ChartCard
              title="Inter-click timing"
              description="Measure how tightly your click activity clusters over time."
            >
              {chartsReady ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={hist}>
                    <XAxis dataKey="range" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <ReTooltip />
                    <Bar
                      dataKey="count"
                      radius={[8, 8, 0, 0]}
                      fill={COLORS[5]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="h-64 w-full rounded-2xl" />
              )}
            </ChartCard>
          </div>
        </section>

        <ChatDialog link={globalLink} stats={stats} />
      </section>
    </>
  );
}

function Grid({
  links,
  emptyTitle = "No links to show",
  emptyDescription = "Create a new short link or clear your filters to repopulate the library.",
}: {
  links: LinkItem[] | null;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (links === null) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-80 rounded-[1.5rem]" />
        ))}
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <Card className="border-border/70 bg-card/94">
        <CardContent className="flex min-h-72 flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <Clock3 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-tight">
              {emptyTitle}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              {emptyDescription}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  );
}

function QuickStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="surface-muted px-4 py-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4 last:border-b-0 last:pb-0">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-right text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function SummaryPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-muted min-w-32 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function SelectField({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronsUpDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
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
