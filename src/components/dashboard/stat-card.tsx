import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import type { DashboardStat } from "@/lib/mock/dashboard";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({ stat }: { stat: DashboardStat }) {
  const t = useTranslations("dashboard");
  const isUp = stat.trend === "up";
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">{t(`stats.${stat.labelKey}`)}</p>
          <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              isUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
            )}
          >
            {isUp ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {Math.abs(stat.delta)}%
            <span className="text-muted-foreground font-normal">{t("vsLastMonth")}</span>
          </div>
        </div>
        <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
          <stat.icon className="text-muted-foreground size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
