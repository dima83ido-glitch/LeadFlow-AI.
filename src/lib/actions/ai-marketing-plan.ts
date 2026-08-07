"use server";

import { getLocale } from "next-intl/server";

import { requireWorkspace } from "@/lib/workspace";
import { getAiChatCompletion } from "@/lib/ai/provider";
import { AI_REQUEST_TIMEOUT_MS_LARGE } from "@/lib/ai/config";
import { buildMarketingPlanPrompt } from "@/lib/ai/prompts";
import { jsonSchemaValidator, parseAiJson } from "@/lib/ai/parse-json";
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
    // This schema is far larger than the app's other AI features (20+
    // fields, several nested arrays of objects) — it genuinely needs more
    // generation time regardless of provider reliability, so it opts out of
    // the fast default timeout instead of routinely getting cut off mid-plan.
    timeoutMs: AI_REQUEST_TIMEOUT_MS_LARGE,
    validateContent: jsonSchemaValidator(marketingPlanResultSchema),
  });
  if (!result.ok) return { ok: false, errorCode: result.errorCode };

  const raw = result.content;
  if (!raw) return { ok: false, errorCode: "AI_EMPTY_RESPONSE" };

  const parsed = parseAiJson(FEATURE, marketingPlanResultSchema, raw);
  if (!parsed.ok) return parsed;

  logSystemEvent({ message: "AI marketing plan generated", feature: FEATURE }).catch(() => {});
  return { ok: true, data: parsed.data };
}
