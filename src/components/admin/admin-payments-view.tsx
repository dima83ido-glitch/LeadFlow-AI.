"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";

import type { Locale } from "@/i18n/config";
import type { AdminPayment } from "@/types/admin";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/data-table";
import { getAdminPaymentsColumns } from "@/components/admin/admin-payments-columns";

type StatusFilter = "all" | "SUCCEEDED" | "FAILED" | "REFUNDED" | "PENDING";

export function AdminPaymentsView({ payments }: { payments: AdminPayment[] }) {
  const t = useTranslations("admin.payments");
  const tStatus = useTranslations("common.statusLabels");
  const locale = useLocale() as Locale;
  const [status, setStatus] = React.useState<StatusFilter>("all");

  const filters: { label: string; value: StatusFilter }[] = [
    { label: t("filters.all"), value: "all" },
    { label: tStatus("SUCCEEDED"), value: "SUCCEEDED" },
    { label: tStatus("FAILED"), value: "FAILED" },
    { label: tStatus("REFUNDED"), value: "REFUNDED" },
    { label: tStatus("PENDING"), value: "PENDING" },
  ];

  const filtered = payments.filter((p) => status === "all" || p.status === status);
  const columns = getAdminPaymentsColumns(
    {
      workspace: t("columns.workspace"),
      amount: t("columns.amount"),
      status: t("columns.status"),
      description: t("columns.description"),
      date: t("columns.date"),
    },
    locale,
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
