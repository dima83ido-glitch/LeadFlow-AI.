"use server";

import { getLocale } from "next-intl/server";

import { requireWorkspace } from "@/lib/workspace";
import { getOpenAIClientSafe, AI_MODEL } from "@/lib/ai/client";
import { buildEmailRewritePrompt } from "@/lib/ai/prompts";
import { emailRewriteResultSchema, type EmailRewriteResult } from "@/lib/ai/schemas";
import { logSystemEvent } from "@/lib/system-log";

export type AiActionResult<T> = { ok: true; data: T } | { ok: false; errorCode: string };

export async function rewriteEmail(text: string, tone: string): Promise<AiActionResult<EmailRewriteResult>> {
  await requireWorkspace();
  if (!text.trim()) return { ok: false, errorCode: "TEXT_REQUIRED" };

  const clientResult = getOpenAIClientSafe();
  if ("error" in clientResult) return { ok: false, errorCode: clientResult.error };

  const locale = await getLocale();
  const { system, user } = buildEmailRewritePrompt(text, tone, locale);

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

    const parsed = emailRewriteResultSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return { ok: false, errorCode: "AI_INVALID_RESPONSE" };

    logSystemEvent({ message: "AI email rewrite generated", feature: "ai.emailRewrite" }).catch(() => {});
    return { ok: true, data: parsed.data };
  } catch {
    return { ok: false, errorCode: "AI_ERROR" };
  }
}
