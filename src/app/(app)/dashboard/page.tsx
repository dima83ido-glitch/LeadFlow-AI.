import type { Metadata } from "next";

import { mockDashboardStats } from "@/lib/mock/dashboard";
import { PageHeader } from "@/components/shared/page-header";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RecentCampaigns } from "@/components/dashboard/recent-campaigns";
import { StatCard } from "@/components/dashboard/stat-card";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back, Dmitry"
        description="Here's what's happening across your workspace."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockDashboardStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        <RecentActivity />
      </div>

      <RecentCampaigns />
    </div>
  );
}
