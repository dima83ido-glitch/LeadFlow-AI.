import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/db";
import { getAdminStats } from "@/lib/admin/queries";
import type { AdminUser } from "@/types/admin";
import { PageHeader } from "@/components/shared/page-header";
import { AdminStatCards } from "@/components/admin/admin-stat-cards";
import { RecentSignups } from "@/components/admin/recent-signups";

export const metadata: Metadata = { title: "Admin Overview" };

export default async function AdminOverviewPage() {
  const t = await getTranslations("admin.dashboard");
  const [stats, recentRows] = await Promise.all([
    getAdminStats(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { workspace: { include: { subscription: true } } },
    }),
  ]);

  const recentUsers: AdminUser[] = recentRows.map((row) => ({
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
      <AdminStatCards stats={stats} />
      <RecentSignups users={recentUsers} />
    </div>
  );
}
