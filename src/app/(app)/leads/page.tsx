import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/page-header";
import { LeadsSearchView } from "@/components/leads/leads-search-view";

export const metadata: Metadata = { title: "Search Leads" };

export default function LeadsPage() {
  const t = useTranslations("leads.page");

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <LeadsSearchView />
    </div>
  );
}
