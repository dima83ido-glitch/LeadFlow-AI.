"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { mockPlanDistribution } from "@/lib/mock/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  count: { label: "Workspaces", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function PlanDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Plan Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={mockPlanDistribution} margin={{ left: 0, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="plan" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={40} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
