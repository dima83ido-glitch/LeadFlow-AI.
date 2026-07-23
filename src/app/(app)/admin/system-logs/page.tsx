import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { SystemLogsView } from "@/components/admin/system-logs-view";

export const metadata: Metadata = { title: "System Logs" };

export default async function SystemLogsPage() {
  const t = await getTranslations("admin.systemLogs");
  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <SystemLogsView />
    </div>
  );
}
