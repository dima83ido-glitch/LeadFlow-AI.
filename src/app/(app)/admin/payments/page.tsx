import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/db";
import type { AdminPayment } from "@/types/admin";
import { PageHeader } from "@/components/shared/page-header";
import { AdminPaymentsView } from "@/components/admin/admin-payments-view";

export const metadata: Metadata = { title: "Payments" };

export default async function AdminPaymentsPage() {
  const t = await getTranslations("admin.payments");

  const rows = await prisma.payment.findMany({
    include: { workspace: true, confirmedBy: true },
    orderBy: { createdAt: "desc" },
  });

  const payments: AdminPayment[] = rows.map((row) => ({
    id: row.id,
    workspaceName: row.workspace.name,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    description: row.description ?? undefined,
    method: row.method,
    cryptoAsset: row.cryptoAsset ?? undefined,
    cryptoTxHash: row.cryptoTxHash ?? undefined,
    confirmedAt: row.confirmedAt?.toISOString(),
    confirmedByName: row.confirmedBy?.name ?? row.confirmedBy?.email ?? undefined,
    createdAt: row.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <AdminPaymentsView payments={payments} />
    </div>
  );
}
