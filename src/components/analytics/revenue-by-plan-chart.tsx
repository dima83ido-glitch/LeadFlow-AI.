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

export interface RevenueByPlanPoint {
  planKey: string;
  revenue: number;
}

export function RevenueByPlanChart({ data }: { data: RevenueByPlanPoint[] }) {
  const t = useTranslations("analytics.revenueByPlan");
  const chartConfig = {
    revenue: { label: t("value"), color: "var(--chart-2)" },
  } satisfies ChartConfig;
  const planLabel = (key: string) => t(`plans.${key}`);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={data} margin={{ left: 0, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="planKey" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={planLabel} />
            <YAxis tickLine={false} axisLine={false} width={40} />
            <ChartTooltip content={<ChartTooltipContent labelFormatter={(_, payload) => planLabel(payload[0]?.payload.planKey)} />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
