import type { PageSignals } from "@/lib/ai/fetch-page";
import { WEBSITE_ANALYSIS_CATEGORIES, type MarketingPlanInput } from "@/lib/ai/schemas";

const LOCALE_NAMES: Record<string, string> = {
  ru: "Russian",
  en: "English",
  uk: "Ukrainian",
};

export function localeToLanguageName(locale: string): string {
  return LOCALE_NAMES[locale] ?? "English";
}

export function buildWebsiteAnalysisPrompt(signals: PageSignals, locale: string) {
  const language = localeToLanguageName(locale);
  const system = `You are a senior website auditor producing a structured JSON report. Always respond in ${language}, including every label, detail, and recommendation string. Respond with ONLY a single JSON object matching the requested shape — no markdown, no commentary.`;

  const user = `Analyze this website using the signals below (you cannot browse further, so reason from what's given plus general best practices for a site like this).

URL: ${signals.finalUrl}
HTTPS: ${signals.isHttps}
Title: ${signals.title ?? "(none found)"}
Meta description: ${signals.metaDescription ?? "(none found)"}
Has viewport meta tag: ${signals.hasViewportMeta}
Approx HTML size: ${signals.htmlLength} bytes
Visible text sample: """${signals.textSnippet.slice(0, 2000)}"""

Produce a JSON object with this exact shape:
{
  "overallScore": number 0-100,
  "categories": [
    { "key": one of [${WEBSITE_ANALYSIS_CATEGORIES.map((c) => `"${c}"`).join(", ")}], "score": number 0-100, "findings": [ { "status": "good"|"warning"|"bad", "label": string, "detail": string } (1-3 per category) ] }
  ],
  "recommendations": [string, ...] (3-6 concrete, prioritized recommendations)
}

Include exactly one entry per category key listed above, in that order. Every "label" and "detail" and recommendation string must be written in ${language}.`;

  return { system, user };
}

export function buildLandingPageAnalysisPrompt(signals: PageSignals, locale: string) {
  const language = localeToLanguageName(locale);
  const system = `You are a conversion rate optimization expert producing a structured JSON report. Always respond in ${language}. Respond with ONLY a single JSON object matching the requested shape — no markdown, no commentary.`;

  const user = `Evaluate this landing page's structure and conversion signals using what's given (you cannot browse further).

URL: ${signals.finalUrl}
Title: ${signals.title ?? "(none found)"}
Meta description: ${signals.metaDescription ?? "(none found)"}
Visible text sample: """${signals.textSnippet.slice(0, 2000)}"""

Produce a JSON object with this exact shape:
{
  "score": number 0-100 (overall conversion readiness),
  "findings": [ { "status": "good"|"warning"|"bad", "label": string, "detail": string } ] (4-6 findings covering headline clarity, CTA visibility, social proof, page structure/length, and trust signals)
}

Every "label" and "detail" must be written in ${language}.`;

  return { system, user };
}

export function buildTranslationPrompt(text: string, targetLanguageName: string) {
  const system = `You are a professional translator for business outreach emails. Preserve tone, intent, and formatting. Respond with ONLY a single JSON object: {"translatedText": string} — no markdown, no commentary.`;
  const user = `Translate the following email into ${targetLanguageName}:\n\n"""${text.slice(0, 4000)}"""`;
  return { system, user };
}

export function buildMarketingPlanPrompt(input: MarketingPlanInput, locale: string) {
  const language = localeToLanguageName(locale);
  const system = `You are a senior growth marketing strategist producing a complete, actionable marketing plan as structured JSON. Always respond in ${language}, including every string value. Be specific and concrete — reference the business's actual industry, audience, and budget rather than generic filler. Respond with ONLY a single JSON object matching the requested shape — no markdown, no commentary.`;

  const user = `Create a full marketing strategy for this business:

Business name: ${input.businessName}
Industry: ${input.industry}
Target audience: ${input.targetAudience}
Products: ${input.products || "(none specified)"}
Services: ${input.services || "(none specified)"}
Marketing goals: ${input.marketingGoals}
Monthly budget: ${input.monthlyBudget}
Timeline: ${input.timeline}
Social networks currently used: ${input.socialNetworks || "(none specified)"}
Has an email list: ${input.hasEmailList ? `Yes (${input.emailListSize || "size unspecified"} subscribers)` : "No"}
Current marketing activities: ${input.currentMarketingActivities || "(none specified)"}
Biggest marketing challenge: ${input.biggestChallenge}
Unique selling proposition: ${input.uniqueSellingProposition}
Existing assets: ${input.existingAssets || "(none specified)"}
Available resources: ${input.resources || "(none specified)"}
Current offers: ${input.offers || "(none specified)"}
Existing customer personas: ${input.personas || "(none specified)"}

Produce a JSON object with this exact shape:
{
  "executiveSummary": string (3-5 sentences),
  "idealCustomerPersona": { "name": string, "summary": string, "demographics": string, "painPoints": string[3-5], "goals": string[3-5] },
  "brandPositioning": string (2-4 sentences),
  "swot": { "strengths": string[3-5], "weaknesses": string[3-5], "opportunities": string[3-5], "threats": string[3-5] },
  "marketingFunnel": { "awareness": string, "consideration": string, "conversion": string, "retention": string },
  "leadGenerationStrategy": string,
  "coldOutreachStrategy": string,
  "emailCampaignStrategy": string,
  "seoStrategy": string,
  "contentStrategy": string,
  "socialMediaOverview": string,
  "socialChannels": { "linkedin": string, "facebook": string, "instagram": string, "tiktok": string, "youtube": string },
  "paidAdvertisingStrategy": string,
  "partnershipStrategy": string,
  "referralStrategy": string,
  "monthlyActionPlan": string[4-8],
  "weeklyActionPlan": string[4-8],
  "dailyActionPlan": string[4-8],
  "ninetyDayRoadmap": [ { "phase": string, "timeframe": string, "focus": string, "tasks": string[2-5] } ] (exactly 3 phases covering days 1-30, 31-60, 61-90),
  "kpis": [ { "name": string, "target": string } ] (4-6 KPIs),
  "budgetAllocation": [ { "category": string, "percent": number } ] (4-7 categories, percentages must sum to 100),
  "expectedResults": string[3-5],
  "risks": [ { "risk": string, "mitigation": string } ] (3-5 items),
  "recommendations": string[4-6],
  "bonusOpportunities": string[3-5]
}

Tailor every section to the business's actual budget (${input.monthlyBudget}) and timeline (${input.timeline}). Every string value must be written in ${language}.`;

  return { system, user };
}
