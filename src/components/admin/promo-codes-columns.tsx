"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";

import type { Locale } from "@/i18n/config";
import type { PromoCode } from "@/types/admin";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

interface PromoCodesColumnsMessages {
  code: string;
  discount: string;
  redemptions: string;
  expires: string;
  active: string;
  never: string;
  deleteTitle: string;
  deleteDescription: (code: string) => string;
  deleteConfirmLabel: string;
}

export function getPromoCodesColumns(
  onToggleActive: (id: string, active: boolean) => void,
  onDelete: (id: string) => void,
  t: PromoCodesColumnsMessages,
  locale: Locale,
): ColumnDef<PromoCode>[] {
  return [
    {
      accessorKey: "code",
      header: t.code,
      cell: ({ row }) => <span className="font-mono text-sm font-medium">{row.original.code}</span>,
    },
    {
      accessorKey: "discountPercent",
      header: t.discount,
      cell: ({ row }) => `${row.original.discountPercent}%`,
    },
    {
      id: "redemptions",
      header: t.redemptions,
      cell: ({ row }) => {
        const promo = row.original;
        return (
          <span className="text-sm">
            {promo.redemptions}
            {promo.maxRedemptions ? ` / ${promo.maxRedemptions}` : ""}
          </span>
        );
      },
    },
    {
      accessorKey: "expiresAt",
      header: t.expires,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.expiresAt ? formatDate(row.original.expiresAt, locale) : t.never}
        </span>
      ),
    },
    {
      id: "active",
      header: t.active,
      cell: ({ row }) => (
        <Switch
          checked={row.original.active}
          onCheckedChange={(checked) => onToggleActive(row.original.id, checked)}
        />
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <ConfirmDialog
          trigger={
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive size-8">
              <Trash2 className="size-4" />
            </Button>
          }
          title={t.deleteTitle}
          description={t.deleteDescription(row.original.code)}
          confirmLabel={t.deleteConfirmLabel}
          onConfirm={() => onDelete(row.original.id)}
        />
      ),
    },
  ];
}
