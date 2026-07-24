import { z } from "zod";

type MeetingValidationMessages = {
  titleRequired: string;
  startTimeRequired: string;
};

export function createMeetingSchema(t: MeetingValidationMessages) {
  return z.object({
    title: z.string().min(1, t.titleRequired),
    startTime: z.string().min(1, t.startTimeRequired),
    location: z.string().optional(),
  });
}

export type MeetingFormValues = z.infer<ReturnType<typeof createMeetingSchema>>;
