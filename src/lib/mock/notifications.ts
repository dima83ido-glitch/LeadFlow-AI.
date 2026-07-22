import type { ActivityItem, AppNotification } from "@/types/notification";

export const mockNotifications: AppNotification[] = [
  { id: "notif_1", type: "SUCCESS", title: "Campaign sent", message: "Q3 Data Teams Outreach was delivered to 480 recipients.", read: false, createdAt: "2026-07-19T09:05:00Z", href: "/campaigns" },
  { id: "notif_2", type: "INFO", title: "New lead added", message: "Atlas Freight Co. was added from Google Maps search.", read: false, createdAt: "2026-07-19T07:15:00Z", href: "/leads/lead_8" },
  { id: "notif_3", type: "WARNING", title: "Campaign paused", message: "Logistics Re-engagement was paused due to low open rate.", read: false, createdAt: "2026-07-18T16:20:00Z", href: "/campaigns" },
  { id: "notif_4", type: "INFO", title: "Meeting reminder", message: "Discovery call with Ava Chen starts in 1 hour.", read: true, createdAt: "2026-07-18T14:00:00Z", href: "/crm/meetings" },
  { id: "notif_5", type: "SUCCESS", title: "Deal won", message: "Kaido Robotics — Enterprise moved to Won ($96,000).", read: true, createdAt: "2026-07-18T09:00:00Z", href: "/crm/pipeline" },
  { id: "notif_6", type: "ERROR", title: "Payment failed", message: "Your card ending in 4242 could not be charged.", read: true, createdAt: "2026-07-16T11:00:00Z", href: "/billing" },
];

export const mockActivity: ActivityItem[] = [
  { id: "act_1", actorName: "Dmitry", action: "sent campaign", target: "Q3 Data Teams Outreach", createdAt: "2026-07-19T09:00:00Z" },
  { id: "act_2", actorName: "Dmitry", action: "added lead", target: "Atlas Freight Co.", createdAt: "2026-07-19T07:15:00Z" },
  { id: "act_3", actorName: "Priya Shah", action: "moved deal to Negotiation", target: "Meridian Health — Pilot", createdAt: "2026-07-18T17:30:00Z" },
  { id: "act_4", actorName: "Dmitry", action: "generated email with AI", target: "Fjord Studio", createdAt: "2026-07-18T15:10:00Z" },
  { id: "act_5", actorName: "Priya Shah", action: "closed deal", target: "Kaido Robotics — Enterprise", createdAt: "2026-07-18T09:00:00Z" },
  { id: "act_6", actorName: "Dmitry", action: "created template", target: "Proposal — Standard", createdAt: "2026-07-17T11:20:00Z" },
];
