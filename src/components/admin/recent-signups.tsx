import { useLocale, useTranslations } from "next-intl";

import type { Locale } from "@/i18n/config";
import type { AdminUser } from "@/types/admin";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function RecentSignups({ users }: { users: AdminUser[] }) {
  const t = useTranslations("admin.dashboard.recentSignups");
  const locale = useLocale() as Locale;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user.id} className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">{initials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-0.5">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-muted-foreground text-xs">{user.email}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StatusBadge status={user.status} />
                <p className="text-muted-foreground text-xs">{formatDate(user.createdAt, locale)}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
