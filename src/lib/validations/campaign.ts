import { z } from "zod";

export const createCampaignSchema = z.object({
  name: z.string().min(2, "Campaign name is required"),
  subject: z.string().min(2, "Subject line is required"),
  templateId: z.string().optional(),
  scheduledAt: z.string().optional(),
});

export type CreateCampaignFormValues = z.infer<typeof createCampaignSchema>;
