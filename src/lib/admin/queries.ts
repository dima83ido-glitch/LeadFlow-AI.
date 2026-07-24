import { prisma } from "@/lib/db";
import { PLAN_PRICES_CENTS } from "@/lib/plans";
import type { SubscriptionPlan } from "@/generated/prisma/enums";

const MONTH_KEYS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthBuckets(months: number) {
  const now = new Date();
  const buckets: { key: string; year: number; month: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ key: MONTH_KEYS[d.getMonth()], year: d.getFullYear(), month: d.getMonth() });
  }
  return buckets;
}

function bucketIndex(buckets: { year: number; month: number }[], date: Date) {
  return buckets.findIndex((b) => b.year === date.getFullYear() && b.month === date.getMonth());
}

export async function getAdminStats() {
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalUsers, newRegistrations, activeUsers, subscriptions] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: since30 } } }),
    prisma.user.count({ where: { lastLoginAt: { gte: since30 } } }),
    prisma.subscription.findMany({ select: { plan: true, status: true } }),
  ]);

  const activeSubs = subscriptions.filter((s) => s.status === "ACTIVE");
  const mrrCents = activeSubs.reduce((sum, s) => sum + PLAN_PRICES_CENTS[s.plan], 0);
  const paidActive = activeSubs.filter((s) => s.plan !== "FREE").length;
  const paidConversionRate = subscriptions.length > 0 ? (paidActive / subscriptions.length) * 100 : 0;

  return {
    totalUsers,
    newRegistrations,
    activeUsers,
    mrr: mrrCents / 100,
    arr: (mrrCents / 100) * 12,
    activeSubscriptions: activeSubs.length,
    paidConversionRate,
  };
}

export async function getPlanDistribution() {
  const rows = await prisma.subscription.groupBy({ by: ["plan"], _count: true });
  const order: SubscriptionPlan[] = ["FREE", "STARTER", "PRO", "ENTERPRISE"];
  return order.map((plan) => ({
    plan,
    count: rows.find((r) => r.plan === plan)?._count ?? 0,
  }));
}

export async function getRevenueByPlan() {
  const rows = await prisma.subscription.groupBy({ by: ["plan"], where: { status: "ACTIVE" }, _count: true });
  const order: SubscriptionPlan[] = ["FREE", "STARTER", "PRO", "ENTERPRISE"];
  return order.map((plan) => {
    const count = rows.find((r) => r.plan === plan)?._count ?? 0;
    return { planKey: plan.toLowerCase(), revenue: (count * PLAN_PRICES_CENTS[plan]) / 100 };
  });
}

export async function getUserGrowth(months = 6) {
  const buckets = monthBuckets(months);
  const since = new Date(buckets[0].year, buckets[0].month, 1);

  const [users, subscriptions] = await Promise.all([
    prisma.user.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.subscription.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true, plan: true } }),
  ]);

  const totalBefore = await prisma.user.count({ where: { createdAt: { lt: since } } });

  const newUsersByMonth = buckets.map(() => 0);
  for (const u of users) {
    const idx = bucketIndex(buckets, u.createdAt);
    if (idx >= 0) newUsersByMonth[idx]++;
  }

  const mrrDeltaByMonth = buckets.map(() => 0);
  for (const s of subscriptions) {
    const idx = bucketIndex(buckets, s.createdAt);
    if (idx >= 0) mrrDeltaByMonth[idx] += PLAN_PRICES_CENTS[s.plan] / 100;
  }

  let cumulativeUsers = totalBefore;
  let cumulativeMrr = 0;
  return buckets.map((b, i) => {
    cumulativeUsers += newUsersByMonth[i];
    cumulativeMrr += mrrDeltaByMonth[i];
    return { month: b.key, users: cumulativeUsers, mrr: Math.round(cumulativeMrr) };
  });
}

function dayBuckets(days: number) {
  const now = new Date();
  const buckets: { key: string; year: number; month: number; date: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    buckets.push({
      key: `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      year: d.getFullYear(),
      month: d.getMonth(),
      date: d.getDate(),
    });
  }
  return buckets;
}

export async function getAiUsageStats(days = 30, trendDays = 14) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const rows = await prisma.systemLog.findMany({
    where: { createdAt: { gte: since } },
    select: { context: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 5000,
  });

  const aiRows = rows.filter((row) => {
    const context = row.context as { feature?: string } | null;
    return Boolean(context?.feature?.startsWith("ai."));
  });

  const byTool = new Map<string, number>();
  for (const row of aiRows) {
    const feature = (row.context as { feature: string }).feature;
    byTool.set(feature, (byTool.get(feature) ?? 0) + 1);
  }

  const buckets = dayBuckets(trendDays);
  const dailyCounts = buckets.map(() => 0);
  for (const row of aiRows) {
    const idx = buckets.findIndex(
      (b) => b.year === row.createdAt.getFullYear() && b.month === row.createdAt.getMonth() && b.date === row.createdAt.getDate(),
    );
    if (idx >= 0) dailyCounts[idx]++;
  }

  const byToolSorted = Array.from(byTool.entries())
    .map(([feature, count]) => ({ feature: feature.replace(/^ai\./, ""), count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalCalls: aiRows.length,
    activeTools: byToolSorted.length,
    topTool: byToolSorted[0]?.feature ?? null,
    byTool: byToolSorted,
    daily: buckets.map((b, i) => ({ day: b.key, calls: dailyCounts[i] })),
  };
}

export async function getFeatureUsage(take = 8) {
  const rows = await prisma.systemLog.findMany({
    where: { NOT: { context: { equals: undefined } } },
    select: { context: true },
    take: 500,
    orderBy: { createdAt: "desc" },
  });

  const counts = new Map<string, number>();
  for (const row of rows) {
    const context = row.context as { feature?: string } | null;
    if (!context?.feature) continue;
    counts.set(context.feature, (counts.get(context.feature) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([feature, count]) => ({ feature, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, take);
}
