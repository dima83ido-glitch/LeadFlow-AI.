import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface SalesFunnelStage {
  stageKey: string;
  count: number;
}

export function ConversionFunnel({ stages }: { stages: SalesFunnelStage[] }) {
  const t = useTranslations("analytics.salesFunnel");
  const max = stages[0]?.count ?? 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stages.map((stage) => {
          const width = max > 0 ? Math.max(8, Math.round((stage.count / max) * 100)) : 8;
          return (
            <div key={stage.stageKey} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{stage.stageKey}</span>
                <span className="text-muted-foreground">{stage.count.toLocaleString()}</span>
              </div>
              <div className="bg-muted h-2.5 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
