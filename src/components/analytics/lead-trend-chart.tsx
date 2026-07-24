"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface LeadTrendPoint {
  month: string;
  leads: number;
}

export function LeadTrendChart({ data: points }: { data: LeadTrendPoint[] }) {
  const t = useTranslations("analytics.leadTrends");
  const tm = useTranslations("common.monthsShort");
  const chartConfig = {
    leads: { label: t("value"), color: "var(--chart-1)" },
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
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart data={data} margin={{ left: 0, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="leads"
              type="monotone"
              fill="var(--color-leads)"
              fillOpacity={0.15}
              stroke="var(--color-leads)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
