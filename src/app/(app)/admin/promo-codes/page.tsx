import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/db";
import type { PromoCode } from "@/types/admin";
import { PageHeader } from "@/components/shared/page-header";
import { PromoCodesView } from "@/components/admin/promo-codes-view";

export const metadata: Metadata = { title: "Promo Codes" };

export default async function PromoCodesPage() {
  const t = await getTranslations("admin.promoCodes");

  const rows = await prisma.promoCode.findMany({ orderBy: { createdAt: "desc" } });

  const promoCodes: PromoCode[] = rows.map((row) => ({
    id: row.id,
    code: row.code,
    discountPercent: row.discountPercent,
    redemptions: row.redemptions,
    maxRedemptions: row.maxRedemptions ?? undefined,
    expiresAt: row.expiresAt?.toISOString(),
    active: row.active,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <PromoCodesView promoCodes={promoCodes} />
    </div>
  );
}
