"use client";

import { useLocale, useTranslations } from "next-intl";

import type { Locale } from "@/i18n/config";
import type { AdminUser } from "@/types/admin";
import { DataTable } from "@/components/shared/data-table";
import { getAdminUsersColumns } from "@/components/admin/admin-users-columns";

export function AdminUsersView({ users }: { users: AdminUser[] }) {
  const t = useTranslations("admin.users");
  const locale = useLocale() as Locale;
  const columns = getAdminUsersColumns(
    {
      user: t("columns.user"),
      role: t("columns.role"),
      plan: t("columns.plan"),
      status: t("columns.status"),
      joined: t("columns.joined"),
      lastActive: t("columns.lastActive"),
      roleAdmin: t("roleAdmin"),
      roleUser: t("roleUser"),
      activate: t("actions.activate"),
      suspend: t("actions.suspend"),
      deleteUser: t("actions.deleteUser"),
      activatedToast: (name: string) => t("actions.activatedToast", { name }),
      suspendedToast: (name: string) => t("actions.suspendedToast", { name }),
      deletedToast: (name: string) => t("actions.deletedToast", { name }),
      errorToast: t("actions.errorToast"),
    },
    locale,
  );

  return <DataTable columns={columns} data={users} />;
}
