import { z } from "zod";

type TaskValidationMessages = {
  titleRequired: string;
};

export function createTaskSchema(t: TaskValidationMessages) {
  return z.object({
    title: z.string().min(1, t.titleRequired),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  });
}

export type TaskFormValues = z.infer<ReturnType<typeof createTaskSchema>>;
