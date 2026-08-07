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

export type CategoryResult = z.infer<typeof categoryResultSchema>;

export const websiteAnalysisResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  categories: z.array(categoryResultSchema),
  recommendations: z.array(z.string()).min(1).max(8),
});

export type WebsiteAnalysisResult = z.infer<typeof websiteAnalysisResultSchema>;

/**
 * A single batch's worth of the website analysis — see
 * WEBSITE_ANALYSIS_CATEGORY_BATCHES in prompts.ts. Free-tier models were
 * verified (against OpenRouter directly, with a controlled category-count
 * sweep) to hang indefinitely past ~3 categories in one completion — asking
 * for all 13 at once in a single request/schema was the actual root cause of
 * "the AI took too long," not a bad model or a slow website. `overallScore`
 * and `recommendations` are computed from the merged batches in code instead
 * of asked of the model, since they're simple aggregates that don't need
 * their own generation (or round trip).
 */
export const websiteAnalysisCategoryBatchSchema = z.object({
  categories: z.array(categoryResultSchema).min(1),
});

export type WebsiteAnalysisCategoryBatch = z.infer<typeof websiteAnalysisCategoryBatchSchema>;

export const landingPageAnalysisResultSchema = z.object({
  score: z.number().min(0).max(100),
  findings: z.array(findingSchema).min(1).max(8),
});

export type LandingPageAnalysisResult = z.infer<typeof landingPageAnalysisResultSchema>;

export const seoAuditResultSchema = z.object({
  score: z.number().min(0).max(100),
  findings: z.array(findingSchema).min(1).max(8),
});

export type SeoAuditResult = z.infer<typeof seoAuditResultSchema>;

export const translationResultSchema = z.object({
  translatedText: z.string(),
});

export type TranslationResult = z.infer<typeof translationResultSchema>;

export const emailDraftResultSchema = z.object({
  subject: z.string(),
  body: z.string(),
});

export type EmailDraftResult = z.infer<typeof emailDraftResultSchema>;

export const emailRewriteResultSchema = z.object({
  rewrittenText: z.string(),
});

export type EmailRewriteResult = z.infer<typeof emailRewriteResultSchema>;

export const headlineGeneratorResultSchema = z.object({
  headlines: z.array(z.string()).min(3).max(8),
});

export type HeadlineGeneratorResult = z.infer<typeof headlineGeneratorResultSchema>;

export const ctaGeneratorResultSchema = z.object({
  ctas: z.array(z.string()).min(3).max(8),
});

export type CtaGeneratorResult = z.infer<typeof ctaGeneratorResultSchema>;

const subjectVariantSchema = z.object({
  text: z.string(),
  openRate: z.number().min(0).max(100),
});

export const subjectGeneratorResultSchema = z.object({
  subjects: z.array(subjectVariantSchema).min(3).max(8),
});

export type SubjectGeneratorResult = z.infer<typeof subjectGeneratorResultSchema>;

// ---------------------------------------------------------------------------
// Onboarding personalization
// ---------------------------------------------------------------------------

const suggestedContentSchema = z.object({
  name: z.string(),
  subject: z.string(),
  body: z.string(),
});

const emailSequenceStepSchema = z.object({
  step: z.string(),
  timing: z.string(),
});

export const personalizationResultSchema = z.object({
  trafficSources: z.array(z.string()).min(3).max(5),
  automations: z.array(z.string()).min(3).max(5),
  marketingTips: z.array(z.string()).min(3).max(5),
  crmTips: z.array(z.string()).min(2).max(4),
  suggestedContent: z.array(suggestedContentSchema).min(2).max(3),
  emailSequence: z.array(emailSequenceStepSchema).min(3).max(5),
});

export type PersonalizationResult = z.infer<typeof personalizationResultSchema>;

// ---------------------------------------------------------------------------
// AI Marketing Plan Generator
// ---------------------------------------------------------------------------

export interface MarketingPlanInput {
  businessName: string;
  industry: string;
  targetAudience: string;
  products: string;
  services: string;
  marketingGoals: string;
  monthlyBudget: string;
  timeline: string;
  socialNetworks: string;
  hasEmailList: boolean;
  emailListSize?: string;
  currentMarketingActivities: string;
  biggestChallenge: string;
  uniqueSellingProposition: string;
  existingAssets?: string;
  resources?: string;
  offers?: string;
  personas?: string;
}

const personaSchema = z.object({
  name: z.string(),
  summary: z.string(),
  demographics: z.string(),
  painPoints: z.array(z.string()).min(1).max(6),
  goals: z.array(z.string()).min(1).max(6),
});

const swotSchema = z.object({
  strengths: z.array(z.string()).min(1).max(6),
  weaknesses: z.array(z.string()).min(1).max(6),
  opportunities: z.array(z.string()).min(1).max(6),
  threats: z.array(z.string()).min(1).max(6),
});

const marketingFunnelSchema = z.object({
  awareness: z.string(),
  consideration: z.string(),
  conversion: z.string(),
  retention: z.string(),
});

const socialChannelsSchema = z.object({
  linkedin: z.string(),
  facebook: z.string(),
  instagram: z.string(),
  tiktok: z.string(),
  youtube: z.string(),
});

const roadmapPhaseSchema = z.object({
  phase: z.string(),
  timeframe: z.string(),
  focus: z.string(),
  tasks: z.array(z.string()).min(1).max(6),
});

const kpiSchema = z.object({
  name: z.string(),
  target: z.string(),
});

const budgetItemSchema = z.object({
  category: z.string(),
  percent: z.number().min(0).max(100),
});

const riskSchema = z.object({
  risk: z.string(),
  mitigation: z.string(),
});

export const marketingPlanResultSchema = z.object({
  executiveSummary: z.string(),
  idealCustomerPersona: personaSchema,
  brandPositioning: z.string(),
  swot: swotSchema,
  marketingFunnel: marketingFunnelSchema,
  leadGenerationStrategy: z.string(),
  coldOutreachStrategy: z.string(),
  emailCampaignStrategy: z.string(),
  seoStrategy: z.string(),
  contentStrategy: z.string(),
  socialMediaOverview: z.string(),
  socialChannels: socialChannelsSchema,
  paidAdvertisingStrategy: z.string(),
  partnershipStrategy: z.string(),
  referralStrategy: z.string(),
  monthlyActionPlan: z.array(z.string()).min(3).max(10),
  weeklyActionPlan: z.array(z.string()).min(3).max(10),
  dailyActionPlan: z.array(z.string()).min(3).max(10),
  ninetyDayRoadmap: z.array(roadmapPhaseSchema).min(2).max(4),
  kpis: z.array(kpiSchema).min(3).max(8),
  budgetAllocation: z.array(budgetItemSchema).min(3).max(8),
  expectedResults: z.array(z.string()).min(2).max(6),
  risks: z.array(riskSchema).min(2).max(6),
  recommendations: z.array(z.string()).min(3).max(8),
  bonusOpportunities: z.array(z.string()).min(2).max(6),
});

export type MarketingPlanResult = z.infer<typeof marketingPlanResultSchema>;
