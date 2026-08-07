"use server";

import { getLocale } from "next-intl/server";

import { requireWorkspace } from "@/lib/workspace";
import { getAiChatCompletion } from "@/lib/ai/provider";
import { buildCtaGeneratorPrompt } from "@/lib/ai/prompts";
import { jsonSchemaValidator, parseAiJson } from "@/lib/ai/parse-json";
import { ctaGeneratorResultSchema, type CtaGeneratorResult } from "@/lib/ai/schemas";
import { logSystemEvent } from "@/lib/system-log";

export type AiActionResult<T> = { ok: true; data: T } | { ok: false; errorCode: string };

const FEATURE = "ai.ctaGenerator";

export async function generateCtas(goal: string, context: string): Promise<AiActionResult<CtaGeneratorResult>> {
  await requireWorkspace();
  if (!goal.trim()) return { ok: false, errorCode: "GOAL_REQUIRED" };

  const locale = await getLocale();
  const { system, user } = buildCtaGeneratorPrompt(goal, context, locale);

  const result = await getAiChatCompletion({
    feature: FEATURE,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    jsonMode: true,
    cache: true,
    validateContent: jsonSchemaValidator(ctaGeneratorResultSchema),
  });
  if (!result.ok) return { ok: false, errorCode: result.errorCode };

  const raw = result.content;
  if (!raw) return { ok: false, errorCode: "AI_EMPTY_RESPONSE" };

  const parsed = parseAiJson(FEATURE, ctaGeneratorResultSchema, raw);
  if (!parsed.ok) return parsed;

  logSystemEvent({ message: "AI CTAs generated", feature: FEATURE }).catch(() => {});
  return { ok: true, data: parsed.data };
}
