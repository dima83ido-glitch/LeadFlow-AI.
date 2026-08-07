"use server";

import { requireWorkspace } from "@/lib/workspace";
import { getAiChatCompletion } from "@/lib/ai/provider";
import { buildTranslationPrompt } from "@/lib/ai/prompts";
import { jsonSchemaValidator, parseAiJson } from "@/lib/ai/parse-json";
import { translationResultSchema, type TranslationResult } from "@/lib/ai/schemas";
import { LANGUAGES } from "@/lib/languages";
import { logSystemEvent } from "@/lib/system-log";

export type AiActionResult<T> = { ok: true; data: T } | { ok: false; errorCode: string };

const FEATURE = "ai.emailTranslation";

export async function translateEmail(text: string, languageCode: string): Promise<AiActionResult<TranslationResult>> {
  await requireWorkspace();
  if (!text.trim()) return { ok: false, errorCode: "TEXT_REQUIRED" };

  const language = LANGUAGES.find((l) => l.code === languageCode);
  if (!language) return { ok: false, errorCode: "INVALID_LANGUAGE" };

  const { system, user } = buildTranslationPrompt(text, language.nameEn);

  const result = await getAiChatCompletion({
    feature: FEATURE,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    jsonMode: true,
    cache: true,
    validateContent: jsonSchemaValidator(translationResultSchema),
  });
  if (!result.ok) return { ok: false, errorCode: result.errorCode };

  const raw = result.content;
  if (!raw) return { ok: false, errorCode: "AI_EMPTY_RESPONSE" };

  const parsed = parseAiJson(FEATURE, translationResultSchema, raw);
  if (!parsed.ok) return parsed;

  logSystemEvent({ message: "AI email translation generated", feature: FEATURE }).catch(() => {});
  return { ok: true, data: parsed.data };
}
