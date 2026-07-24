import { z } from "zod";

export const WEBSITE_ANALYSIS_CATEGORIES = [
  "seo",
  "speed",
  "performance",
  "security",
  "ux",
  "ui",
  "responsiveness",
  "accessibility",
  "structure",
  "content",
  "cta",
  "conversion",
  "errors",
] as const;

export const findingSchema = z.object({
  status: z.enum(["good", "warning", "bad"]),
  label: z.string(),
  detail: z.string(),
});

export const categoryResultSchema = z.object({
  key: z.enum(WEBSITE_ANALYSIS_CATEGORIES),
  score: z.number().min(0).max(100),
  findings: z.array(findingSchema).min(1).max(4),
});

export const websiteAnalysisResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  categories: z.array(categoryResultSchema),
  recommendations: z.array(z.string()).min(1).max(8),
});

export type WebsiteAnalysisResult = z.infer<typeof websiteAnalysisResultSchema>;

export const landingPageAnalysisResultSchema = z.object({
  score: z.number().min(0).max(100),
  findings: z.array(findingSchema).min(1).max(8),
});

export type LandingPageAnalysisResult = z.infer<typeof landingPageAnalysisResultSchema>;

export const translationResultSchema = z.object({
  translatedText: z.string(),
});

export type TranslationResult = z.infer<typeof translationResultSchema>;
