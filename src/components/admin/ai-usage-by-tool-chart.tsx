"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Bot } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { EmptyState } from "@/components/shared/empty-state";

export interface AiUsageByToolPoint {
  feature: string;
  count: number;
}

export function AiUsageByToolChart({ data }: { data: AiUsageByToolPoint[] }) {
  const t = useTranslations("admin.aiUsage.byToolChart");
  const tTools = useTranslations("admin.aiUsage.toolLabels");

  const labeled = React.useMemo(
    () => data.map((d) => ({ ...d, tool: tTools.has(d.feature) ? tTools(d.feature) : d.feature })),
    [data, tTools],
  );

  const chartConfig = {
    count: { label: t("callsLabel"), color: "var(--chart-3)" },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {labeled.length === 0 ? (
          <EmptyState icon={Bot} title={t("emptyTitle")} description={t("emptyDescription")} className="border-none py-8" />
        ) : (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart data={labeled} layout="vertical" margin={{ left: 12 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" hide allowDecimals={false} />
              <YAxis dataKey="tool" type="category" tickLine={false} axisLine={false} width={160} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
