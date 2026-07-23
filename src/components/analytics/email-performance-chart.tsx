"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useTranslations } from "next-intl";

import { mockEmailPerformance } from "@/lib/mock/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function EmailPerformanceChart() {
  const t = useTranslations("analytics.emailPerformance");
  const tm = useTranslations("common.monthsShort");
  const chartConfig = {
    sent: { label: t("sent"), color: "var(--chart-1)" },
    opened: { label: t("opened"), color: "var(--chart-2)" },
    replied: { label: t("replied"), color: "var(--chart-3)" },
  } satisfies ChartConfig;
  const data = React.useMemo(
    () => mockEmailPerformance.map((point) => ({ ...point, month: tm(point.month) })),
    [tm],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <AreaChart data={data} margin={{ left: 0, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="sent"
              type="monotone"
              fill="var(--color-sent)"
              fillOpacity={0.15}
              stroke="var(--color-sent)"
              strokeWidth={2}
            />
            <Area
              dataKey="opened"
              type="monotone"
              fill="var(--color-opened)"
              fillOpacity={0.15}
              stroke="var(--color-opened)"
              strokeWidth={2}
            />
            <Area
              dataKey="replied"
              type="monotone"
              fill="var(--color-replied)"
              fillOpacity={0.15}
              stroke="var(--color-replied)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
