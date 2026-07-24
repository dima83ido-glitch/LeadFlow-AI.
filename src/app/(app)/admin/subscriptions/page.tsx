import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/db";
import { PLAN_PRICES_CENTS } from "@/lib/plans";
import type { AdminSubscription } from "@/types/admin";
import { PageHeader } from "@/components/shared/page-header";
import { AdminSubscriptionsView } from "@/components/admin/admin-subscriptions-view";

export const metadata: Metadata = { title: "Subscriptions" };

export default async function AdminSubscriptionsPage() {
  const t = await getTranslations("admin.subscriptions");

  const rows = await prisma.subscription.findMany({
    include: { workspace: true },
    orderBy: { createdAt: "desc" },
  });

  const subscriptions: AdminSubscription[] = rows.map((row) => ({
    id: row.id,
    workspaceId: row.workspaceId,
    workspaceName: row.workspace.name,
    plan: row.plan,
    status: row.status,
    mrr: row.status === "ACTIVE" ? PLAN_PRICES_CENTS[row.plan] / 100 : 0,
    renewsAt: row.currentPeriodEnd?.toISOString() ?? null,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <AdminSubscriptionsView subscriptions={subscriptions} />
    </div>
  );
}
