"use client";

import { useMemo, type ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  Clock3,
  Flame,
  AlertTriangle,
  Users,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ClickRecord = {
  id: string;
  ip: string;
  userAgent: string;
  createdAt: string;
};

type LinkRecord = {
  id: string;
  slug: string;
  destination: string;
  summary?: string | null;
  createdAt: string;
  clicks: ClickRecord[];
};

type InsightCard = {
  id: string;
  title: string;
  metric: string;
  description: string;
  tone: "neutral" | "positive" | "negative";
  icon: ReactNode;
};

type SmartInsightsProps = {
  links: LinkRecord[] | null;
};

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatHour(hour: number) {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatRange(hour: number) {
  const end = (hour + 1) % 24;
  return `${formatHour(hour)} – ${formatHour(end)}`;
}

export default function SmartInsights({ links }: SmartInsightsProps) {
  const cards = useMemo<InsightCard[]>(() => {
    if (!links || links.length === 0) {
      return [];
    }

    const allClicks = links.flatMap((link) => link.clicks ?? []);
    const totalClicks = allClicks.length;
    const uniqueVisitors = new Set(
      allClicks.map((click) => click.ip || click.id),
    ).size;

    const today = startOfDay(new Date());
    const last7Start = new Date(today);
    last7Start.setDate(today.getDate() - 6);
    const prev7Start = new Date(last7Start);
    prev7Start.setDate(last7Start.getDate() - 7);

    const last7Clicks = allClicks.filter(
      (click) => new Date(click.createdAt) >= last7Start,
    );
    const prev7Clicks = allClicks.filter((click) => {
      const when = new Date(click.createdAt);
      return when >= prev7Start && when < last7Start;
    });

    const change =
      prev7Clicks.length === 0
        ? last7Clicks.length > 0
          ? "Traffic resumed after a quiet previous week."
          : "No clicks recorded in either of the last two weeks."
        : `${
            last7Clicks.length - prev7Clicks.length >= 0 ? "Up" : "Down"
          } ${Math.abs(
            ((last7Clicks.length - prev7Clicks.length) / prev7Clicks.length) *
              100,
          ).toFixed(
            1,
          )}% vs the prior 7 days (${prev7Clicks.length.toLocaleString()} clicks).`;

    const momentumTone: InsightCard["tone"] =
      prev7Clicks.length === 0
        ? last7Clicks.length > 0
          ? "positive"
          : "neutral"
        : last7Clicks.length - prev7Clicks.length >= 0
          ? "positive"
          : "negative";

    const dayCounts = new Array(7).fill(0) as number[];
    const hourCounts = new Array(24).fill(0) as number[];
    allClicks.forEach((click) => {
      const when = new Date(click.createdAt);
      dayCounts[when.getDay()]++;
      hourCounts[when.getHours()]++;
    });
    const bestDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
    const bestHourIndex = hourCounts.indexOf(Math.max(...hourCounts));

    const last7ByLink = links
      .map((link) => ({
        link,
        recent: link.clicks.filter(
          (click) => new Date(click.createdAt) >= last7Start,
        ).length,
        total: link.clicks.length,
      }))
      .sort((a, b) => b.recent - a.recent || b.total - a.total);

    const topRecent = last7ByLink.find((item) => item.recent > 0);
    const topOverall = [...last7ByLink].sort((a, b) => b.total - a.total)[0];

    const staleThreshold = new Date(today);
    staleThreshold.setDate(today.getDate() - 14);
    const staleLinks = links.filter((link) => {
      if (!link.clicks.length) {
        return new Date(link.createdAt) < staleThreshold;
      }
      const lastClick = link.clicks.reduce((latest, click) => {
        const ts = new Date(click.createdAt).getTime();
        return ts > latest ? ts : latest;
      }, 0);
      return lastClick > 0 ? lastClick < staleThreshold.getTime() : false;
    });

    const freshThreshold = new Date(today);
    freshThreshold.setDate(today.getDate() - 14);
    const freshLinks = links.filter(
      (link) => new Date(link.createdAt) >= freshThreshold,
    );

    const repeatRate =
      totalClicks === 0
        ? 0
        : ((totalClicks - uniqueVisitors) / totalClicks) * 100;

    const insights: InsightCard[] = [
      {
        id: "momentum",
        title: "Traffic momentum",
        metric: `${last7Clicks.length.toLocaleString()} clicks`,
        description: change,
        tone: momentumTone,
        icon:
          momentumTone === "negative" ? (
            <TrendingDown className="h-5 w-5" />
          ) : (
            <TrendingUp className="h-5 w-5" />
          ),
      },
    ];

    if (totalClicks > 0) {
      const bestDay = dayNames[bestDayIndex] ?? "Sunday";
      const bestHourRange = formatRange(bestHourIndex);

      insights.push({
        id: "best-time",
        title: "Best time to post",
        metric: `${bestDay} • ${bestHourRange}`,
        description: `Clicks concentrate on ${bestDay}s between ${bestHourRange}. Plan your announcements around this window for maximum reach.`,
        tone: "positive",
        icon: <Clock3 className="h-5 w-5" />,
      });

      const leader = topRecent ?? topOverall;
      if (leader) {
        const recentLabel =
          leader.recent > 0
            ? `${leader.recent.toLocaleString()} clicks this week.`
            : "No clicks this week yet.";
        insights.push({
          id: "top-link",
          title: "Top performing link",
          metric: leader.link.slug,
          description: `${leader.link.slug} owns ${leader.total.toLocaleString()} lifetime clicks. ${recentLabel}`,
          tone: leader.recent > 0 ? "positive" : "neutral",
          icon: <Flame className="h-5 w-5" />,
        });
      }

      insights.push({
        id: "loyalty",
        title: "Visitor loyalty",
        metric: `${Math.round(repeatRate)}% repeaters`,
        description: `${uniqueVisitors.toLocaleString()} unique visitors across ${totalClicks.toLocaleString()} clicks. Encourage repeat audiences to convert with tailored CTAs.`,
        tone: repeatRate >= 30 ? "positive" : "neutral",
        icon: <Users className="h-5 w-5" />,
      });
    }

    insights.push({
      id: "stale",
      title: "Stale links",
      metric: staleLinks.length
        ? `${staleLinks.length} need love`
        : "All healthy",
      description:
        staleLinks.length > 0
          ? `${staleLinks
              .slice(0, 2)
              .map((link) => link.slug)
              .join(", ")}${
              staleLinks.length > 2 ? "…" : ""
            } haven\'t been clicked in 14 days. Refresh the messaging or pause them.`
          : "Every link has seen activity in the last two weeks. Keep the momentum going!",
      tone: staleLinks.length > 0 ? "negative" : "positive",
      icon: <AlertTriangle className="h-5 w-5" />,
    });

    insights.push({
      id: "fresh",
      title: "Fresh launches",
      metric: `${freshLinks.length} new${freshLinks.length === 1 ? " link" : " links"}`,
      description: `${freshLinks.length} of ${links.length} links were created in the last 14 days. Promote them to collect statistically significant data faster.`,
      tone: freshLinks.length > 0 ? "positive" : "neutral",
      icon: <Sparkles className="h-5 w-5" />,
    });

    return insights;
  }, [links]);

  if (links === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Smart Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (cards.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Smart Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Add your first links and start receiving actionable recommendations
            based on live click data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background">
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/20 blur-3xl" />
      <CardHeader className="relative">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle>Smart Insights</CardTitle>
            <p className="text-sm text-muted-foreground">
              Urlvy analyses your portfolio and surfaces opportunities
              automatically.
            </p>
          </div>
          <Badge variant="secondary" className="bg-primary/15 text-primary">
            New
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.id}
              className={cn(
                "rounded-xl border bg-background/70 p-4 shadow-sm transition hover:shadow-md",
                card.tone === "positive" &&
                  "border-emerald-200/60 dark:border-emerald-900/40",
                card.tone === "negative" && "border-destructive/40",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    card.tone === "negative"
                      ? "bg-destructive/10 text-destructive"
                      : card.tone === "positive"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-primary/10 text-primary",
                  )}
                >
                  {card.icon}
                </span>
                <p className="text-sm font-semibold text-muted-foreground">
                  {card.metric}
                </p>
              </div>
              <h3 className="mt-3 text-base font-semibold">{card.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
