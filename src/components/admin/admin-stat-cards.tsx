"use client";

import { Activity, CreditCard, TrendingUp, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { Locale } from "@/i18n/config";
import { mockAdminSubscriptions, mockAdminUsers } from "@/lib/mock/admin";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function AdminStatCards() {
  const t = useTranslations("admin.dashboard.stats");
  const locale = useLocale() as Locale;
  const totalUsers = mockAdminUsers.length;
  const activeUsers = mockAdminUsers.filter((u) => u.status === "ACTIVE").length;
  const mrr = mockAdminSubscriptions.reduce((sum, sub) => sum + sub.mrr, 0);
  const activeSubs = mockAdminSubscriptions.filter((s) => s.status === "ACTIVE").length;

  const stats = [
    { label: t("totalUsers"), value: totalUsers.toString(), icon: Users },
    { label: t("activeUsers"), value: activeUsers.toString(), icon: Activity },
    { label: t("mrr"), value: formatCurrency(mrr, undefined, locale), icon: TrendingUp },
    { label: t("activeSubscriptions"), value: activeSubs.toString(), icon: CreditCard },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
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
