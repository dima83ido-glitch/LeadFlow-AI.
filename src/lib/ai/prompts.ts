import type { PageSignals } from "@/lib/ai/fetch-page";
import { WEBSITE_ANALYSIS_CATEGORIES } from "@/lib/ai/schemas";

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
