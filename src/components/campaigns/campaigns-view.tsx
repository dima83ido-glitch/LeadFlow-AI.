"use client";

import * as React from "react";
import { Megaphone, Search } from "lucide-react";

import { mockCampaigns } from "@/lib/mock/campaigns";
import type { CampaignStatus } from "@/types/campaign";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { campaignsColumns } from "@/components/campaigns/campaigns-columns";

const statusFilters: { label: string; value: CampaignStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "ACTIVE" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Paused", value: "PAUSED" },
  { label: "Draft", value: "DRAFT" },
  { label: "Completed", value: "COMPLETED" },
];

export function CampaignsView() {
  const [status, setStatus] = React.useState<CampaignStatus | "all">("all");
  const [search, setSearch] = React.useState("");

  const filtered = mockCampaigns.filter((campaign) => {
    if (status !== "all" && campaign.status !== status) return false;
    if (search && !campaign.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={status} onValueChange={(value) => setStatus(value as CampaignStatus | "all")}>
          <TabsList>
            {statusFilters.map((filter) => (
              <TabsTrigger key={filter.value} value={filter.value}>
                {filter.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-64">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search campaigns..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {mockCampaigns.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No campaigns yet"
          description="Create your first campaign to start reaching out to leads."
          action={
            <Button render={<a href="/campaigns/new" />}>New Campaign</Button>
          }
        />
      ) : (
        <DataTable
          columns={campaignsColumns}
          data={filtered}
          emptyState={
            <EmptyState
              icon={Search}
              title="No campaigns match your filters"
              description="Try a different status or search term."
              className="border-none py-8"
            />
          }
        />
      )}
    </div>
  );
}
