"use client";

import * as React from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

export interface UserGrowthPoint {
  month: string;
  users: number;
  mrr: number;
}

export function UserGrowthChart({ data: points }: { data: UserGrowthPoint[] }) {
  const t = useTranslations("admin.statistics.growthChart");
  const tm = useTranslations("common.monthsShort");
  const chartConfig = {
    users: { label: t("usersLabel"), color: "var(--chart-1)" },
    mrr: { label: t("mrrLabel"), color: "var(--chart-2)" },
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
          <LineChart data={data} margin={{ left: 0, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={40} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="users"
              type="monotone"
              stroke="var(--color-users)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="mrr"
              type="monotone"
              stroke="var(--color-mrr)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
