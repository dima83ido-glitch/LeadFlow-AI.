"use server";

import { getLocale } from "next-intl/server";

import { requireWorkspace } from "@/lib/workspace";
import { getAiChatCompletion } from "@/lib/ai/provider";
import { fetchPageSignals } from "@/lib/ai/fetch-page";
import { buildSeoAuditPrompt } from "@/lib/ai/prompts";
import { seoAuditResultSchema, type SeoAuditResult } from "@/lib/ai/schemas";
import { logSystemEvent } from "@/lib/system-log";

export type AiActionResult<T> = { ok: true; data: T } | { ok: false; errorCode: string };

const FEATURE = "ai.seoAudit";

export async function analyzeSeo(url: string): Promise<AiActionResult<SeoAuditResult>> {
  await requireWorkspace();
  if (!url.trim()) return { ok: false, errorCode: "URL_REQUIRED" };

  const pageResult = await fetchPageSignals(url);
  if (!pageResult.ok) return { ok: false, errorCode: pageResult.errorCode };

  const locale = await getLocale();
  const { system, user } = buildSeoAuditPrompt(pageResult.signals, locale);

  const result = await getAiChatCompletion({
    feature: FEATURE,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    jsonMode: true,
    cache: true,
  });
  if (!result.ok) return { ok: false, errorCode: result.errorCode };

  const raw = result.content;
  if (!raw) return { ok: false, errorCode: "AI_EMPTY_RESPONSE" };

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (err) {
    console.error(`${FEATURE}: failed to parse AI response as JSON:`, err);
    return { ok: false, errorCode: "AI_INVALID_RESPONSE" };
  }

  const parsed = seoAuditResultSchema.safeParse(json);
  if (!parsed.success) {
    console.error(`${FEATURE}: AI response failed schema validation:`, parsed.error.message);
    return { ok: false, errorCode: "AI_INVALID_RESPONSE" };
  }

  logSystemEvent({ message: "AI SEO audit generated", feature: FEATURE }).catch(() => {});
  return { ok: true, data: parsed.data };
}
