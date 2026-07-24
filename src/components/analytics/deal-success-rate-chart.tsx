"use client";

import { Cell, Pie, PieChart } from "recharts";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface DealSuccessRate {
  won: number;
  lost: number;
  open: number;
  successRate: number;
}

export function DealSuccessRateChart({ stats }: { stats: DealSuccessRate }) {
  const t = useTranslations("analytics.dealSuccessRate");
  const chartConfig = {
    won: { label: t("won"), color: "var(--chart-2)" },
    lost: { label: t("lost"), color: "var(--chart-5)" },
  } satisfies ChartConfig;

  const data = [
    { key: "won", label: t("won"), value: stats.won, fill: "var(--color-won)" },
    { key: "lost", label: t("lost"), value: stats.lost, fill: "var(--color-lost)" },
  ];
  const hasData = stats.won + stats.lost > 0;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">{t("title")}</CardTitle>
        <p className="text-2xl font-semibold tracking-tight">{stats.successRate.toFixed(0)}%</p>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ChartContainer config={chartConfig} className="mx-auto h-56 w-full max-w-64">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="key" />} />
              <Pie data={data} dataKey="value" nameKey="key" innerRadius={50} outerRadius={80} strokeWidth={2}>
                {data.map((entry) => (
                  <Cell key={entry.key} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="key" />} />
            </PieChart>
          </ChartContainer>
        ) : (
          <p className="text-muted-foreground py-10 text-center text-sm">{t("won")} 0 · {t("lost")} 0</p>
        )}
      </CardContent>
    </Card>
  );
}
