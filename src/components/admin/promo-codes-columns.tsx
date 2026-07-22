"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";

import type { PromoCode } from "@/types/admin";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

export function getPromoCodesColumns(
  onToggleActive: (id: string, active: boolean) => void,
  onDelete: (id: string) => void,
): ColumnDef<PromoCode>[] {
  return [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => <span className="font-mono text-sm font-medium">{row.original.code}</span>,
    },
    {
      accessorKey: "discountPercent",
      header: "Discount",
      cell: ({ row }) => `${row.original.discountPercent}%`,
    },
    {
      id: "redemptions",
      header: "Redemptions",
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
      header: "Expires",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.expiresAt ? formatDate(row.original.expiresAt) : "Never"}
        </span>
      ),
    },
    {
      id: "active",
      header: "Active",
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
          title="Delete this promo code?"
          description={`"${row.original.code}" will be permanently deleted and can no longer be redeemed.`}
          confirmLabel="Delete code"
          onConfirm={() => onDelete(row.original.id)}
        />
      ),
    },
  ];
}
