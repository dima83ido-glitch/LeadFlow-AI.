"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import type { Locale } from "@/i18n/config";
import type { AdminPayment } from "@/types/admin";
import { confirmCryptoPayment } from "@/lib/actions/admin-payments";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/data-table";
import { getAdminPaymentsColumns } from "@/components/admin/admin-payments-columns";

type StatusFilter = "all" | "SUCCEEDED" | "FAILED" | "REFUNDED" | "PENDING";

export function AdminPaymentsView({ payments }: { payments: AdminPayment[] }) {
  const t = useTranslations("admin.payments");
  const tStatus = useTranslations("common.statusLabels");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [confirmingId, setConfirmingId] = React.useState<string | null>(null);

  const filters: { label: string; value: StatusFilter }[] = [
    { label: t("filters.all"), value: "all" },
    { label: tStatus("SUCCEEDED"), value: "SUCCEEDED" },
    { label: tStatus("FAILED"), value: "FAILED" },
    { label: tStatus("REFUNDED"), value: "REFUNDED" },
    { label: tStatus("PENDING"), value: "PENDING" },
  ];

  async function handleConfirm(paymentId: string) {
    setConfirmingId(paymentId);
    const result = await confirmCryptoPayment(paymentId);
    setConfirmingId(null);
    if (result.ok) {
      toast.success(t("confirmedToast"));
      router.refresh();
    } else {
      toast.error(tc("genericErrorToast"));
    }
  }

  const filtered = payments.filter((p) => status === "all" || p.status === status);
  const columns = getAdminPaymentsColumns(
    {
      workspace: t("columns.workspace"),
      amount: t("columns.amount"),
      status: t("columns.status"),
      description: t("columns.description"),
      date: t("columns.date"),
      method: t("columns.method"),
      txHash: t("columns.txHash"),
      actions: t("columns.actions"),
      methodCard: t("method.CARD"),
      methodCrypto: t("method.CRYPTO"),
      confirmCrypto: t("confirmCrypto"),
      noTxHash: t("noTxHash"),
    },
    locale,
    handleConfirm,
    confirmingId,
  );

  return (
    <div className="space-y-4">
      <Tabs value={status} onValueChange={(value) => setStatus(value as StatusFilter)}>
        <TabsList>
          {filters.map((filter) => (
            <TabsTrigger key={filter.value} value={filter.value}>
              {filter.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
