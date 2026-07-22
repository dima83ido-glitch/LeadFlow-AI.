"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Pause, Pencil, Play, Trash2 } from "lucide-react";

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

export const campaignsColumns: ColumnDef<Campaign>[] = [
  {
    accessorKey: "name",
    header: "Campaign",
    cell: ({ row }) => {
      const campaign = row.original;
      return (
        <div>
          <p className="font-medium">{campaign.name}</p>
          <p className="text-muted-foreground max-w-xs truncate text-xs">
            {campaign.subject || "No subject yet"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "progress",
    header: "Progress",
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
            {campaign.sentCount} / {campaign.recipientCount} sent
          </p>
        </div>
      );
    },
  },
  {
    id: "performance",
    header: "Opens / Replies",
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
    header: "Last updated",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {formatDistanceToNow(new Date(row.original.updatedAt), { addSuffix: true })}
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
            Edit campaign
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Play />
            Resume
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Pause />
            Pause
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
