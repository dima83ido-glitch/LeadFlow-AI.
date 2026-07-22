"use client";

import * as React from "react";
import { Building2 } from "lucide-react";

import { mockCompanies } from "@/lib/mock/companies";
import type { Company } from "@/types/company";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { companiesColumns } from "@/components/crm/companies-columns";
import { CompanyDetailSheet } from "@/components/crm/company-detail-sheet";

export function CompaniesView() {
  const [selected, setSelected] = React.useState<Company | null>(null);
  const [open, setOpen] = React.useState(false);

  if (mockCompanies.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No companies yet"
        description="Companies you add contacts or deals for will show up here."
      />
    );
  }

  return (
    <>
      <DataTable
        columns={companiesColumns}
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
