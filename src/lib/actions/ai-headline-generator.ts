"use server";

import { getLocale } from "next-intl/server";

import { requireWorkspace } from "@/lib/workspace";
import { getOpenAIClientSafe, AI_MODEL } from "@/lib/ai/client";
import { buildHeadlineGeneratorPrompt } from "@/lib/ai/prompts";
import { headlineGeneratorResultSchema, type HeadlineGeneratorResult } from "@/lib/ai/schemas";
import { logSystemEvent } from "@/lib/system-log";

export type AiActionResult<T> = { ok: true; data: T } | { ok: false; errorCode: string };

export async function generateHeadlines(
  product: string,
  valueProp: string,
): Promise<AiActionResult<HeadlineGeneratorResult>> {
  await requireWorkspace();
  if (!product.trim()) return { ok: false, errorCode: "PRODUCT_REQUIRED" };

  const clientResult = getOpenAIClientSafe();
  if ("error" in clientResult) return { ok: false, errorCode: clientResult.error };

  const locale = await getLocale();
  const { system, user } = buildHeadlineGeneratorPrompt(product, valueProp, locale);

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

    const parsed = headlineGeneratorResultSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return { ok: false, errorCode: "AI_INVALID_RESPONSE" };

    logSystemEvent({ message: "AI headlines generated", feature: "ai.headlineGenerator" }).catch(() => {});
    return { ok: true, data: parsed.data };
  } catch {
    return { ok: false, errorCode: "AI_ERROR" };
  }
}
