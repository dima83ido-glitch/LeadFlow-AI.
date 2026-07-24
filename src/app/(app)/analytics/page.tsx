import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getCurrentWorkspaceId } from "@/lib/workspace";
import {
  getAnalyticsMetrics,
  getDealSuccessRate,
  getEmailPerformance,
  getLeadsBySource,
  getLeadTrends,
  getMeetingStats,
  getSalesFunnel,
  getTaskStats,
  getTimeBasedPerformance,
} from "@/lib/analytics/queries";
import { PageHeader } from "@/components/shared/page-header";
import { ConversionFunnel } from "@/components/analytics/conversion-funnel";
import { DealSuccessRateChart } from "@/components/analytics/deal-success-rate-chart";
import { EmailPerformanceChart } from "@/components/analytics/email-performance-chart";
import { LeadTrendChart } from "@/components/analytics/lead-trend-chart";
import { LeadsBySourceChart } from "@/components/analytics/leads-by-source-chart";
import { MeetingStatsChart } from "@/components/analytics/meeting-stats-chart";
import { MetricsRow } from "@/components/analytics/metrics-row";
import { TaskStatsChart } from "@/components/analytics/task-stats-chart";
import { TimeBasedPerformanceChart } from "@/components/analytics/time-based-performance-chart";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const t = await getTranslations("analytics.page");
  const workspaceId = await getCurrentWorkspaceId();

  const [metrics, leadTrends, emailPerformance, leadsBySource, salesFunnel, meetingStats, taskStats, dealSuccessRate, timeBasedPerformance] =
    await Promise.all([
      getAnalyticsMetrics(workspaceId),
      getLeadTrends(workspaceId),
      getEmailPerformance(workspaceId),
      getLeadsBySource(workspaceId),
      getSalesFunnel(workspaceId),
      getMeetingStats(workspaceId),
      getTaskStats(workspaceId),
      getDealSuccessRate(workspaceId),
      getTimeBasedPerformance(workspaceId),
    ]);

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <MetricsRow metrics={metrics} />
      <LeadTrendChart data={leadTrends} />
      <EmailPerformanceChart data={emailPerformance} />
      <div className="grid gap-4 lg:grid-cols-2">
        <LeadsBySourceChart data={leadsBySource} />
        <DealSuccessRateChart stats={dealSuccessRate} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <MeetingStatsChart stats={meetingStats} />
        <TaskStatsChart stats={taskStats} />
      </div>
      <ConversionFunnel stages={salesFunnel} />
      <TimeBasedPerformanceChart data={timeBasedPerformance} />
    </div>
  );
}
