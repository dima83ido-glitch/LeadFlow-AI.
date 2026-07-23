"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useTranslations } from "next-intl";

import { mockLeadsBySource } from "@/lib/mock/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function LeadsBySourceChart() {
  const t = useTranslations("analytics.leadsBySource");
  const chartConfig = {
    value: { label: t("value"), color: "var(--chart-1)" },
  } satisfies ChartConfig;
  const sourceLabel = (key: string) => t(`sources.${key}`);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={mockLeadsBySource} layout="vertical" margin={{ left: 12 }}>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="sourceKey"
              type="category"
              tickLine={false}
              axisLine={false}
              width={100}
              tickFormatter={sourceLabel}
            />
            <ChartTooltip content={<ChartTooltipContent labelFormatter={(_, payload) => sourceLabel(payload[0]?.payload.sourceKey)} />} />
            <Bar dataKey="value" fill="var(--color-value)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
