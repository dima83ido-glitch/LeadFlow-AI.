import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { ConversionFunnel } from "@/components/analytics/conversion-funnel";
import { EmailPerformanceChart } from "@/components/analytics/email-performance-chart";
import { LeadsBySourceChart } from "@/components/analytics/leads-by-source-chart";
import { MetricsRow } from "@/components/analytics/metrics-row";
import { RevenueByPlanChart } from "@/components/analytics/revenue-by-plan-chart";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Track outreach performance and revenue across your workspace."
      />
      <MetricsRow />
      <EmailPerformanceChart />
      <div className="grid gap-4 lg:grid-cols-2">
        <LeadsBySourceChart />
        <RevenueByPlanChart />
      </div>
      <ConversionFunnel />
    </div>
  );
}
