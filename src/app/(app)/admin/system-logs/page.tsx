import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/db";
import type { SystemLog } from "@/types/admin";
import { PageHeader } from "@/components/shared/page-header";
import { SystemLogsView } from "@/components/admin/system-logs-view";

export const metadata: Metadata = { title: "System Logs" };

export default async function SystemLogsPage() {
  const t = await getTranslations("admin.systemLogs");

  const rows = await prisma.systemLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  const logs: SystemLog[] = rows.map((row) => {
    const context = row.context as { source?: string; feature?: string } | null;
    return {
      id: row.id,
      level: row.level,
      message: row.message,
      source: context?.source ?? context?.feature ?? "system",
      createdAt: row.createdAt.toISOString(),
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <SystemLogsView logs={logs} />
    </div>
  );
}
