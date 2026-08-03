import type { CrmTask, Deal, Meeting, Note, PipelineStage } from "@/types/crm";

export const mockPipelineStages: PipelineStage[] = [
  { id: "stage_1", name: "New", order: 1, color: "var(--chart-1)" },
  { id: "stage_2", name: "Contacted", order: 2, color: "var(--chart-2)" },
  { id: "stage_3", name: "Proposal Sent", order: 3, color: "var(--chart-3)" },
  { id: "stage_4", name: "Negotiation", order: 4, color: "var(--chart-4)" },
  { id: "stage_5", name: "Won", order: 5, color: "var(--chart-5)" },
];

export const mockDeals: Deal[] = [
  { id: "deal_1", title: "Northwind — Annual Plan", companyName: "Northwind Analytics", contactName: "Ava Chen", value: 24000, currency: "USD", stageId: "stage_3", closeDate: "2026-08-15T00:00:00Z", createdAt: "2026-07-05T09:00:00Z" },
  { id: "deal_2", title: "Fjord Studio — Team Plan", companyName: "Fjord Studio", contactName: "Lars Eriksen", value: 8400, currency: "USD", stageId: "stage_2", closeDate: "2026-08-01T00:00:00Z", createdAt: "2026-07-10T09:00:00Z" },
  { id: "deal_3", title: "Kaido Robotics — Enterprise", companyName: "Kaido Robotics", contactName: "Yuki Tanaka", value: 96000, currency: "USD", stageId: "stage_5", closeDate: "2026-07-18T00:00:00Z", createdAt: "2026-06-22T09:00:00Z" },
  { id: "deal_4", title: "Meridian Health — Pilot", companyName: "Meridian Health Partners", contactName: "Sofia Alvarez", value: 15000, currency: "USD", stageId: "stage_4", closeDate: "2026-08-05T00:00:00Z", createdAt: "2026-07-09T09:00:00Z" },
  { id: "deal_5", title: "Lumen Interiors — Starter", companyName: "Lumen Interiors", contactName: "Claire Dubois", value: 2400, currency: "USD", stageId: "stage_1", createdAt: "2026-07-16T09:00:00Z" },
  { id: "deal_6", title: "Atlas Freight — Fleet Plan", companyName: "Atlas Freight Co.", contactName: "Deion Brooks", value: 32000, currency: "USD", stageId: "stage_1", createdAt: "2026-07-19T09:00:00Z" },
  { id: "deal_7", title: "Sable & Finch — Team Plan", companyName: "Sable & Finch Law", contactName: "Marcus Reid", value: 6000, currency: "USD", stageId: "stage_2", createdAt: "2026-07-02T09:00:00Z" },
];

export const mockTasks: CrmTask[] = [
  { id: "task_1", title: "Send proposal to Northwind Analytics", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2026-07-22T17:00:00Z", createdAt: "2026-07-15T09:00:00Z", assigneeName: "Dmitry", relatedTo: "Northwind Analytics" },
  { id: "task_2", title: "Follow up on Fjord Studio demo", status: "TODO", priority: "MEDIUM", dueDate: "2026-07-23T12:00:00Z", createdAt: "2026-07-16T09:00:00Z", assigneeName: "Dmitry", relatedTo: "Fjord Studio" },
  { id: "task_3", title: "Prepare Kaido Robotics onboarding checklist", status: "DONE", priority: "MEDIUM", dueDate: "2026-07-19T09:00:00Z", createdAt: "2026-07-12T09:00:00Z", assigneeName: "Priya Shah", relatedTo: "Kaido Robotics" },
  { id: "task_4", title: "Confirm contract terms with legal", status: "TODO", priority: "HIGH", dueDate: "2026-07-25T15:00:00Z", createdAt: "2026-07-17T09:00:00Z", assigneeName: "Priya Shah", relatedTo: "Meridian Health Partners" },
  { id: "task_5", title: "Draft Q3 outreach segment for Retail", status: "TODO", priority: "LOW", dueDate: "2026-07-28T09:00:00Z", createdAt: "2026-07-18T09:00:00Z", assigneeName: "Dmitry" },
];

export const mockMeetings: Meeting[] = [
  { id: "mtg_1", title: "Discovery Call", companyName: "Northwind Analytics", contactName: "Ava Chen", startTime: "2026-07-22T15:00:00Z", endTime: "2026-07-22T15:30:00Z", location: "Google Meet", attendees: ["Dmitry", "Ava Chen"], status: "SCHEDULED" },
  { id: "mtg_2", title: "Product Demo", companyName: "Fjord Studio", contactName: "Lars Eriksen", startTime: "2026-07-23T10:00:00Z", endTime: "2026-07-23T10:45:00Z", location: "Zoom", attendees: ["Dmitry", "Lars Eriksen"], status: "SCHEDULED" },
  { id: "mtg_3", title: "Contract Review", companyName: "Meridian Health Partners", contactName: "Sofia Alvarez", startTime: "2026-07-24T13:00:00Z", endTime: "2026-07-24T14:00:00Z", location: "Google Meet", attendees: ["Priya Shah", "Sofia Alvarez"], status: "SCHEDULED" },
  { id: "mtg_4", title: "Quarterly Business Review", companyName: "Kaido Robotics", contactName: "Yuki Tanaka", startTime: "2026-07-25T09:00:00Z", endTime: "2026-07-25T10:00:00Z", location: "In person — Tokyo office", attendees: ["Dmitry", "Yuki Tanaka"], status: "SCHEDULED" },
];

export const mockNotes: Note[] = [
  { id: "note_1", content: "Ava mentioned budget approval expected by end of month — follow up early August.", authorName: "Dmitry", relatedTo: "Northwind Analytics", createdAt: "2026-07-18T10:00:00Z" },
  { id: "note_2", content: "Lars wants a custom onboarding session for their design team, 5 seats minimum.", authorName: "Dmitry", relatedTo: "Fjord Studio", createdAt: "2026-07-16T14:00:00Z" },
  { id: "note_3", content: "Legal flagged a data residency question — routed to Priya for enterprise terms.", authorName: "Priya Shah", relatedTo: "Meridian Health Partners", createdAt: "2026-07-15T09:00:00Z" },
];
