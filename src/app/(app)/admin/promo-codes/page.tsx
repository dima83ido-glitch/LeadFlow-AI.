import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { PromoCodesView } from "@/components/admin/promo-codes-view";

export const metadata: Metadata = { title: "Promo Codes" };

export default async function PromoCodesPage() {
  const t = await getTranslations("admin.promoCodes");
  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <PromoCodesView />
    </div>
  );
}
