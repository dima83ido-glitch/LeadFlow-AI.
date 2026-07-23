import { z } from "zod";

type CampaignValidationMessages = {
  nameRequired: string;
  subjectRequired: string;
};

export function createCampaignSchema(t: CampaignValidationMessages) {
  return z.object({
    name: z.string().min(2, t.nameRequired),
    subject: z.string().min(2, t.subjectRequired),
    templateId: z.string().optional(),
    scheduledAt: z.string().optional(),
  });
}

export type CreateCampaignFormValues = z.infer<ReturnType<typeof createCampaignSchema>>;
