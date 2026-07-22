export type CampaignStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED";

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  subject: string;
  templateName?: string;
  recipientCount: number;
  sentCount: number;
  openCount: number;
  replyCount: number;
  clickCount: number;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type TemplateCategory =
  | "Cold Outreach"
  | "Follow-up"
  | "Introduction"
  | "Proposal"
  | "Re-engagement";

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  subject: string;
  preview: string;
  isAiGenerated: boolean;
  usageCount: number;
  updatedAt: string;
}
