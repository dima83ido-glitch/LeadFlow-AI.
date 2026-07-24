"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface AiUsageDailyPoint {
  day: string;
  calls: number;
}

export function AiUsageDailyChart({ data }: { data: AiUsageDailyPoint[] }) {
  const t = useTranslations("admin.aiUsage.dailyChart");
  const chartConfig = {
    calls: { label: t("callsLabel"), color: "var(--chart-1)" },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart data={data} margin={{ left: 0, right: 12 }}>
            <defs>
              <linearGradient id="fillAiCalls" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-calls)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-calls)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={30} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="calls"
              type="monotone"
              stroke="var(--color-calls)"
              fill="url(#fillAiCalls)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
