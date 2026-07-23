import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { AdminStatCards } from "@/components/admin/admin-stat-cards";
import { PlanDistributionChart } from "@/components/admin/plan-distribution-chart";
import { UserGrowthChart } from "@/components/admin/user-growth-chart";

export const metadata: Metadata = { title: "Statistics" };

export default async function AdminStatisticsPage() {
  const t = await getTranslations("admin.statistics");
  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <AdminStatCards />
      <UserGrowthChart />
      <PlanDistributionChart />
    </div>
  );
}
