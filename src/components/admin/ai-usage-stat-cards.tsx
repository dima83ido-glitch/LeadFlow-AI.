import { Bot, Sparkles, Wrench } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";

export interface AiUsageSummary {
  totalCalls: number;
  activeTools: number;
  topTool: string | null;
}

export function AiUsageStatCards({ stats }: { stats: AiUsageSummary }) {
  const t = useTranslations("admin.aiUsage.stats");
  const tTools = useTranslations("admin.aiUsage.toolLabels");

  const topToolLabel = stats.topTool ? (tTools.has(stats.topTool) ? tTools(stats.topTool) : stats.topTool) : "—";

  const items = [
    { label: t("totalCalls"), value: stats.totalCalls.toString(), icon: Sparkles },
    { label: t("activeTools"), value: stats.activeTools.toString(), icon: Wrench },
    { label: t("topTool"), value: topToolLabel, icon: Bot },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">{stat.label}</p>
              <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
            </div>
            <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
              <stat.icon className="text-muted-foreground size-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
