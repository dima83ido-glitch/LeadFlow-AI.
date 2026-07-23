import { z } from "zod";

// Used server-side only (API routes, NextAuth authorize()) — these messages
// are never shown to a user, so they don't need translation. Client forms
// use the create*Schema factories below instead.
export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((value) => value === true, {
      error: "You must accept the terms to continue",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

type AuthValidationMessages = {
  emailInvalid: string;
  passwordMin: string;
  nameMin: string;
  termsRequired: string;
  passwordsDoNotMatch: string;
};

export function createLoginSchema(t: AuthValidationMessages) {
  return z.object({
    email: z.email(t.emailInvalid),
    password: z.string().min(8, t.passwordMin),
  });
}

export function createRegisterSchema(t: AuthValidationMessages) {
  return z
    .object({
      name: z.string().min(2, t.nameMin),
      email: z.email(t.emailInvalid),
      password: z.string().min(8, t.passwordMin),
      confirmPassword: z.string(),
      acceptTerms: z.boolean().refine((value) => value === true, {
        error: t.termsRequired,
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t.passwordsDoNotMatch,
      path: ["confirmPassword"],
    });
}

export function createForgotPasswordSchema(t: AuthValidationMessages) {
  return z.object({
    email: z.email(t.emailInvalid),
  });
}
