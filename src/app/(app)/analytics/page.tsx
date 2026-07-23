import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/page-header";
import { ConversionFunnel } from "@/components/analytics/conversion-funnel";
import { EmailPerformanceChart } from "@/components/analytics/email-performance-chart";
import { LeadsBySourceChart } from "@/components/analytics/leads-by-source-chart";
import { MetricsRow } from "@/components/analytics/metrics-row";
import { RevenueByPlanChart } from "@/components/analytics/revenue-by-plan-chart";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  const t = useTranslations("analytics.page");

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
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
