import type { Metadata } from "next";

import { mockAdminSubscriptions } from "@/lib/mock/admin";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { adminSubscriptionsColumns } from "@/components/admin/admin-subscriptions-columns";

export const metadata: Metadata = { title: "Subscriptions" };

export default function AdminSubscriptionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Subscriptions" description="All active and past workspace subscriptions." />
      <DataTable columns={adminSubscriptionsColumns} data={mockAdminSubscriptions} />
    </div>
  );
}
