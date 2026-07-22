import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { LeadsSearchView } from "@/components/leads/leads-search-view";

export const metadata: Metadata = { title: "Search Leads" };

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Search Leads"
        description="Find potential clients by country, industry, keywords, and more."
      />
      <LeadsSearchView />
    </div>
  );
}
