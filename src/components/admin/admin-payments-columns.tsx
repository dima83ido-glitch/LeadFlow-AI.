"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { Locale } from "@/i18n/config";
import type { AdminPayment } from "@/types/admin";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";

interface AdminPaymentsColumnsMessages {
  workspace: string;
  amount: string;
  status: string;
  description: string;
  date: string;
}

export function getAdminPaymentsColumns(
  t: AdminPaymentsColumnsMessages,
  locale: Locale,
): ColumnDef<AdminPayment>[] {
  return [
    {
      accessorKey: "workspaceName",
      header: t.workspace,
      cell: ({ row }) => <span className="font-medium">{row.original.workspaceName}</span>,
    },
    {
      accessorKey: "amount",
      header: t.amount,
      cell: ({ row }) => formatCurrency(row.original.amount / 100, row.original.currency, locale),
    },
    {
      accessorKey: "status",
      header: t.status,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "description",
      header: t.description,
      cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.description ?? "—"}</span>,
    },
    {
      accessorKey: "createdAt",
      header: t.date,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{formatDate(row.original.createdAt, locale)}</span>
      ),
    },
  ];
}
