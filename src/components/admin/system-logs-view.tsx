"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";

import type { Locale } from "@/i18n/config";
import type { SystemLog, SystemLogLevel } from "@/types/admin";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/data-table";
import { getSystemLogsColumns } from "@/components/admin/system-logs-columns";

export function SystemLogsView({ logs }: { logs: SystemLog[] }) {
  const t = useTranslations("admin.systemLogs");
  const locale = useLocale() as Locale;
  const [level, setLevel] = React.useState<SystemLogLevel | "all">("all");

  const levelFilters: { label: string; value: SystemLogLevel | "all" }[] = [
    { label: t("filters.all"), value: "all" },
    { label: t("filters.info"), value: "INFO" },
    { label: t("filters.warn"), value: "WARN" },
    { label: t("filters.error"), value: "ERROR" },
  ];

  const filtered = logs.filter((log) => level === "all" || log.level === level);
  const columns = getSystemLogsColumns(
    {
      level: t("columns.level"),
      message: t("columns.message"),
      source: t("columns.source"),
      time: t("columns.time"),
    },
    locale,
  );

  return (
    <div className="space-y-4">
      <Tabs value={level} onValueChange={(value) => setLevel(value as SystemLogLevel | "all")}>
        <TabsList>
          {levelFilters.map((filter) => (
            <TabsTrigger key={filter.value} value={filter.value}>
              {filter.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
