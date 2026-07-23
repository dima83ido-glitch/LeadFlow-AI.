"use client";

import * as React from "react";
import { Megaphone, Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { Locale } from "@/i18n/config";
import { mockCampaigns } from "@/lib/mock/campaigns";
import type { CampaignStatus } from "@/types/campaign";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { getCampaignsColumns } from "@/components/campaigns/campaigns-columns";

const statusFilterValues: (CampaignStatus | "all")[] = [
  "all",
  "ACTIVE",
  "SCHEDULED",
  "PAUSED",
  "DRAFT",
  "COMPLETED",
];

export function CampaignsView() {
  const t = useTranslations("campaigns");
  const tCommon = useTranslations("common.statusLabels");
  const locale = useLocale() as Locale;
  const campaignsColumns = React.useMemo(() => getCampaignsColumns(t, locale), [t, locale]);
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
            {statusFilterValues.map((value) => (
              <TabsTrigger key={value} value={value}>
                {value === "all" ? t("statusFilterAll") : tCommon(value)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-64">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            placeholder={t("searchPlaceholder")}
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {mockCampaigns.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={
            <Button render={<a href="/campaigns/new" />}>{t("newCampaign")}</Button>
          }
        />
      ) : (
        <DataTable
          columns={campaignsColumns}
          data={filtered}
          emptyState={
            <EmptyState
              icon={Search}
              title={t("noMatchTitle")}
              description={t("noMatchDescription")}
              className="border-none py-8"
            />
          }
        />
      )}
    </div>
  );
}
