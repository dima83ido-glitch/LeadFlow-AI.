import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { AdminStatCards } from "@/components/admin/admin-stat-cards";
import { RecentSignups } from "@/components/admin/recent-signups";

export const metadata: Metadata = { title: "Admin Overview" };

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Admin Overview" description="Workspace, billing, and platform health at a glance." />
      <AdminStatCards />
      <RecentSignups />
    </div>
  );
}
