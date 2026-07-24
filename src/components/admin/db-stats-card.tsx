import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface DbStats {
  rowCounts: { label: string; count: number }[];
  memoryUsedMb: number;
  memoryTotalMb: number;
  errorsLast24h: number;
}

export function DbStatsCard({ stats }: { stats: DbStats }) {
  const t = useTranslations("admin.systemManagement.dbStats");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          {stats.rowCounts.map((row) => (
            <div key={row.label} className="flex flex-col gap-0.5">
              <dt className="text-muted-foreground text-xs">{row.label}</dt>
              <dd className="font-medium">{row.count.toLocaleString()}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground text-xs">{t("memoryUsage")}</span>
            <span className="font-medium">
              {stats.memoryUsedMb} MB / {stats.memoryTotalMb} MB
            </span>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-muted-foreground text-xs">{t("errorsLast24h")}</span>
            <Badge variant={stats.errorsLast24h > 0 ? "destructive" : "secondary"}>{stats.errorsLast24h}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
