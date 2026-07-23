import type { ActivityItem, AppNotification } from "@/types/notification";

export const mockNotifications: AppNotification[] = [
  { id: "notif_1", type: "SUCCESS", title: "campaignSent", messageParams: { campaign: "Q3 Data Teams Outreach", count: 480 }, read: false, createdAt: "2026-07-19T09:05:00Z", href: "/campaigns" },
  { id: "notif_2", type: "INFO", title: "newLeadAdded", messageParams: { lead: "Atlas Freight Co." }, read: false, createdAt: "2026-07-19T07:15:00Z", href: "/leads/lead_8" },
  { id: "notif_3", type: "WARNING", title: "campaignPaused", messageParams: { campaign: "Logistics Re-engagement" }, read: false, createdAt: "2026-07-18T16:20:00Z", href: "/campaigns" },
  { id: "notif_4", type: "INFO", title: "meetingReminder", messageParams: { person: "Ava Chen" }, read: true, createdAt: "2026-07-18T14:00:00Z", href: "/crm/meetings" },
  { id: "notif_5", type: "SUCCESS", title: "dealWon", messageParams: { deal: "Kaido Robotics — Enterprise", amount: "$96,000" }, read: true, createdAt: "2026-07-18T09:00:00Z", href: "/crm/pipeline" },
  { id: "notif_6", type: "ERROR", title: "paymentFailed", messageParams: { digits: "4242" }, read: true, createdAt: "2026-07-16T11:00:00Z", href: "/billing" },
];

export const mockActivity: ActivityItem[] = [
  { id: "act_1", actorName: "Dmitry", action: "sentCampaign", target: "Q3 Data Teams Outreach", createdAt: "2026-07-19T09:00:00Z" },
  { id: "act_2", actorName: "Dmitry", action: "addedLead", target: "Atlas Freight Co.", createdAt: "2026-07-19T07:15:00Z" },
  { id: "act_3", actorName: "Priya Shah", action: "movedDealToNegotiation", target: "Meridian Health — Pilot", createdAt: "2026-07-18T17:30:00Z" },
  { id: "act_4", actorName: "Dmitry", action: "generatedEmailWithAi", target: "Fjord Studio", createdAt: "2026-07-18T15:10:00Z" },
  { id: "act_5", actorName: "Priya Shah", action: "closedDeal", target: "Kaido Robotics — Enterprise", createdAt: "2026-07-18T09:00:00Z" },
  { id: "act_6", actorName: "Dmitry", action: "createdTemplate", target: "Proposal — Standard", createdAt: "2026-07-17T11:20:00Z" },
];
