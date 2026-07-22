import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { PromoCodesView } from "@/components/admin/promo-codes-view";

export const metadata: Metadata = { title: "Promo Codes" };

export default function PromoCodesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Promo Codes" description="Create and manage discount codes for LeadFlow AI plans." />
      <PromoCodesView />
    </div>
  );
}
