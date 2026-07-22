import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { CurrentPlanCard } from "@/components/billing/current-plan-card";
import { InvoicesTable } from "@/components/billing/invoices-table";
import { PlansGrid } from "@/components/billing/plans-grid";

export const metadata: Metadata = { title: "Billing" };

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Billing" description="Manage your subscription, plan, and invoices." />
      <CurrentPlanCard />
      <PlansGrid />
      <InvoicesTable />
    </div>
  );
}
