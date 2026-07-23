import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { AdminUsersView } from "@/components/admin/admin-users-view";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const t = await getTranslations("admin.users");
  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <AdminUsersView />
    </div>
  );
}
