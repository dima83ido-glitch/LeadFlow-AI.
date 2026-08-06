"use server";

import { requireWorkspace } from "@/lib/workspace";
import { getAiChatCompletion } from "@/lib/ai/provider";
import { buildTranslationPrompt } from "@/lib/ai/prompts";
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

  const parsed = translationResultSchema.safeParse(json);
  if (!parsed.success) {
    console.error(`${FEATURE}: AI response failed schema validation:`, parsed.error.message);
    return { ok: false, errorCode: "AI_INVALID_RESPONSE" };
  }

  logSystemEvent({ message: "AI email translation generated", feature: FEATURE }).catch(() => {});
  return { ok: true, data: parsed.data };
}
