import { prisma } from "@/lib/db";

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

export async function getAnalyticsMetrics(workspaceId: string) {
  const [campaigns, leadCounts, wonDeals] = await Promise.all([
    prisma.campaign.findMany({ where: { workspaceId }, select: { sentCount: true, openCount: true, replyCount: true } }),
    prisma.lead.groupBy({ by: ["status"], where: { workspaceId }, _count: true }),
    prisma.deal.aggregate({ where: { workspaceId, status: "WON" }, _sum: { value: true } }),
  ]);

  const totalSent = campaigns.reduce((s, c) => s + c.sentCount, 0);
  const totalOpened = campaigns.reduce((s, c) => s + c.openCount, 0);
  const totalReplied = campaigns.reduce((s, c) => s + c.replyCount, 0);
  const totalLeads = leadCounts.reduce((s, c) => s + c._count, 0);
  const converted = leadCounts.find((c) => c.status === "CONVERTED")?._count ?? 0;

  return {
    openRate: totalSent > 0 ? (totalOpened / totalSent) * 100 : 0,
    replyRate: totalSent > 0 ? (totalReplied / totalSent) * 100 : 0,
    conversionRate: totalLeads > 0 ? (converted / totalLeads) * 100 : 0,
    wonDealValue: wonDeals._sum.value ?? 0,
  };
}

export async function getLeadTrends(workspaceId: string, months = 6) {
  const buckets = monthBuckets(months);
  const since = new Date(buckets[0].year, buckets[0].month, 1);
  const leads = await prisma.lead.findMany({
    where: { workspaceId, createdAt: { gte: since } },
    select: { createdAt: true },
  });

  const counts = buckets.map(() => 0);
  for (const lead of leads) {
    const idx = bucketIndex(buckets, lead.createdAt);
    if (idx >= 0) counts[idx]++;
  }

  return buckets.map((b, i) => ({ month: b.key, leads: counts[i] }));
}

export async function getEmailPerformance(workspaceId: string, months = 6) {
  const buckets = monthBuckets(months);
  const since = new Date(buckets[0].year, buckets[0].month, 1);

  const emails = await prisma.campaignEmail.findMany({
    where: { campaign: { workspaceId }, sentAt: { gte: since } },
    select: { sentAt: true, openedAt: true, repliedAt: true },
  });

  const sent = buckets.map(() => 0);
  const opened = buckets.map(() => 0);
  const replied = buckets.map(() => 0);

  for (const email of emails) {
    if (!email.sentAt) continue;
    const idx = bucketIndex(buckets, email.sentAt);
    if (idx < 0) continue;
    sent[idx]++;
    if (email.openedAt) opened[idx]++;
    if (email.repliedAt) replied[idx]++;
  }

  return buckets.map((b, i) => ({ month: b.key, sent: sent[i], opened: opened[i], replied: replied[i] }));
}

export async function getLeadsBySource(workspaceId: string) {
  const rows = await prisma.lead.groupBy({ by: ["source"], where: { workspaceId }, _count: true });
  return rows
    .map((r) => ({ sourceKey: r.source ?? "unknown", value: r._count }))
    .sort((a, b) => b.value - a.value);
}

export async function getSalesFunnel(workspaceId: string) {
  const stages = await prisma.pipelineStage.findMany({
    where: { workspaceId },
    orderBy: { order: "asc" },
    include: { _count: { select: { deals: true } } },
  });
  return stages.map((s) => ({ stageKey: s.name, count: s._count.deals }));
}

export async function getMeetingStats(workspaceId: string) {
  const rows = await prisma.meeting.groupBy({ by: ["status"], where: { workspaceId }, _count: true });
  const byStatus = { SCHEDULED: 0, COMPLETED: 0, CANCELLED: 0 };
  for (const r of rows) byStatus[r.status] = r._count;

  const upcoming = await prisma.meeting.count({
    where: { workspaceId, status: "SCHEDULED", startTime: { gte: new Date() } },
  });

  return { ...byStatus, upcoming };
}

export async function getTaskStats(workspaceId: string) {
  const rows = await prisma.task.groupBy({ by: ["status"], where: { workspaceId }, _count: true });
  const byStatus = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
  for (const r of rows) byStatus[r.status] = r._count;

  const overdue = await prisma.task.count({
    where: { workspaceId, status: { not: "DONE" }, dueDate: { lt: new Date() } },
  });

  return { ...byStatus, overdue };
}

export async function getDealSuccessRate(workspaceId: string) {
  const rows = await prisma.deal.groupBy({ by: ["status"], where: { workspaceId }, _count: true });
  const byStatus = { OPEN: 0, WON: 0, LOST: 0 };
  for (const r of rows) byStatus[r.status] = r._count;
  const decided = byStatus.WON + byStatus.LOST;
  return {
    won: byStatus.WON,
    lost: byStatus.LOST,
    open: byStatus.OPEN,
    successRate: decided > 0 ? (byStatus.WON / decided) * 100 : 0,
  };
}

export async function getTimeBasedPerformance(workspaceId: string, months = 6) {
  const buckets = monthBuckets(months);
  const since = new Date(buckets[0].year, buckets[0].month, 1);

  const [leads, wonDeals] = await Promise.all([
    prisma.lead.findMany({ where: { workspaceId, createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.deal.findMany({
      where: { workspaceId, status: "WON", updatedAt: { gte: since } },
      select: { updatedAt: true, value: true },
    }),
  ]);

  const leadCounts = buckets.map(() => 0);
  const dealValue = buckets.map(() => 0);

  for (const lead of leads) {
    const idx = bucketIndex(buckets, lead.createdAt);
    if (idx >= 0) leadCounts[idx]++;
  }
  for (const deal of wonDeals) {
    const idx = bucketIndex(buckets, deal.updatedAt);
    if (idx >= 0) dealValue[idx] += deal.value ?? 0;
  }

  return buckets.map((b, i) => ({ month: b.key, leads: leadCounts[i], dealValue: dealValue[i] }));
}
