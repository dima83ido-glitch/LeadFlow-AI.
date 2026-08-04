"use server";

import { getLocale } from "next-intl/server";

import { requireWorkspace } from "@/lib/workspace";
import { getOpenAIClientSafe, AI_MODEL } from "@/lib/ai/client";
import { buildEmailDraftPrompt } from "@/lib/ai/prompts";
import { emailDraftResultSchema, type EmailDraftResult } from "@/lib/ai/schemas";
import { logSystemEvent } from "@/lib/system-log";

export type AiActionResult<T> = { ok: true; data: T } | { ok: false; errorCode: string };

export type EmailDraftInput = {
  purpose: string;
  recipient: string;
  tone: string;
  keyPoints: string;
};

export async function draftEmail(input: EmailDraftInput): Promise<AiActionResult<EmailDraftResult>> {
  await requireWorkspace();
  if (!input.purpose.trim()) return { ok: false, errorCode: "PURPOSE_REQUIRED" };

  const clientResult = getOpenAIClientSafe();
  if ("error" in clientResult) return { ok: false, errorCode: clientResult.error };

  const locale = await getLocale();
  const { system, user } = buildEmailDraftPrompt(input, locale);

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

    const parsed = emailDraftResultSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return { ok: false, errorCode: "AI_INVALID_RESPONSE" };

    logSystemEvent({ message: "AI email draft generated", feature: "ai.emailDraft" }).catch(() => {});
    return { ok: true, data: parsed.data };
  } catch {
    return { ok: false, errorCode: "AI_ERROR" };
  }
}
