"use client";

import * as React from "react";

import { mockSystemLogs } from "@/lib/mock/admin";
import type { SystemLogLevel } from "@/types/admin";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/data-table";
import { systemLogsColumns } from "@/components/admin/system-logs-columns";

const levelFilters: { label: string; value: SystemLogLevel | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Info", value: "INFO" },
  { label: "Warn", value: "WARN" },
  { label: "Error", value: "ERROR" },
];

export function SystemLogsView() {
  const [level, setLevel] = React.useState<SystemLogLevel | "all">("all");

  const filtered = mockSystemLogs.filter((log) => level === "all" || log.level === level);

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
      <DataTable columns={systemLogsColumns} data={filtered} />
    </div>
  );
}
