"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import type { Locale } from "@/i18n/config";
import { mockPromoCodes } from "@/lib/mock/admin";
import type { PromoCode } from "@/types/admin";
import { DataTable } from "@/components/shared/data-table";
import { CreatePromoCodeDialog } from "@/components/admin/create-promo-code-dialog";
import { getPromoCodesColumns } from "@/components/admin/promo-codes-columns";

export function PromoCodesView() {
  const t = useTranslations("admin.promoCodes");
  const locale = useLocale() as Locale;
  const [promoCodes, setPromoCodes] = React.useState<PromoCode[]>(mockPromoCodes);

  function handleToggleActive(id: string, active: boolean) {
    setPromoCodes((prev) => prev.map((p) => (p.id === id ? { ...p, active } : p)));
  }

  function handleDelete(id: string) {
    const promo = promoCodes.find((p) => p.id === id);
    setPromoCodes((prev) => prev.filter((p) => p.id !== id));
    if (promo) toast.success(t("deletedToast", { code: promo.code }));
  }

  function handleCreate(code: string, discountPercent: number) {
    setPromoCodes((prev) => [
      { id: `promo_${Date.now()}`, code, discountPercent, redemptions: 0, active: true },
      ...prev,
    ]);
  }

  const columns = getPromoCodesColumns(
    handleToggleActive,
    handleDelete,
    {
      code: t("columns.code"),
      discount: t("columns.discount"),
      redemptions: t("columns.redemptions"),
      expires: t("columns.expires"),
      active: t("columns.active"),
      never: t("columns.never"),
      deleteTitle: t("deleteDialog.title"),
      deleteDescription: (code: string) => t("deleteDialog.description", { code }),
      deleteConfirmLabel: t("deleteDialog.confirmLabel"),
    },
    locale,
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreatePromoCodeDialog onCreate={handleCreate} />
      </div>
      <DataTable columns={columns} data={promoCodes} />
    </div>
  );
}
