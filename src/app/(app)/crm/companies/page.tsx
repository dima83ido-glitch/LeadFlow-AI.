import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/page-header";
import { CompaniesView } from "@/components/crm/companies-view";

export const metadata: Metadata = { title: "Companies" };

export default function CompaniesPage() {
  const t = useTranslations("crm.companies");

  return (
    <div className="space-y-6">
      <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
      <CompaniesView />
    </div>
  );
}
