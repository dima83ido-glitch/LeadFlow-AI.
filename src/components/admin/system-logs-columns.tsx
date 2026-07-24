"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { Locale } from "@/i18n/config";
import type { SystemLog } from "@/types/admin";
import { RelativeTime } from "@/components/shared/relative-time";
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
          <RelativeTime date={row.original.createdAt} locale={locale} />
        </span>
      ),
    },
  ];
}
