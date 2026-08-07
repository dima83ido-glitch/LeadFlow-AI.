"use server";

import { getLocale } from "next-intl/server";

import { requireWorkspace } from "@/lib/workspace";
import { getAiChatCompletion } from "@/lib/ai/provider";
import { buildSubjectGeneratorPrompt } from "@/lib/ai/prompts";
import { jsonSchemaValidator, parseAiJson } from "@/lib/ai/parse-json";
import { subjectGeneratorResultSchema, type SubjectGeneratorResult } from "@/lib/ai/schemas";
import { logSystemEvent } from "@/lib/system-log";

export type AiActionResult<T> = { ok: true; data: T } | { ok: false; errorCode: string };

const FEATURE = "ai.subjectGenerator";

export async function generateSubjectLines(
  context: string,
  tone: string,
): Promise<AiActionResult<SubjectGeneratorResult>> {
  await requireWorkspace();
  if (!context.trim()) return { ok: false, errorCode: "CONTEXT_REQUIRED" };

  const locale = await getLocale();
  const { system, user } = buildSubjectGeneratorPrompt(context, tone, locale);

  const result = await getAiChatCompletion({
    feature: FEATURE,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    jsonMode: true,
    cache: true,
    validateContent: jsonSchemaValidator(subjectGeneratorResultSchema),
  });
  if (!result.ok) return { ok: false, errorCode: result.errorCode };

  const raw = result.content;
  if (!raw) return { ok: false, errorCode: "AI_EMPTY_RESPONSE" };

  const parsed = parseAiJson(FEATURE, subjectGeneratorResultSchema, raw);
  if (!parsed.ok) return parsed;

  logSystemEvent({ message: "AI subject lines generated", feature: FEATURE }).catch(() => {});
  return { ok: true, data: parsed.data };
}
