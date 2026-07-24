import { Percent, TrendingUp, UserPlus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { Locale } from "@/i18n/config";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function ServiceAnalyticsCards({
  newRegistrations,
  arr,
  paidConversionRate,
}: {
  newRegistrations: number;
  arr: number;
  paidConversionRate: number;
}) {
  const t = useTranslations("admin.statistics.extraStats");
  const locale = useLocale() as Locale;

  const items = [
    { label: t("newRegistrations"), value: newRegistrations.toString(), icon: UserPlus },
    { label: t("arr"), value: formatCurrency(arr, undefined, locale), icon: TrendingUp },
    { label: t("paidConversionRate"), value: `${paidConversionRate.toFixed(1)}%`, icon: Percent },
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
