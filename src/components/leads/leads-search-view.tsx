"use client";

import * as React from "react";
import { Search, SearchX } from "lucide-react";
import { useTranslations } from "next-intl";

import { mockLeads } from "@/lib/mock/leads";
import type { Lead, LeadSearchFilters } from "@/types/lead";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/page-skeleton";
import { getLeadsColumns } from "@/components/leads/leads-columns";
import { LeadsFilterBar } from "@/components/leads/leads-filter-bar";

function matchesFilters(lead: Lead, filters: LeadSearchFilters) {
  if (filters.country && lead.country !== filters.country) return false;
  if (filters.city && !lead.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
  if (filters.industry && lead.industry !== filters.industry) return false;
  if (filters.hasWebsite && !lead.website) return false;
  if (filters.hasEmail && !lead.email) return false;
  if (filters.hasPhone && !lead.phone) return false;
  if (filters.minRating && lead.rating < filters.minRating) return false;
  if (filters.keywords) {
    const haystack = `${lead.companyName} ${lead.industry} ${lead.city} ${lead.country}`.toLowerCase();
    if (!haystack.includes(filters.keywords.toLowerCase())) return false;
  }
  return true;
}

export function LeadsSearchView() {
  const t = useTranslations("leads");
  const leadsColumns = React.useMemo(() => getLeadsColumns(t), [t]);
  const [filters, setFilters] = React.useState<LeadSearchFilters>({});
  const [isSearching, setIsSearching] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [results, setResults] = React.useState<Lead[]>([]);

  function handleSearch() {
    setIsSearching(true);
    setTimeout(() => {
      setResults(mockLeads.filter((lead) => matchesFilters(lead, filters)));
      setHasSearched(true);
      setIsSearching(false);
    }, 700);
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
