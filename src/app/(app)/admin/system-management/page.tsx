import { readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/shared/page-header";
import { PlanConfigEditor, type PlanConfigItem } from "@/components/admin/plan-config-editor";
import { FeatureFlagsEditor } from "@/components/admin/feature-flags-editor";
import { SystemInfoCard } from "@/components/admin/system-info-card";

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

export default async function SystemManagementPage() {
  const t = await getTranslations("admin.systemManagement");

  const [planConfigRows, featureFlagRows, dbHealthy] = await Promise.all([
    prisma.planConfig.findMany({ orderBy: { priceCents: "asc" } }),
    prisma.featureFlag.findMany({ orderBy: { key: "asc" } }),
    checkDbHealth(),
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
      <FeatureFlagsEditor flags={featureFlags} />
      <PlanConfigEditor configs={planConfigs} />
    </div>
  );
}
