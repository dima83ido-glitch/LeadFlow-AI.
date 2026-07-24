"use client";

import * as React from "react";
import { Search, SearchX } from "lucide-react";
import { useTranslations } from "next-intl";

import { searchLeads } from "@/lib/actions/leads";
import type { Lead, LeadSearchFilters } from "@/types/lead";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/page-skeleton";
import { getLeadsColumns } from "@/components/leads/leads-columns";
import { LeadsFilterBar } from "@/components/leads/leads-filter-bar";

export function LeadsSearchView({ countries, industries }: { countries: string[]; industries: string[] }) {
  const t = useTranslations("leads");
  const leadsColumns = React.useMemo(() => getLeadsColumns(t), [t]);
  const [filters, setFilters] = React.useState<LeadSearchFilters>({});
  const [isSearching, setIsSearching] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [results, setResults] = React.useState<Lead[]>([]);

  async function handleSearch() {
    setIsSearching(true);
    const leads = await searchLeads(filters);
    setResults(leads);
    setHasSearched(true);
    setIsSearching(false);
  }

  function handleReset() {
    setFilters({});
    setHasSearched(false);
    setResults([]);
  }

  return (
    <div className="space-y-6">
      <LeadsFilterBar
        filters={filters}
        onChange={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
        isSearching={isSearching}
        countries={countries}
        industries={industries}
      />

      {isSearching ? (
        <TableSkeleton />
      ) : hasSearched ? (
        results.length > 0 ? (
          <DataTable columns={leadsColumns} data={results} />
        ) : (
          <EmptyState
            icon={SearchX}
            title={t("searchView.noResultsTitle")}
            description={t("searchView.noResultsDescription")}
          />
        )
      ) : (
        <EmptyState
          icon={Search}
          title={t("searchView.startTitle")}
          description={t("searchView.startDescription")}
        />
      )}
    </div>
  );
}
