"use server";

import { getLocale } from "next-intl/server";

import { requireWorkspace } from "@/lib/workspace";
import { getOpenAIClientSafe, AI_MODEL } from "@/lib/ai/client";
import { buildMarketingPlanPrompt } from "@/lib/ai/prompts";
import { marketingPlanResultSchema, type MarketingPlanInput, type MarketingPlanResult } from "@/lib/ai/schemas";
import { logSystemEvent } from "@/lib/system-log";

export type AiActionResult<T> = { ok: true; data: T } | { ok: false; errorCode: string };

const REQUIRED_FIELDS: (keyof MarketingPlanInput)[] = [
  "businessName",
  "industry",
  "targetAudience",
  "marketingGoals",
  "monthlyBudget",
  "timeline",
  "biggestChallenge",
  "uniqueSellingProposition",
];

export async function generateMarketingPlan(input: MarketingPlanInput): Promise<AiActionResult<MarketingPlanResult>> {
  await requireWorkspace();

  for (const field of REQUIRED_FIELDS) {
    if (!String(input[field] ?? "").trim()) return { ok: false, errorCode: "REQUIRED_FIELDS_MISSING" };
  }

  const clientResult = getOpenAIClientSafe();
  if ("error" in clientResult) return { ok: false, errorCode: clientResult.error };

  const locale = await getLocale();
  const { system, user } = buildMarketingPlanPrompt(input, locale);

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

    const parsed = marketingPlanResultSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return { ok: false, errorCode: "AI_INVALID_RESPONSE" };

    await logSystemEvent({ message: "AI marketing plan generated", feature: "ai.marketingPlanGenerator" });
    return { ok: true, data: parsed.data };
  } catch {
    return { ok: false, errorCode: "AI_ERROR" };
  }
}
