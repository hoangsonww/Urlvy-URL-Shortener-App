import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

type Point = { day: string; count: number };

export default function StatsChart({
  slug,
  days = 30,
}: {
  slug: string;
  days?: number;
}) {
  const [data, setData] = useState<Point[] | null>(null);

  useEffect(() => {
    setData(null);
    api
      .get<Point[]>(`/stats/${slug}/daily`, { params: { days } })
      .then((res) =>
        setData(
          res.data.map((d) => ({
            day: d.day.slice(5, 10),
            count: +d.count,
          })),
        ),
      )
      .catch((err) => {
        console.error(err);
        setData([]);
      });
  }, [slug, days]);

  if (data === null) {
    return <Skeleton className="h-56 w-full rounded-xl" />;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="count"
          stroke="var(--chart-1)"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
