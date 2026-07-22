"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";

import type { SystemLog } from "@/types/admin";
import { StatusBadge } from "@/components/shared/status-badge";

export const systemLogsColumns: ColumnDef<SystemLog>[] = [
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => <StatusBadge status={row.original.level} />,
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => <span className="text-sm">{row.original.message}</span>,
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">{row.original.source}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Time",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true })}
      </span>
    ),
  },
];
