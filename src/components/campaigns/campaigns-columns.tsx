"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Pause, Pencil, Play, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Locale } from "@/i18n/config";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import type { Campaign } from "@/types/campaign";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/shared/status-badge";

export function getCampaignsColumns(
  t: ReturnType<typeof useTranslations>,
  locale: Locale,
): ColumnDef<Campaign>[] {
  return [
    {
      accessorKey: "name",
      header: t("columns.campaign"),
      cell: ({ row }) => {
        const campaign = row.original;
        return (
          <div>
            <p className="font-medium">{campaign.name}</p>
            <p className="text-muted-foreground max-w-xs truncate text-xs">
              {campaign.subject || t("columns.noSubjectYet")}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: t("columns.status"),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "progress",
      header: t("columns.progress"),
      cell: ({ row }) => {
        const campaign = row.original;
        const progress =
          campaign.recipientCount > 0
            ? Math.round((campaign.sentCount / campaign.recipientCount) * 100)
            : 0;
        return (
          <div className="w-36 space-y-1.5">
            <Progress value={progress} className="h-1.5" />
            <p className="text-muted-foreground text-xs">
              {t("columns.sentCount", { sent: campaign.sentCount, total: campaign.recipientCount })}
            </p>
          </div>
        );
      },
    },
    {
      id: "performance",
      header: t("columns.opensReplies"),
      cell: ({ row }) => {
        const campaign = row.original;
        return (
          <span className="text-sm">
            {campaign.openCount} / {campaign.replyCount}
          </span>
        );
      },
    },
    {
      id: "updatedAt",
      header: t("columns.lastUpdated"),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {formatDistanceToNow(new Date(row.original.updatedAt), {
            addSuffix: true,
            locale: getDateFnsLocale(locale),
          })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8" />}>
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Pencil />
              {t("columns.editCampaign")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Play />
              {t("columns.resume")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pause />
              {t("columns.pause")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash2 />
              {t("columns.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
