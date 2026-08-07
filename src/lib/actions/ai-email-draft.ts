"use server";

import { getLocale } from "next-intl/server";

import { requireWorkspace } from "@/lib/workspace";
import { getAiChatCompletion } from "@/lib/ai/provider";
import { buildEmailDraftPrompt } from "@/lib/ai/prompts";
import { jsonSchemaValidator, parseAiJson } from "@/lib/ai/parse-json";
import { emailDraftResultSchema, type EmailDraftResult } from "@/lib/ai/schemas";
import { logSystemEvent } from "@/lib/system-log";

export type AiActionResult<T> = { ok: true; data: T } | { ok: false; errorCode: string };

export type EmailDraftInput = {
  purpose: string;
  recipient: string;
  tone: string;
  keyPoints: string;
};

const FEATURE = "ai.emailDraft";

export async function draftEmail(input: EmailDraftInput): Promise<AiActionResult<EmailDraftResult>> {
  await requireWorkspace();
  if (!input.purpose.trim()) return { ok: false, errorCode: "PURPOSE_REQUIRED" };

  const locale = await getLocale();
  const { system, user } = buildEmailDraftPrompt(input, locale);

  const result = await getAiChatCompletion({
    feature: FEATURE,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    jsonMode: true,
    cache: true,
    validateContent: jsonSchemaValidator(emailDraftResultSchema),
  });
  if (!result.ok) return { ok: false, errorCode: result.errorCode };

  const raw = result.content;
  if (!raw) return { ok: false, errorCode: "AI_EMPTY_RESPONSE" };

  const parsed = parseAiJson(FEATURE, emailDraftResultSchema, raw);
  if (!parsed.ok) return parsed;

  logSystemEvent({ message: "AI email draft generated", feature: FEATURE }).catch(() => {});
  return { ok: true, data: parsed.data };
}
