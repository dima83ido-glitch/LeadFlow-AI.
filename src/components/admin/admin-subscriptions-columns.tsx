"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { AdminSubscription } from "@/types/admin";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";

export const adminSubscriptionsColumns: ColumnDef<AdminSubscription>[] = [
  {
    accessorKey: "workspaceName",
    header: "Workspace",
    cell: ({ row }) => <span className="font-medium">{row.original.workspaceName}</span>,
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => <Badge variant="secondary">{row.original.plan}</Badge>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "mrr",
    header: "MRR",
    cell: ({ row }) => formatCurrency(row.original.mrr),
  },
  {
    accessorKey: "renewsAt",
    header: "Renews",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">{formatDate(row.original.renewsAt)}</span>
    ),
  },
];
