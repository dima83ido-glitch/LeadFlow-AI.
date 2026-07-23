"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { Locale } from "@/i18n/config";
import type { AdminSubscription } from "@/types/admin";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";

export function getAdminSubscriptionsColumns(
  t: (key: string) => string,
  locale: Locale,
): ColumnDef<AdminSubscription>[] {
  return [
    {
      accessorKey: "workspaceName",
      header: t("workspace"),
      cell: ({ row }) => <span className="font-medium">{row.original.workspaceName}</span>,
    },
    {
      accessorKey: "plan",
      header: t("plan"),
      cell: ({ row }) => <Badge variant="secondary">{row.original.plan}</Badge>,
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "mrr",
      header: t("mrr"),
      cell: ({ row }) => formatCurrency(row.original.mrr, undefined, locale),
    },
    {
      accessorKey: "renewsAt",
      header: t("renews"),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{formatDate(row.original.renewsAt, locale)}</span>
      ),
    },
  ];
}
