import { formatDistanceToNow } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

import type { Locale } from "@/i18n/config";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import type { RecentActivityItem } from "@/lib/dashboard/queries";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { Activity } from "lucide-react";

export function RecentActivity({ items }: { items: RecentActivityItem[] }) {
  const t = useTranslations("dashboard.recentActivity");
  const ta = useTranslations("notifications.activity");
  const locale = useLocale() as Locale;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState icon={Activity} title={t("emptyTitle")} description={t("emptyDescription")} />
        ) : (
          <ul className="space-y-5">
            {items.map((activity) => (
              <li key={activity.id} className="flex items-start gap-3">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">
                    {activity.actorName
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <p className="text-sm">
                    <span className="font-medium">{activity.actorName}</span>{" "}
                    <span className="text-muted-foreground">{ta(activity.action)}</span>{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(activity.createdAt), {
                      addSuffix: true,
                      locale: getDateFnsLocale(locale),
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
