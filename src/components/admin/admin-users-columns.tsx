"use client";

import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ShieldOff, Trash2, UserCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { Locale } from "@/i18n/config";
import type { AdminUser } from "@/types/admin";
import { deleteUser, setUserStatus } from "@/lib/actions/admin-users";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
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
  errorToast: string;
}

function RowActions({ user, t }: { user: AdminUser; t: AdminUsersColumnsMessages }) {
  const router = useRouter();
  const tc = useTranslations("common");

  async function handleToggleStatus() {
    const nextStatus = user.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    const result = await setUserStatus(user.id, nextStatus);
    if (result.ok) {
      toast.success(nextStatus === "ACTIVE" ? t.activatedToast(user.name) : t.suspendedToast(user.name));
      router.refresh();
    } else {
      toast.error(t.errorToast);
    }
  }

  async function handleDelete() {
    const result = await deleteUser(user.id);
    if (result.ok) {
      toast.success(t.deletedToast(user.name));
      router.refresh();
    } else {
      toast.error(t.errorToast);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon" className="size-8" aria-label={tc("actions.actions")} />}
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {user.status === "SUSPENDED" ? (
            <DropdownMenuItem onClick={handleToggleStatus}>
              <UserCheck />
              {t.activate}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleToggleStatus}>
              <ShieldOff />
              {t.suspend}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive size-8"
            aria-label={t.deleteUser}
          >
            <Trash2 className="size-4" />
          </Button>
        }
        title={t.deleteUser}
        description={t.deletedToast(user.name)}
        confirmLabel={t.deleteUser}
        onConfirm={handleDelete}
      />
    </div>
  );
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
      cell: ({ row }) => <RowActions user={row.original} t={t} />,
    },
  ];
}
