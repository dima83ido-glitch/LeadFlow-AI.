import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import {
  getAdminStats,
  getFeatureUsage,
  getPlanDistribution,
  getRevenueByPlan,
  getUserGrowth,
} from "@/lib/admin/queries";
import { PageHeader } from "@/components/shared/page-header";
import { AdminStatCards } from "@/components/admin/admin-stat-cards";
import { FeatureUsageChart } from "@/components/admin/feature-usage-chart";
import { PlanDistributionChart } from "@/components/admin/plan-distribution-chart";
import { ServiceAnalyticsCards } from "@/components/admin/service-analytics-cards";
import { UserGrowthChart } from "@/components/admin/user-growth-chart";
import { RevenueByPlanChart } from "@/components/analytics/revenue-by-plan-chart";

export const metadata: Metadata = { title: "Statistics" };

export default async function AdminStatisticsPage() {
  const t = await getTranslations("admin.statistics");

  const [stats, userGrowth, planDistribution, revenueByPlan, featureUsage] = await Promise.all([
    getAdminStats(),
    getUserGrowth(),
    getPlanDistribution(),
    getRevenueByPlan(),
    getFeatureUsage(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <AdminStatCards stats={stats} />
      <ServiceAnalyticsCards
        newRegistrations={stats.newRegistrations}
        arr={stats.arr}
        paidConversionRate={stats.paidConversionRate}
      />
      <UserGrowthChart data={userGrowth} />
      <div className="grid gap-4 lg:grid-cols-2">
        <PlanDistributionChart data={planDistribution} />
        <RevenueByPlanChart data={revenueByPlan} />
      </div>
      <FeatureUsageChart data={featureUsage} />
    </div>
  );
}
