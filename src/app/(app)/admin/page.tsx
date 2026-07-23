import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { AdminStatCards } from "@/components/admin/admin-stat-cards";
import { RecentSignups } from "@/components/admin/recent-signups";

export const metadata: Metadata = { title: "Admin Overview" };

export default async function AdminOverviewPage() {
  const t = await getTranslations("admin.dashboard");
  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <AdminStatCards />
      <RecentSignups />
    </div>
  );
}
