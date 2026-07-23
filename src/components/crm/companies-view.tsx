"use client";

import * as React from "react";
import { Building2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { Locale } from "@/i18n/config";
import { mockCompanies } from "@/lib/mock/companies";
import type { Company } from "@/types/company";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { getCompaniesColumns } from "@/components/crm/companies-columns";
import { CompanyDetailSheet } from "@/components/crm/company-detail-sheet";

export function CompaniesView() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [selected, setSelected] = React.useState<Company | null>(null);
  const [open, setOpen] = React.useState(false);
  const columns = React.useMemo(() => getCompaniesColumns(t, locale), [t, locale]);

  if (mockCompanies.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title={t("crm.companies.emptyTitle")}
        description={t("crm.companies.emptyDescription")}
      />
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={mockCompanies}
        onRowClick={(company) => {
          setSelected(company);
          setOpen(true);
        }}
      />
      <CompanyDetailSheet company={selected} open={open} onOpenChange={setOpen} />
    </>
  );
}
