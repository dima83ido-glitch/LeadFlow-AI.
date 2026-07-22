"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { mockLeadsBySource } from "@/lib/mock/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  value: { label: "Leads", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function LeadsBySourceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Leads by Source</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={mockLeadsBySource} layout="vertical" margin={{ left: 12 }}>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="source"
              type="category"
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="var(--color-value)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
