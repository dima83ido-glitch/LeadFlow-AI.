import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";
import { useTranslations } from "next-intl";

import type { RecentCampaignItem } from "@/lib/dashboard/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";

export function RecentCampaigns({ campaigns }: { campaigns: RecentCampaignItem[] }) {
  const t = useTranslations("dashboard.recentCampaigns");
  const tc = useTranslations("common.actions");

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">{t("title")}</CardTitle>
        <Button variant="ghost" size="sm" render={<Link href="/campaigns" />}>
          {tc("viewAll")}
          <ArrowRight className="size-3.5" />
        </Button>
      </CardHeader>
      <CardContent>
        {campaigns.length === 0 ? (
          <EmptyState icon={Megaphone} title={t("title")} description={t("sentOf", { sent: 0, total: 0 })} />
        ) : (
          <ul className="space-y-5">
            {campaigns.map((campaign) => {
              const progress =
                campaign.recipientCount > 0
                  ? Math.round((campaign.sentCount / campaign.recipientCount) * 100)
                  : 0;
              return (
                <li key={campaign.id} className="group space-y-2 rounded-lg p-2 -mx-2 transition-colors hover:bg-accent/50">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href="/campaigns"
                      className="truncate text-sm font-medium transition-colors group-hover:text-primary hover:underline"
                    >
                      {campaign.name}
                    </Link>
                    <StatusBadge status={campaign.status} />
                  </div>
                  <Progress value={progress} className="h-1.5" />
                  <p className="text-muted-foreground text-xs">
                    {t("sentOf", { sent: campaign.sentCount, total: campaign.recipientCount })}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
