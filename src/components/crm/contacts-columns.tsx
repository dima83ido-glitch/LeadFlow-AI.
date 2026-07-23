"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { Locale } from "@/i18n/config";
import type { Contact } from "@/types/company";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

function initials(firstName: string, lastName?: string) {
  return `${firstName[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

export function getContactsColumns(
  t: ReturnType<typeof useTranslations>,
  locale: Locale,
): ColumnDef<Contact>[] {
  return [
    {
      id: "name",
      header: t("crm.contacts.columns.contact"),
      cell: ({ row }) => {
        const contact = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarFallback className="text-xs">
                {initials(contact.firstName, contact.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {contact.firstName} {contact.lastName ?? ""}
              </p>
              <p className="text-muted-foreground text-xs">{contact.jobTitle ?? "—"}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "companyName",
      header: t("crm.contacts.columns.company"),
      cell: ({ row }) => <span className="text-sm">{row.original.companyName ?? "—"}</span>,
    },
    {
      accessorKey: "email",
      header: t("crm.contacts.columns.email"),
      cell: ({ row }) =>
        row.original.email ? (
          <a href={`mailto:${row.original.email}`} className="text-sm hover:underline">
            {row.original.email}
          </a>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        ),
    },
    {
      accessorKey: "phone",
      header: t("crm.contacts.columns.phone"),
      cell: ({ row }) => <span className="text-sm">{row.original.phone ?? "—"}</span>,
    },
    {
      accessorKey: "createdAt",
      header: t("crm.contacts.columns.added"),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{formatDate(row.original.createdAt, locale)}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const contact = row.original;
        const fullName = `${contact.firstName} ${contact.lastName ?? ""}`.trim();
        return (
          <div className="flex items-center justify-end gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8" />}>
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toast.info(t("crm.common.editNotWired"))}>
                  <Pencil />
                  {t("common.actions.edit")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ConfirmDialog
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive size-8"
                >
                  <Trash2 className="size-4" />
                </Button>
              }
              title={t("crm.contacts.deleteTitle")}
              description={t("crm.contacts.deleteDescription", { name: fullName })}
              confirmLabel={t("crm.contacts.deleteConfirm")}
              onConfirm={() => toast.success(t("crm.contacts.deletedToast", { name: contact.firstName }))}
            />
          </div>
        );
      },
    },
  ];
}
