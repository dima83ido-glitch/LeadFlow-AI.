"use server";

import { getLocale } from "next-intl/server";

import { requireWorkspace } from "@/lib/workspace";
import { getAiChatCompletion } from "@/lib/ai/provider";
import { buildHeadlineGeneratorPrompt } from "@/lib/ai/prompts";
import { jsonSchemaValidator, parseAiJson } from "@/lib/ai/parse-json";
import { headlineGeneratorResultSchema, type HeadlineGeneratorResult } from "@/lib/ai/schemas";
import { logSystemEvent } from "@/lib/system-log";

export type AiActionResult<T> = { ok: true; data: T } | { ok: false; errorCode: string };

const FEATURE = "ai.headlineGenerator";

export async function generateHeadlines(
  product: string,
  valueProp: string,
): Promise<AiActionResult<HeadlineGeneratorResult>> {
  await requireWorkspace();
  if (!product.trim()) return { ok: false, errorCode: "PRODUCT_REQUIRED" };

  const locale = await getLocale();
  const { system, user } = buildHeadlineGeneratorPrompt(product, valueProp, locale);

  const result = await getAiChatCompletion({
    feature: FEATURE,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    jsonMode: true,
    cache: true,
    validateContent: jsonSchemaValidator(headlineGeneratorResultSchema),
  });
  if (!result.ok) return { ok: false, errorCode: result.errorCode };

  const raw = result.content;
  if (!raw) return { ok: false, errorCode: "AI_EMPTY_RESPONSE" };

  const parsed = parseAiJson(FEATURE, headlineGeneratorResultSchema, raw);
  if (!parsed.ok) return parsed;

  logSystemEvent({ message: "AI headlines generated", feature: FEATURE }).catch(() => {});
  return { ok: true, data: parsed.data };
}
