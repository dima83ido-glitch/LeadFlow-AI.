import type { Metadata } from "next";

import { mockAdminUsers } from "@/lib/mock/admin";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { adminUsersColumns } from "@/components/admin/admin-users-columns";

export const metadata: Metadata = { title: "Users" };

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Every user across all workspaces on LeadFlow AI." />
      <DataTable columns={adminUsersColumns} data={mockAdminUsers} />
    </div>
  );
}
