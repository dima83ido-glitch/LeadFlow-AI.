import { useTranslations } from "next-intl";

import type { Integration } from "@/lib/integrations";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function IntegrationCard({ integration }: { integration: Integration }) {
  const t = useTranslations("aiTools.outreachHub.integrations");
  const Icon = integration.icon;

  return (
    <Card className="group relative overflow-hidden transition-shadow hover:shadow-md">
      <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <CardContent className="relative flex items-start gap-3">
        <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
          <Icon className="text-foreground size-5" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium">{integration.name}</p>
            <Badge variant="secondary" className="shrink-0 text-[10px]">
              {t("comingSoon")}
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs">
            {t.has(`${integration.id}.description`) ? t(`${integration.id}.description`) : ""}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
