"use client";

import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { Locale } from "@/i18n/config";
import type { PromoCode } from "@/types/admin";
import { deletePromoCode, setPromoCodeActive } from "@/lib/actions/admin-promo-codes";
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
  errorToast: string;
}

function ActiveSwitch({ promo, t }: { promo: PromoCode; t: PromoCodesColumnsMessages }) {
  const router = useRouter();
  return (
    <Switch
      checked={promo.active}
      onCheckedChange={async (checked) => {
        const result = await setPromoCodeActive(promo.id, checked);
        if (result.ok) router.refresh();
        else toast.error(t.errorToast);
      }}
    />
  );
}

function DeleteAction({ promo, t }: { promo: PromoCode; t: PromoCodesColumnsMessages }) {
  const router = useRouter();
  return (
    <ConfirmDialog
      trigger={
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive size-8">
          <Trash2 className="size-4" />
        </Button>
      }
      title={t.deleteTitle}
      description={t.deleteDescription(promo.code)}
      confirmLabel={t.deleteConfirmLabel}
      onConfirm={async () => {
        const result = await deletePromoCode(promo.id);
        if (result.ok) router.refresh();
        else toast.error(t.errorToast);
      }}
    />
  );
}

export function getPromoCodesColumns(
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
      cell: ({ row }) => <ActiveSwitch promo={row.original} t={t} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <DeleteAction promo={row.original} t={t} />,
    },
  ];
}
