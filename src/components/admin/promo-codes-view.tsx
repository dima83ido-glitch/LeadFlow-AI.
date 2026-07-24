"use client";

import { useLocale, useTranslations } from "next-intl";

import type { Locale } from "@/i18n/config";
import type { PromoCode } from "@/types/admin";
import { DataTable } from "@/components/shared/data-table";
import { CreatePromoCodeDialog } from "@/components/admin/create-promo-code-dialog";
import { getPromoCodesColumns } from "@/components/admin/promo-codes-columns";

export function PromoCodesView({ promoCodes }: { promoCodes: PromoCode[] }) {
  const t = useTranslations("admin.promoCodes");
  const locale = useLocale() as Locale;

  const columns = getPromoCodesColumns(
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
      errorToast: t("errorToast"),
    },
    locale,
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreatePromoCodeDialog />
      </div>
      <DataTable columns={columns} data={promoCodes} />
    </div>
  );
}
