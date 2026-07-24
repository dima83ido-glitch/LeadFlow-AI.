"use client";

import { useLocale, useTranslations } from "next-intl";

import type { Locale } from "@/i18n/config";
import type { AdminSubscription } from "@/types/admin";
import { DataTable } from "@/components/shared/data-table";
import { getAdminSubscriptionsColumns } from "@/components/admin/admin-subscriptions-columns";

export function AdminSubscriptionsView({ subscriptions }: { subscriptions: AdminSubscription[] }) {
  const t = useTranslations("admin.subscriptions");
  const tc = useTranslations("admin.subscriptions.columns");
  const locale = useLocale() as Locale;
  const columns = getAdminSubscriptionsColumns(
    {
      workspace: tc("workspace"),
      plan: tc("plan"),
      status: tc("status"),
      mrr: tc("mrr"),
      renews: tc("renews"),
      activate: t("actions.activate"),
      disable: t("actions.disable"),
      extend: t("actions.extend"),
      grantFreeAccess: t("actions.grantFreeAccess"),
      errorToast: t("actions.errorToast"),
      updatedToast: t("actions.updatedToast"),
    },
    locale,
  );

  return <DataTable columns={columns} data={subscriptions} />;
}
