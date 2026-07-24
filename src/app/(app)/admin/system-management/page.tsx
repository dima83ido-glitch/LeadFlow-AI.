import { readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/shared/page-header";
import { PlanConfigEditor, type PlanConfigItem } from "@/components/admin/plan-config-editor";
import { FeatureFlagsEditor } from "@/components/admin/feature-flags-editor";
import { SystemInfoCard } from "@/components/admin/system-info-card";
import { DbStatsCard } from "@/components/admin/db-stats-card";

export const metadata: Metadata = { title: "System Management" };

function getAppVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync(path.join(process.cwd(), "package.json"), "utf-8"));
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

async function checkDbHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

async function getDbStats(rowLabels: Record<string, string>) {
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [users, workspaces, leads, tasks, payments, systemLogs, errorsLast24h] = await Promise.all([
    prisma.user.count(),
    prisma.workspace.count(),
    prisma.lead.count(),
    prisma.task.count(),
    prisma.payment.count(),
    prisma.systemLog.count(),
    prisma.systemLog.count({ where: { level: "ERROR", createdAt: { gte: since24h } } }),
  ]);

  const memory = process.memoryUsage();

  return {
    rowCounts: [
      { label: rowLabels.users, count: users },
      { label: rowLabels.workspaces, count: workspaces },
      { label: rowLabels.leads, count: leads },
      { label: rowLabels.tasks, count: tasks },
      { label: rowLabels.payments, count: payments },
      { label: rowLabels.systemLogs, count: systemLogs },
    ],
    memoryUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
    memoryTotalMb: Math.round(memory.heapTotal / 1024 / 1024),
    errorsLast24h,
  };
}

export default async function SystemManagementPage() {
  const t = await getTranslations("admin.systemManagement");

  const [planConfigRows, featureFlagRows, dbHealthy, dbStats] = await Promise.all([
    prisma.planConfig.findMany({ orderBy: { priceCents: "asc" } }),
    prisma.featureFlag.findMany({ orderBy: { key: "asc" } }),
    checkDbHealth(),
    getDbStats({
      users: t("dbStats.rowLabels.users"),
      workspaces: t("dbStats.rowLabels.workspaces"),
      leads: t("dbStats.rowLabels.leads"),
      tasks: t("dbStats.rowLabels.tasks"),
      payments: t("dbStats.rowLabels.payments"),
      systemLogs: t("dbStats.rowLabels.systemLogs"),
    }),
  ]);

  const planConfigs: PlanConfigItem[] = planConfigRows.map((row) => ({
    plan: row.plan,
    priceCents: row.priceCents,
    leadSearchLimit: row.leadSearchLimit,
    campaignLimit: row.campaignLimit,
    aiToolLimit: row.aiToolLimit,
    seatsLimit: row.seatsLimit,
    isActive: row.isActive,
  }));

  const featureFlags = featureFlagRows.map((row) => ({
    key: row.key,
    label: row.label,
    description: row.description,
    enabled: row.enabled,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <SystemInfoCard
        info={{
          appVersion: getAppVersion(),
          nodeEnv: process.env.NODE_ENV,
          nodeVersion: process.version,
          uptimeSeconds: process.uptime(),
          dbHealthy,
        }}
      />
      <DbStatsCard stats={dbStats} />
      <FeatureFlagsEditor flags={featureFlags} />
      <PlanConfigEditor configs={planConfigs} />
    </div>
  );
}
