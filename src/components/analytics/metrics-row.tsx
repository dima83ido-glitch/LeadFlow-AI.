import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";

export interface AnalyticsMetrics {
  openRate: number;
  replyRate: number;
  conversionRate: number;
  wonDealValue: number;
}

export function MetricsRow({ metrics }: { metrics: AnalyticsMetrics }) {
  const t = useTranslations("analytics");

  const items: { labelKey: string; value: string }[] = [
    { labelKey: "openRate", value: `${metrics.openRate.toFixed(1)}%` },
    { labelKey: "replyRate", value: `${metrics.replyRate.toFixed(1)}%` },
    { labelKey: "conversionRate", value: `${metrics.conversionRate.toFixed(1)}%` },
    { labelKey: "revenue", value: `$${metrics.wonDealValue.toLocaleString()}` },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((metric) => (
        <Card key={metric.labelKey}>
          <CardContent className="space-y-1.5">
            <p className="text-muted-foreground text-sm">{t(`metrics.${metric.labelKey}`)}</p>
            <p className="text-2xl font-semibold tracking-tight">{metric.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
