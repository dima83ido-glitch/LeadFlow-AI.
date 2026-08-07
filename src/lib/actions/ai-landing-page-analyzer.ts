"use server";

import { getLocale } from "next-intl/server";

import { requireWorkspace } from "@/lib/workspace";
import { getAiChatCompletion } from "@/lib/ai/provider";
import { fetchPageSignals } from "@/lib/ai/fetch-page";
import { buildLandingPageAnalysisPrompt } from "@/lib/ai/prompts";
import { jsonSchemaValidator, parseAiJson } from "@/lib/ai/parse-json";
import { landingPageAnalysisResultSchema, type LandingPageAnalysisResult } from "@/lib/ai/schemas";
import { logSystemEvent } from "@/lib/system-log";

export type AiActionResult<T> = { ok: true; data: T } | { ok: false; errorCode: string };

export type LandingPageAnalysisData = LandingPageAnalysisResult & {
  analyzedUrl: string;
  isHttps: boolean;
};

const MAX_URL_LENGTH = 2048;
const FEATURE = "ai.landingPageAnalyzer";

export async function analyzeLandingPage(url: string): Promise<AiActionResult<LandingPageAnalysisData>> {
  await requireWorkspace();

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return { ok: false, errorCode: "URL_REQUIRED" };
  if (trimmedUrl.length > MAX_URL_LENGTH) return { ok: false, errorCode: "INVALID_URL" };

  const pageResult = await fetchPageSignals(trimmedUrl);
  if (!pageResult.ok) return { ok: false, errorCode: pageResult.errorCode };

  const locale = await getLocale();
  const { system, user } = buildLandingPageAnalysisPrompt(pageResult.signals, locale);

  const result = await getAiChatCompletion({
    feature: FEATURE,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    jsonMode: true,
    cache: true,
    validateContent: jsonSchemaValidator(landingPageAnalysisResultSchema),
  });
  if (!result.ok) return { ok: false, errorCode: result.errorCode };

  const raw = result.content;
  if (!raw) return { ok: false, errorCode: "AI_EMPTY_RESPONSE" };

  const parsed = parseAiJson(FEATURE, landingPageAnalysisResultSchema, raw);
  if (!parsed.ok) return parsed;

  logSystemEvent({ message: "AI landing page analysis generated", feature: FEATURE }).catch(() => {});
  return {
    ok: true,
    data: {
      ...parsed.data,
      analyzedUrl: pageResult.signals.finalUrl,
      isHttps: pageResult.signals.isHttps,
    },
  };
}
