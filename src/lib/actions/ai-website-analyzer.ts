"use server";

import { getLocale } from "next-intl/server";

import { requireWorkspace } from "@/lib/workspace";
import { getAiChatCompletion } from "@/lib/ai/provider";
import { AI_REQUEST_TIMEOUT_MS_MEDIUM } from "@/lib/ai/config";
import { fetchPageSignals } from "@/lib/ai/fetch-page";
import { buildWebsiteAnalysisCategoryBatchPrompt, WEBSITE_ANALYSIS_CATEGORY_BATCHES } from "@/lib/ai/prompts";
import { jsonSchemaValidator, parseAiJson } from "@/lib/ai/parse-json";
import {
  websiteAnalysisCategoryBatchSchema,
  websiteAnalysisResultSchema,
  type CategoryResult,
  type WebsiteAnalysisResult,
} from "@/lib/ai/schemas";
import { logSystemEvent } from "@/lib/system-log";

export type AiActionResult<T> = { ok: true; data: T } | { ok: false; errorCode: string };

export type WebsiteAnalysisData = WebsiteAnalysisResult & {
  analyzedUrl: string;
  isHttps: boolean;
};

const MAX_URL_LENGTH = 2048;
const FEATURE = "ai.websiteAnalyzer";

const SEVERITY_RANK: Record<CategoryResult["findings"][number]["status"], number> = {
  bad: 0,
  warning: 1,
  good: 2,
};

/**
 * Recommendations are derived from the categories' own findings instead of
 * asked of the model as a separate part of the JSON shape — it's a simple
 * "surface the worst findings" aggregate, not something that needs its own
 * generation or round trip, and keeping it out of the schema is one less
 * thing inflating any single batch's output size (see batching note below).
 */
function deriveRecommendations(categories: CategoryResult[]): string[] {
  const sorted = categories
    .flatMap((category) => category.findings)
    .sort((a, b) => SEVERITY_RANK[a.status] - SEVERITY_RANK[b.status]);
  return sorted.slice(0, 6).map((finding) => finding.detail);
}

export async function analyzeWebsite(url: string): Promise<AiActionResult<WebsiteAnalysisData>> {
  await requireWorkspace();

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return { ok: false, errorCode: "URL_REQUIRED" };
  if (trimmedUrl.length > MAX_URL_LENGTH) return { ok: false, errorCode: "INVALID_URL" };

  const pageResult = await fetchPageSignals(trimmedUrl);
  if (!pageResult.ok) return { ok: false, errorCode: pageResult.errorCode };

  const locale = await getLocale();

  // Asking one model for all 13 categories in a single completion was the
  // actual root cause of the "AI took too long" failures — verified
  // directly against OpenRouter that free-tier models reliably answer
  // within a few seconds up to ~3 categories per request, then hang
  // indefinitely (no error, just an eventual timeout) past that, regardless
  // of the source page's size or which of the 3 models in the chain
  // answers. Each small batch independently gets the full resilient router
  // (model chain + transient retry + schema-validated fallback), and all
  // batches run concurrently so the wall-clock cost is one batch's latency,
  // not the sum of all of them.
  const batchResults = await Promise.all(
    WEBSITE_ANALYSIS_CATEGORY_BATCHES.map(async (categoryKeys, index) => {
      const { system, user } = buildWebsiteAnalysisCategoryBatchPrompt(pageResult.signals, locale, categoryKeys);
      const batchFeature = `${FEATURE}.batch${index}[${categoryKeys.join(",")}]`;

      const result = await getAiChatCompletion({
        feature: batchFeature,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        jsonMode: true,
        cache: true,
        timeoutMs: AI_REQUEST_TIMEOUT_MS_MEDIUM,
        validateContent: jsonSchemaValidator(websiteAnalysisCategoryBatchSchema),
      });
      if (!result.ok) return { ok: false as const, errorCode: result.errorCode, categoryKeys };

      const raw = result.content;
      if (!raw) return { ok: false as const, errorCode: "AI_EMPTY_RESPONSE", categoryKeys };

      const parsed = parseAiJson(batchFeature, websiteAnalysisCategoryBatchSchema, raw);
      if (!parsed.ok) return { ok: false as const, errorCode: parsed.errorCode, categoryKeys };

      return { ok: true as const, categories: parsed.data.categories };
    }),
  );

  const failedBatch = batchResults.find((batch) => !batch.ok);
  if (failedBatch && !failedBatch.ok) {
    console.error(
      `${FEATURE}: batch for categories [${failedBatch.categoryKeys.join(", ")}] failed with ${failedBatch.errorCode} — aborting whole analysis.`,
    );
    return { ok: false, errorCode: failedBatch.errorCode };
  }

  const categories = batchResults.flatMap((batch) => (batch.ok ? batch.categories : []));
  const overallScore = Math.round(categories.reduce((sum, c) => sum + c.score, 0) / categories.length);
  const recommendations = deriveRecommendations(categories);

  const merged = websiteAnalysisResultSchema.safeParse({ overallScore, categories, recommendations });
  if (!merged.success) {
    console.error(`${FEATURE}: merged batches failed final schema validation:`, merged.error.message);
    return { ok: false, errorCode: "AI_INVALID_RESPONSE" };
  }

  // Logging is a side effect, not part of the result — a DB hiccup here must
  // never discard an analysis the user already successfully got back.
  logSystemEvent({ message: "AI website analysis generated", feature: FEATURE }).catch(() => {});
  return {
    ok: true,
    data: {
      ...merged.data,
      analyzedUrl: pageResult.signals.finalUrl,
      isHttps: pageResult.signals.isHttps,
    },
  };
}
