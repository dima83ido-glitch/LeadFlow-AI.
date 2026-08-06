"use server";

import { getLocale } from "next-intl/server";

import { requireWorkspace } from "@/lib/workspace";
import { getAiChatCompletion } from "@/lib/ai/provider";
import { buildEmailRewritePrompt } from "@/lib/ai/prompts";
import { emailRewriteResultSchema, type EmailRewriteResult } from "@/lib/ai/schemas";
import { logSystemEvent } from "@/lib/system-log";

export type AiActionResult<T> = { ok: true; data: T } | { ok: false; errorCode: string };

const FEATURE = "ai.emailRewrite";

export async function rewriteEmail(text: string, tone: string): Promise<AiActionResult<EmailRewriteResult>> {
  await requireWorkspace();
  if (!text.trim()) return { ok: false, errorCode: "TEXT_REQUIRED" };

  const locale = await getLocale();
  const { system, user } = buildEmailRewritePrompt(text, tone, locale);

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

  const parsed = emailRewriteResultSchema.safeParse(json);
  if (!parsed.success) {
    console.error(`${FEATURE}: AI response failed schema validation:`, parsed.error.message);
    return { ok: false, errorCode: "AI_INVALID_RESPONSE" };
  }

  logSystemEvent({ message: "AI email rewrite generated", feature: FEATURE }).catch(() => {});
  return { ok: true, data: parsed.data };
}
