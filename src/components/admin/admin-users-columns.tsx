"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ShieldOff, Trash2, UserCheck } from "lucide-react";
import { toast } from "sonner";

import type { Locale } from "@/i18n/config";
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

interface AdminUsersColumnsMessages {
  user: string;
  role: string;
  plan: string;
  status: string;
  joined: string;
  lastActive: string;
  roleAdmin: string;
  roleUser: string;
  activate: string;
  suspend: string;
  deleteUser: string;
  activatedToast: (name: string) => string;
  suspendedToast: (name: string) => string;
  deletedToast: (name: string) => string;
}

export function getAdminUsersColumns(
  t: AdminUsersColumnsMessages,
  locale: Locale,
): ColumnDef<AdminUser>[] {
  return [
    {
      accessorKey: "name",
      header: t.user,
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
      header: t.role,
      cell: ({ row }) => (
        <Badge variant={row.original.role === "ADMIN" ? "default" : "secondary"}>
          {row.original.role === "ADMIN" ? t.roleAdmin : t.roleUser}
        </Badge>
      ),
    },
    {
      accessorKey: "plan",
      header: t.plan,
    },
    {
      accessorKey: "status",
      header: t.status,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "createdAt",
      header: t.joined,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{formatDate(row.original.createdAt, locale)}</span>
      ),
    },
    {
      accessorKey: "lastActiveAt",
      header: t.lastActive,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.lastActiveAt ? formatDate(row.original.lastActiveAt, locale) : "—"}
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
                <DropdownMenuItem onClick={() => toast.success(t.activatedToast(user.name))}>
                  <UserCheck />
                  {t.activate}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => toast.success(t.suspendedToast(user.name))}>
                  <ShieldOff />
                  {t.suspend}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => toast.success(t.deletedToast(user.name))}
              >
                <Trash2 />
                {t.deleteUser}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
