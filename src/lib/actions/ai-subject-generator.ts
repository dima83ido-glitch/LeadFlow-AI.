"use server";

import { getLocale } from "next-intl/server";

import { requireWorkspace } from "@/lib/workspace";
import { getAiChatCompletion } from "@/lib/ai/provider";
import { buildSubjectGeneratorPrompt } from "@/lib/ai/prompts";
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

  const parsed = subjectGeneratorResultSchema.safeParse(json);
  if (!parsed.success) {
    console.error(`${FEATURE}: AI response failed schema validation:`, parsed.error.message);
    return { ok: false, errorCode: "AI_INVALID_RESPONSE" };
  }

  logSystemEvent({ message: "AI subject lines generated", feature: FEATURE }).catch(() => {});
  return { ok: true, data: parsed.data };
}
