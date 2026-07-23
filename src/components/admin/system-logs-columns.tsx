"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";

import type { Locale } from "@/i18n/config";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import type { SystemLog } from "@/types/admin";
import { StatusBadge } from "@/components/shared/status-badge";

interface SystemLogsColumnsMessages {
  level: string;
  message: string;
  source: string;
  time: string;
}

export function getSystemLogsColumns(
  t: SystemLogsColumnsMessages,
  locale: Locale,
): ColumnDef<SystemLog>[] {
  return [
    {
      accessorKey: "level",
      header: t.level,
      cell: ({ row }) => <StatusBadge status={row.original.level} />,
    },
    {
      accessorKey: "message",
      header: t.message,
      cell: ({ row }) => <span className="text-sm">{row.original.message}</span>,
    },
    {
      accessorKey: "source",
      header: t.source,
      cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">{row.original.source}</span>,
    },
    {
      accessorKey: "createdAt",
      header: t.time,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {formatDistanceToNow(new Date(row.original.createdAt), {
            addSuffix: true,
            locale: getDateFnsLocale(locale),
          })}
        </span>
      ),
    },
  ];
}
