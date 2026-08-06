"use server";

import { getLocale } from "next-intl/server";

import { requireWorkspace } from "@/lib/workspace";
import { getAiChatCompletion } from "@/lib/ai/provider";
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

const FEATURE = "ai.marketingPlanGenerator";

export async function generateMarketingPlan(input: MarketingPlanInput): Promise<AiActionResult<MarketingPlanResult>> {
  await requireWorkspace();

  for (const field of REQUIRED_FIELDS) {
    if (!String(input[field] ?? "").trim()) return { ok: false, errorCode: "REQUIRED_FIELDS_MISSING" };
  }

  const locale = await getLocale();
  const { system, user } = buildMarketingPlanPrompt(input, locale);

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

  const parsed = marketingPlanResultSchema.safeParse(json);
  if (!parsed.success) {
    console.error(`${FEATURE}: AI response failed schema validation:`, parsed.error.message);
    return { ok: false, errorCode: "AI_INVALID_RESPONSE" };
  }

  logSystemEvent({ message: "AI marketing plan generated", feature: FEATURE }).catch(() => {});
  return { ok: true, data: parsed.data };
}
