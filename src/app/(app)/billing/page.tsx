import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { CurrentPlanCard } from "@/components/billing/current-plan-card";
import { InvoicesTable } from "@/components/billing/invoices-table";
import { PlansGrid } from "@/components/billing/plans-grid";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage() {
  const t = await getTranslations("billing.page");
  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <CurrentPlanCard />
      <PlansGrid />
      <InvoicesTable />
    </div>
  );
}
