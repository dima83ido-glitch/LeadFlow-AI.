import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import type { DashboardStat } from "@/lib/mock/dashboard";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedNumber, type NumberFormat } from "@/components/shared/animated-number";
import { ENTRANCE_DELAYS } from "@/components/dashboard/overview-card";

const NUMBER_FORMATS: Record<DashboardStat["labelKey"], NumberFormat> = {
  totalLeads: "integer",
  activeCampaigns: "integer",
  replyRate: "percent1",
  revenueMtd: "currency0",
};

export function StatCard({ stat, index = 0 }: { stat: DashboardStat; index?: number }) {
  const t = useTranslations("dashboard");
  const isUp = stat.trend === "up";
  return (
    <Card
      className={cn(
        "animate-in fade-in-0 slide-in-from-bottom-3 fill-mode-backwards duration-500 ease-out",
        ENTRANCE_DELAYS[index % ENTRANCE_DELAYS.length],
      )}
    >
      <CardContent className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">{t(`stats.${stat.labelKey}`)}</p>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">
            <AnimatedNumber value={stat.numericValue} format={NUMBER_FORMATS[stat.labelKey]} />
          </p>
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
        <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover/card:scale-110">
          <stat.icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
