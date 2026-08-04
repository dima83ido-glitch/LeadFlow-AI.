import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/db";
import { getCurrentWorkspaceRecord, requireWorkspace } from "@/lib/workspace";
import {
  getDashboardStats,
  getRecentActivity,
  getRecentCampaigns,
  getWorkspaceOverview,
} from "@/lib/dashboard/queries";
import { generatePersonalization } from "@/lib/actions/ai-personalization";
import type { PersonalizationResult } from "@/lib/ai/schemas";
import { Separator } from "@/components/ui/separator";
import { SupportButton } from "@/components/shared/support-button";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { PersonalizationPanel } from "@/components/dashboard/personalization-panel";
import { PlatformGuide } from "@/components/dashboard/platform-guide";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RecentCampaigns } from "@/components/dashboard/recent-campaigns";
import { StatCard } from "@/components/dashboard/stat-card";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const { workspaceId, userId, workspaceRole } = await requireWorkspace();
  const workspaceRecord = await getCurrentWorkspaceRecord();

  let personalization = workspaceRecord.personalization as PersonalizationResult | null;
  let personalizationUnavailable = false;
  if (workspaceRecord.hasExistingBusiness && workspaceRecord.businessType && !personalization) {
    const result = await generatePersonalization(workspaceRecord.businessType);
    if (result.ok) {
      personalization = result.data;
    } else {
      personalizationUnavailable = true;
    }
  }

  const [user, overview, stats, activity, campaigns] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, jobTitle: true, image: true, emailVerified: true, createdAt: true },
    }),
    getWorkspaceOverview(workspaceId),
    getDashboardStats(workspaceId),
    getRecentActivity(workspaceId),
    getRecentCampaigns(workspaceId),
  ]);

  const profileFields = [user?.name, user?.jobTitle, user?.image, user?.emailVerified];
  const profileCompleteness = Math.round(
    (profileFields.filter(Boolean).length / profileFields.length) * 100,
  );

  return (
    <div className="space-y-10">
      <DashboardHero
        name={user?.name ?? ""}
        workspaceRole={workspaceRole}
        memberSince={user?.createdAt ?? new Date()}
        overview={overview}
      />

      <Separator />

      <PlatformGuide overview={overview} profileCompleteness={profileCompleteness} />

      <PersonalizationPanel
        hasExistingBusiness={workspaceRecord.hasExistingBusiness}
        businessType={workspaceRecord.businessType}
        personalization={personalization}
        personalizationUnavailable={personalizationUnavailable}
      />

      <Separator />

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="font-heading text-lg font-semibold tracking-tight">{t("activitySection.title")}</h2>
            <p className="text-muted-foreground text-sm">{t("activitySection.subtitle")}</p>
          </div>
          <SupportButton />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={stat.labelKey} stat={stat} index={index} />
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
    </div>
  );
}
