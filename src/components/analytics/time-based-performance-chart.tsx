"use client";

import * as React from "react";
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";
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

export interface TimeBasedPerformancePoint {
  month: string;
  leads: number;
  dealValue: number;
}

export function TimeBasedPerformanceChart({ data: points }: { data: TimeBasedPerformancePoint[] }) {
  const t = useTranslations("analytics.timeBasedPerformance");
  const tm = useTranslations("common.monthsShort");
  const chartConfig = {
    leads: { label: t("leads"), color: "var(--chart-1)" },
    dealValue: { label: t("dealValue"), color: "var(--chart-4)" },
  } satisfies ChartConfig;
  const data = React.useMemo(
    () => points.map((point) => ({ ...point, month: tm(point.month) })),
    [points, tm],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <ComposedChart data={data} margin={{ left: 0, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis yAxisId="leads" tickLine={false} axisLine={false} width={32} allowDecimals={false} />
            <YAxis yAxisId="value" orientation="right" tickLine={false} axisLine={false} width={48} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar yAxisId="leads" dataKey="leads" fill="var(--color-leads)" radius={4} />
            <Line
              yAxisId="value"
              dataKey="dealValue"
              type="monotone"
              stroke="var(--color-dealValue)"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
