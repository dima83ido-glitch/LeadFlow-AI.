"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ShieldOff, Trash2, UserCheck } from "lucide-react";
import { toast } from "sonner";

import type { AdminUser } from "@/types/admin";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/status-badge";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export const adminUsersColumns: ColumnDef<AdminUser>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">{initials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-muted-foreground text-xs">{user.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant={row.original.role === "ADMIN" ? "default" : "secondary"}>
        {row.original.role === "ADMIN" ? "Admin" : "User"}
      </Badge>
    ),
  },
  {
    accessorKey: "plan",
    header: "Plan",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">{formatDate(row.original.createdAt)}</span>
    ),
  },
  {
    accessorKey: "lastActiveAt",
    header: "Last active",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.lastActiveAt ? formatDate(row.original.lastActiveAt) : "—"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8" />}>
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {user.status === "SUSPENDED" ? (
              <DropdownMenuItem onClick={() => toast.success(`${user.name} was reactivated.`)}>
                <UserCheck />
                Activate
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => toast.success(`${user.name} was suspended.`)}>
                <ShieldOff />
                Suspend
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => toast.success(`${user.name} was deleted.`)}
            >
              <Trash2 />
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
