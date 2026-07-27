"use server";

import { APIConnectionTimeoutError, RateLimitError } from "openai";
import { getLocale } from "next-intl/server";

import { requireWorkspace } from "@/lib/workspace";
import { getOpenAIClientSafe, AI_MODEL } from "@/lib/ai/client";
import { fetchPageSignals } from "@/lib/ai/fetch-page";
import { buildWebsiteAnalysisPrompt } from "@/lib/ai/prompts";
import { websiteAnalysisResultSchema, type WebsiteAnalysisResult } from "@/lib/ai/schemas";
import { logSystemEvent } from "@/lib/system-log";

export type AiActionResult<T> = { ok: true; data: T } | { ok: false; errorCode: string };

export type WebsiteAnalysisData = WebsiteAnalysisResult & {
  analyzedUrl: string;
  isHttps: boolean;
};

const MAX_URL_LENGTH = 2048;

export async function analyzeWebsite(url: string): Promise<AiActionResult<WebsiteAnalysisData>> {
  await requireWorkspace();

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return { ok: false, errorCode: "URL_REQUIRED" };
  if (trimmedUrl.length > MAX_URL_LENGTH) return { ok: false, errorCode: "INVALID_URL" };

  const clientResult = getOpenAIClientSafe();
  if ("error" in clientResult) return { ok: false, errorCode: clientResult.error };

  const pageResult = await fetchPageSignals(trimmedUrl);
  if (!pageResult.ok) return { ok: false, errorCode: pageResult.errorCode };

  const locale = await getLocale();
  const { system, user } = buildWebsiteAnalysisPrompt(pageResult.signals, locale);

  try {
    const completion = await clientResult.client.chat.completions.create({
      model: AI_MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return { ok: false, errorCode: "AI_EMPTY_RESPONSE" };

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      return { ok: false, errorCode: "AI_INVALID_RESPONSE" };
    }

    const parsed = websiteAnalysisResultSchema.safeParse(json);
    if (!parsed.success) return { ok: false, errorCode: "AI_INVALID_RESPONSE" };

    // Logging is a side effect, not part of the result — a DB hiccup here must
    // never discard an analysis the user already successfully got back.
    logSystemEvent({ message: "AI website analysis generated", feature: "ai.websiteAnalyzer" }).catch(() => {});
    return {
      ok: true,
      data: {
        ...parsed.data,
        analyzedUrl: pageResult.signals.finalUrl,
        isHttps: pageResult.signals.isHttps,
      },
    };
  } catch (err) {
    if (err instanceof APIConnectionTimeoutError) return { ok: false, errorCode: "AI_TIMEOUT" };
    if (err instanceof RateLimitError) return { ok: false, errorCode: "AI_RATE_LIMITED" };
    return { ok: false, errorCode: "AI_ERROR" };
  }
}
