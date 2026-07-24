import { Mail, Target, TrendingUp, Users } from "lucide-react";

import { prisma } from "@/lib/db";
import type { DashboardStat } from "@/lib/mock/dashboard";

function startOf(daysAgo: number) {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
}

function percentDelta(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export async function getDashboardStats(workspaceId: string): Promise<DashboardStat[]> {
  const last30 = startOf(30);
  const prev30 = startOf(60);

  const [totalLeads, leadsLast30, leadsPrev30, activeCampaigns, campaigns, payments] = await Promise.all([
    prisma.lead.count({ where: { workspaceId } }),
    prisma.lead.count({ where: { workspaceId, createdAt: { gte: last30 } } }),
    prisma.lead.count({ where: { workspaceId, createdAt: { gte: prev30, lt: last30 } } }),
    prisma.campaign.count({ where: { workspaceId, status: "ACTIVE" } }),
    prisma.campaign.findMany({ where: { workspaceId }, select: { sentCount: true, replyCount: true } }),
    prisma.payment.findMany({ where: { workspaceId, status: "SUCCEEDED", createdAt: { gte: last30 } }, select: { amount: true } }),
  ]);

  const totalSent = campaigns.reduce((sum, c) => sum + c.sentCount, 0);
  const totalReplies = campaigns.reduce((sum, c) => sum + c.replyCount, 0);
  const replyRate = totalSent > 0 ? (totalReplies / totalSent) * 100 : 0;

  const revenueMtdCents = payments.reduce((sum, p) => sum + p.amount, 0);

  return [
    {
      labelKey: "totalLeads",
      value: totalLeads.toLocaleString(),
      delta: percentDelta(leadsLast30, leadsPrev30),
      trend: leadsLast30 >= leadsPrev30 ? "up" : "down",
      icon: Users,
    },
    {
      labelKey: "activeCampaigns",
      value: String(activeCampaigns),
      delta: 0,
      trend: "up",
      icon: Mail,
    },
    {
      labelKey: "replyRate",
      value: `${replyRate.toFixed(1)}%`,
      delta: 0,
      trend: "up",
      icon: Target,
    },
    {
      labelKey: "revenueMtd",
      value: `$${(revenueMtdCents / 100).toLocaleString()}`,
      delta: 0,
      trend: "up",
      icon: TrendingUp,
    },
  ];
}

export type RecentActivityItem = {
  id: string;
  actorName: string;
  action: string;
  target: string;
  createdAt: string;
};

export async function getRecentActivity(workspaceId: string, take = 6): Promise<RecentActivityItem[]> {
  const [leads, tasks, meetings, notes, contacts] = await Promise.all([
    prisma.lead.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" }, take, select: { id: true, companyName: true, createdAt: true } }),
    prisma.task.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" }, take, include: { assignee: true } }),
    prisma.meeting.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" }, take, include: { contact: true } }),
    prisma.note.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" }, take, include: { author: true } }),
    prisma.contact.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" }, take, select: { id: true, firstName: true, lastName: true, createdAt: true } }),
  ]);

  const items: RecentActivityItem[] = [
    ...leads.map((l) => ({ id: `lead-${l.id}`, actorName: "System", action: "addedLead", target: l.companyName, createdAt: l.createdAt.toISOString() })),
    ...tasks.map((t) => ({ id: `task-${t.id}`, actorName: t.assignee?.name ?? "Someone", action: "createdTask", target: t.title, createdAt: t.createdAt.toISOString() })),
    ...meetings.map((m) => ({ id: `meeting-${m.id}`, actorName: m.contact?.firstName ?? "Someone", action: "scheduledMeeting", target: m.title, createdAt: m.createdAt.toISOString() })),
    ...notes.map((n) => ({ id: `note-${n.id}`, actorName: n.author?.name ?? "Someone", action: "addedNote", target: n.content.slice(0, 40), createdAt: n.createdAt.toISOString() })),
    ...contacts.map((c) => ({ id: `contact-${c.id}`, actorName: "Someone", action: "addedContact", target: `${c.firstName} ${c.lastName ?? ""}`.trim(), createdAt: c.createdAt.toISOString() })),
  ];

  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, take);
}

export type RecentCampaignItem = {
  id: string;
  name: string;
  status: string;
  sentCount: number;
  recipientCount: number;
};

export async function getRecentCampaigns(workspaceId: string, take = 4): Promise<RecentCampaignItem[]> {
  const rows = await prisma.campaign.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
    take,
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    status: row.status,
    sentCount: row.sentCount,
    recipientCount: row.sentCount,
  }));
}
