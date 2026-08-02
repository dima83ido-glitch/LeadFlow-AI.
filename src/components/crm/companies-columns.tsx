"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { Locale } from "@/i18n/config";
import type { Company } from "@/types/company";
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

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function getCompaniesColumns(
  t: ReturnType<typeof useTranslations>,
  locale: Locale,
): ColumnDef<Company>[] {
  return [
    {
      accessorKey: "name",
      header: t("crm.companies.columns.company"),
      cell: ({ row }) => {
        const company = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarFallback className="text-xs">{initials(company.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{company.name}</p>
              <p className="text-muted-foreground text-xs">{company.industry}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "size",
      header: t("crm.companies.columns.size"),
      cell: ({ row }) => <span className="text-sm">{row.original.size ?? "—"}</span>,
    },
    {
      id: "location",
      header: t("crm.companies.columns.location"),
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.city}, {row.original.country}
        </span>
      ),
    },
    {
      accessorKey: "dealCount",
      header: t("crm.companies.columns.deals"),
      cell: ({ row }) => <span className="text-sm">{row.original.dealCount}</span>,
    },
    {
      accessorKey: "contactCount",
      header: t("crm.companies.columns.contacts"),
      cell: ({ row }) => <span className="text-sm">{row.original.contactCount}</span>,
    },
    {
      accessorKey: "createdAt",
      header: t("crm.companies.columns.added"),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{formatDate(row.original.createdAt, locale)}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const company = row.original;
        return (
          <div
            className="flex items-center justify-end gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon" className="size-8" aria-label={t("common.actions.actions")} />}
              >
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
              title={t("crm.companies.deleteTitle")}
              description={t("crm.companies.deleteDescription", { name: company.name })}
              confirmLabel={t("crm.companies.deleteConfirm")}
              onConfirm={() => toast.success(t("crm.companies.deletedToast", { name: company.name }))}
            />
          </div>
        );
      },
    },
  ];
}
