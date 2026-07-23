"use client";

import { useLocale, useTranslations } from "next-intl";

import type { Locale } from "@/i18n/config";
import { mockAdminSubscriptions } from "@/lib/mock/admin";
import { DataTable } from "@/components/shared/data-table";
import { getAdminSubscriptionsColumns } from "@/components/admin/admin-subscriptions-columns";

export function AdminSubscriptionsView() {
  const t = useTranslations("admin.subscriptions.columns");
  const locale = useLocale() as Locale;
  const columns = getAdminSubscriptionsColumns(t, locale);

  return <DataTable columns={columns} data={mockAdminSubscriptions} />;
}
