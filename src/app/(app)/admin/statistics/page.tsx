import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { AdminStatCards } from "@/components/admin/admin-stat-cards";
import { PlanDistributionChart } from "@/components/admin/plan-distribution-chart";
import { UserGrowthChart } from "@/components/admin/user-growth-chart";

export const metadata: Metadata = { title: "Statistics" };

export default function AdminStatisticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Statistics" description="Platform-wide growth and revenue trends." />
      <AdminStatCards />
      <UserGrowthChart />
      <PlanDistributionChart />
    </div>
  );
}
