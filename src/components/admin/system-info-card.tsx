import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface SystemInfo {
  appVersion: string;
  nodeEnv: string;
  nodeVersion: string;
  uptimeSeconds: number;
  dbHealthy: boolean;
}

function formatUptime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

export function SystemInfoCard({ info }: { info: SystemInfo }) {
  const t = useTranslations("admin.systemManagement.systemInfo");

  const rows = [
    { label: t("appVersion"), value: info.appVersion },
    { label: t("environment"), value: info.nodeEnv },
    { label: t("nodeVersion"), value: info.nodeVersion },
    { label: t("uptime"), value: formatUptime(info.uptimeSeconds) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-0.5">
              <dt className="text-muted-foreground text-xs">{row.label}</dt>
              <dd className="font-medium">{row.value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex items-center justify-between border-t pt-3">
          <span className="text-sm">{t("databaseStatus")}</span>
          <Badge variant={info.dbHealthy ? "secondary" : "destructive"}>
            {info.dbHealthy ? t("healthy") : t("unhealthy")}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
