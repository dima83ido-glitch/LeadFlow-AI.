import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getAiUsageStats } from "@/lib/admin/queries";
import { PageHeader } from "@/components/shared/page-header";
import { AiUsageStatCards } from "@/components/admin/ai-usage-stat-cards";
import { AiUsageDailyChart } from "@/components/admin/ai-usage-daily-chart";
import { AiUsageByToolChart } from "@/components/admin/ai-usage-by-tool-chart";

export const metadata: Metadata = { title: "AI Usage" };

export default async function AdminAiUsagePage() {
  const t = await getTranslations("admin.aiUsage");
  const stats = await getAiUsageStats();

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <AiUsageStatCards stats={stats} />
      <AiUsageDailyChart data={stats.daily} />
      <AiUsageByToolChart data={stats.byTool} />
    </div>
  );
}
