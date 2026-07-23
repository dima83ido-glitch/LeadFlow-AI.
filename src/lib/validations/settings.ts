import { z } from "zod";

type ProfileValidationMessages = {
  nameMin: string;
  emailInvalid: string;
};

type WorkspaceValidationMessages = {
  nameRequired: string;
  slugRequired: string;
  slugPattern: string;
};

type SecurityValidationMessages = {
  currentPasswordRequired: string;
  passwordMin: string;
  passwordsDoNotMatch: string;
};

export function createProfileSchema(t: ProfileValidationMessages) {
  return z.object({
    name: z.string().min(2, t.nameMin),
    email: z.email(t.emailInvalid),
    jobTitle: z.string().optional(),
  });
}

export function createWorkspaceSchema(t: WorkspaceValidationMessages) {
  return z.object({
    name: z.string().min(2, t.nameRequired),
    slug: z.string().min(2, t.slugRequired).regex(/^[a-z0-9-]+$/, t.slugPattern),
  });
}

export function createSecuritySchema(t: SecurityValidationMessages) {
  return z
    .object({
      currentPassword: z.string().min(8, t.currentPasswordRequired),
      newPassword: z.string().min(8, t.passwordMin),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t.passwordsDoNotMatch,
      path: ["confirmPassword"],
    });
}

export type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>;
export type WorkspaceFormValues = z.infer<ReturnType<typeof createWorkspaceSchema>>;
export type SecurityFormValues = z.infer<ReturnType<typeof createSecuritySchema>>;
