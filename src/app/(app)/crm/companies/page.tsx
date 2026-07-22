import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { CompaniesView } from "@/components/crm/companies-view";

export const metadata: Metadata = { title: "Companies" };

export default function CompaniesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Companies" description="Organizations you're working with." />
      <CompaniesView />
    </div>
  );
}
