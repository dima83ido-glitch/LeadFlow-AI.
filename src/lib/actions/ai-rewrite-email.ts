"use server";

import { getLocale } from "next-intl/server";

import { requireWorkspace } from "@/lib/workspace";
import { getAiChatCompletion } from "@/lib/ai/provider";
import { buildEmailRewritePrompt } from "@/lib/ai/prompts";
import { jsonSchemaValidator, parseAiJson } from "@/lib/ai/parse-json";
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
    validateContent: jsonSchemaValidator(emailRewriteResultSchema),
  });
  if (!result.ok) return { ok: false, errorCode: result.errorCode };

  const raw = result.content;
  if (!raw) return { ok: false, errorCode: "AI_EMPTY_RESPONSE" };

  const parsed = parseAiJson(FEATURE, emailRewriteResultSchema, raw);
  if (!parsed.ok) return parsed;

  logSystemEvent({ message: "AI email rewrite generated", feature: FEATURE }).catch(() => {});
  return { ok: true, data: parsed.data };
}
