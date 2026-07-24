import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/db";
import { getCurrentWorkspaceId, requireSession } from "@/lib/workspace";
import { getDashboardStats, getRecentActivity, getRecentCampaigns } from "@/lib/dashboard/queries";
import { PageHeader } from "@/components/shared/page-header";
import { SupportButton } from "@/components/shared/support-button";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RecentCampaigns } from "@/components/dashboard/recent-campaigns";
import { StatCard } from "@/components/dashboard/stat-card";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const session = await requireSession();
  const workspaceId = await getCurrentWorkspaceId();
  const user = await prisma.user.findUnique({ where: { id: session.user.id as string }, select: { name: true } });

  const [stats, activity, campaigns] = await Promise.all([
    getDashboardStats(workspaceId),
    getRecentActivity(workspaceId),
    getRecentCampaigns(workspaceId),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("welcome", { name: user?.name ?? "" })}
        description={t("subtitle")}
        actions={<SupportButton />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.labelKey} stat={stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        <RecentActivity items={activity} />
      </div>

      <RecentCampaigns campaigns={campaigns} />
    </div>
  );
}
