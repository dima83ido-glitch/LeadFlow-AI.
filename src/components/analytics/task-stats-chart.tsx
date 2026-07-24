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

export interface TaskStats {
  TODO: number;
  IN_PROGRESS: number;
  DONE: number;
  overdue: number;
}

export function TaskStatsChart({ stats }: { stats: TaskStats }) {
  const t = useTranslations("analytics.taskStats");
  const chartConfig = {
    value: { label: t("todo"), color: "var(--chart-3)" },
  } satisfies ChartConfig;

  const data = [
    { key: t("todo"), value: stats.TODO },
    { key: t("inProgress"), value: stats.IN_PROGRESS },
    { key: t("done"), value: stats.DONE },
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
          {t("overdue")}: <span className="text-foreground font-medium">{stats.overdue}</span>
        </p>
      </CardContent>
    </Card>
  );
}
