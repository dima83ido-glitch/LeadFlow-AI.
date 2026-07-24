"use server";

import { requireWorkspace } from "@/lib/workspace";
import { getOpenAIClientSafe, AI_MODEL } from "@/lib/ai/client";
import { buildTranslationPrompt } from "@/lib/ai/prompts";
import { translationResultSchema, type TranslationResult } from "@/lib/ai/schemas";
import { LANGUAGES } from "@/lib/languages";
import { logSystemEvent } from "@/lib/system-log";

export type AiActionResult<T> = { ok: true; data: T } | { ok: false; errorCode: string };

export async function translateEmail(text: string, languageCode: string): Promise<AiActionResult<TranslationResult>> {
  await requireWorkspace();
  if (!text.trim()) return { ok: false, errorCode: "TEXT_REQUIRED" };

  const language = LANGUAGES.find((l) => l.code === languageCode);
  if (!language) return { ok: false, errorCode: "INVALID_LANGUAGE" };

  const clientResult = getOpenAIClientSafe();
  if ("error" in clientResult) return { ok: false, errorCode: clientResult.error };

  const { system, user } = buildTranslationPrompt(text, language.nameEn);

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

    const parsed = translationResultSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return { ok: false, errorCode: "AI_INVALID_RESPONSE" };

    await logSystemEvent({ message: "AI email translation generated", feature: "ai.emailTranslation" });
    return { ok: true, data: parsed.data };
  } catch {
    return { ok: false, errorCode: "AI_ERROR" };
  }
}
