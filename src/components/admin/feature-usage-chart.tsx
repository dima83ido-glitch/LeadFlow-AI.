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
import { EmptyState } from "@/components/shared/empty-state";
import { BarChart3 } from "lucide-react";

export interface FeatureUsagePoint {
  feature: string;
  count: number;
}

export function FeatureUsageChart({ data }: { data: FeatureUsagePoint[] }) {
  const t = useTranslations("admin.statistics.featureUsage");
  const chartConfig = {
    count: { label: t("usesLabel"), color: "var(--chart-4)" },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState icon={BarChart3} title={t("emptyTitle")} description={t("emptyDescription")} className="border-none py-8" />
        ) : (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart data={data} layout="vertical" margin={{ left: 12 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" hide allowDecimals={false} />
              <YAxis dataKey="feature" type="category" tickLine={false} axisLine={false} width={140} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
