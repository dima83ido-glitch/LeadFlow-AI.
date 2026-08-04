"use server";

import { getLocale } from "next-intl/server";

import { requireWorkspace } from "@/lib/workspace";
import { getOpenAIClientSafe, AI_MODEL } from "@/lib/ai/client";
import { fetchPageSignals } from "@/lib/ai/fetch-page";
import { buildSeoAuditPrompt } from "@/lib/ai/prompts";
import { seoAuditResultSchema, type SeoAuditResult } from "@/lib/ai/schemas";
import { logSystemEvent } from "@/lib/system-log";

export type AiActionResult<T> = { ok: true; data: T } | { ok: false; errorCode: string };

export async function analyzeSeo(url: string): Promise<AiActionResult<SeoAuditResult>> {
  await requireWorkspace();
  if (!url.trim()) return { ok: false, errorCode: "URL_REQUIRED" };

  const clientResult = getOpenAIClientSafe();
  if ("error" in clientResult) return { ok: false, errorCode: clientResult.error };

  const pageResult = await fetchPageSignals(url);
  if (!pageResult.ok) return { ok: false, errorCode: pageResult.errorCode };

  const locale = await getLocale();
  const { system, user } = buildSeoAuditPrompt(pageResult.signals, locale);

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

    const parsed = seoAuditResultSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return { ok: false, errorCode: "AI_INVALID_RESPONSE" };

    logSystemEvent({ message: "AI SEO audit generated", feature: "ai.seoAudit" }).catch(() => {});
    return { ok: true, data: parsed.data };
  } catch {
    return { ok: false, errorCode: "AI_ERROR" };
  }
}
