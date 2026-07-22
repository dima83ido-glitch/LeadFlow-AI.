import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { mockAnalyticsMetrics } from "@/lib/mock/analytics";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function MetricsRow() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {mockAnalyticsMetrics.map((metric) => {
        const isUp = metric.trend === "up";
        return (
          <Card key={metric.label}>
            <CardContent className="space-y-1.5">
              <p className="text-muted-foreground text-sm">{metric.label}</p>
              <p className="text-2xl font-semibold tracking-tight">{metric.value}</p>
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  isUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
                )}
              >
                {isUp ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                {Math.abs(metric.delta)}%
                <span className="text-muted-foreground font-normal">vs last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
