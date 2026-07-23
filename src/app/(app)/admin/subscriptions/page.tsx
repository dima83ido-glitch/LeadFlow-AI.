import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { AdminSubscriptionsView } from "@/components/admin/admin-subscriptions-view";

export const metadata: Metadata = { title: "Subscriptions" };

export default async function AdminSubscriptionsPage() {
  const t = await getTranslations("admin.subscriptions");
  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <AdminSubscriptionsView />
    </div>
  );
}
