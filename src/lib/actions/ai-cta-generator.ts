"use server";

import { getLocale } from "next-intl/server";

import { requireWorkspace } from "@/lib/workspace";
import { getOpenAIClientSafe, AI_MODEL } from "@/lib/ai/client";
import { buildCtaGeneratorPrompt } from "@/lib/ai/prompts";
import { ctaGeneratorResultSchema, type CtaGeneratorResult } from "@/lib/ai/schemas";
import { logSystemEvent } from "@/lib/system-log";

export type AiActionResult<T> = { ok: true; data: T } | { ok: false; errorCode: string };

export async function generateCtas(goal: string, context: string): Promise<AiActionResult<CtaGeneratorResult>> {
  await requireWorkspace();
  if (!goal.trim()) return { ok: false, errorCode: "GOAL_REQUIRED" };

  const clientResult = getOpenAIClientSafe();
  if ("error" in clientResult) return { ok: false, errorCode: clientResult.error };

  const locale = await getLocale();
  const { system, user } = buildCtaGeneratorPrompt(goal, context, locale);

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

    const parsed = ctaGeneratorResultSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return { ok: false, errorCode: "AI_INVALID_RESPONSE" };

    logSystemEvent({ message: "AI CTAs generated", feature: "ai.ctaGenerator" }).catch(() => {});
    return { ok: true, data: parsed.data };
  } catch {
    return { ok: false, errorCode: "AI_ERROR" };
  }
}
