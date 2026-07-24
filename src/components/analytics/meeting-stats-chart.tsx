"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface MeetingStats {
  SCHEDULED: number;
  COMPLETED: number;
  CANCELLED: number;
  upcoming: number;
}

export function MeetingStatsChart({ stats }: { stats: MeetingStats }) {
  const t = useTranslations("analytics.meetingStats");
  const chartConfig = {
    value: { label: t("scheduled"), color: "var(--chart-2)" },
  } satisfies ChartConfig;

  const data = [
    { key: t("scheduled"), value: stats.SCHEDULED },
    { key: t("completed"), value: stats.COMPLETED },
    { key: t("cancelled"), value: stats.CANCELLED },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-56 w-full">
          <BarChart data={data} margin={{ left: 0, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="key" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="var(--color-value)" radius={4} />
          </BarChart>
        </ChartContainer>
        <p className="text-muted-foreground mt-3 text-xs">
          {t("upcoming")}: <span className="text-foreground font-medium">{stats.upcoming}</span>
        </p>
      </CardContent>
    </Card>
  );
}
