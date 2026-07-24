import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/db";
import type { AdminUser } from "@/types/admin";
import { PageHeader } from "@/components/shared/page-header";
import { AdminUsersView } from "@/components/admin/admin-users-view";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const t = await getTranslations("admin.users");

  const rows = await prisma.user.findMany({
    include: { workspace: { include: { subscription: true } } },
    orderBy: { createdAt: "desc" },
  });

  const users: AdminUser[] = rows.map((row) => ({
    id: row.id,
    name: row.name ?? row.email,
    email: row.email,
    role: row.role,
    plan: row.workspace?.subscription?.plan ?? "FREE",
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    lastActiveAt: row.lastLoginAt?.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <AdminUsersView users={users} />
    </div>
  );
}
