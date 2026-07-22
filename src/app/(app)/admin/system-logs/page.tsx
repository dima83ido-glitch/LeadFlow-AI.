import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { SystemLogsView } from "@/components/admin/system-logs-view";

export const metadata: Metadata = { title: "System Logs" };

export default function SystemLogsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="System Logs" description="Recent events emitted across LeadFlow AI services." />
      <SystemLogsView />
    </div>
  );
}
