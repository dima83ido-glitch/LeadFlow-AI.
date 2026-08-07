"use server";

import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import { getAiChatCompletion } from "@/lib/ai/provider";
import { AI_REQUEST_TIMEOUT_MS_MEDIUM } from "@/lib/ai/config";
import { buildPersonalizationPrompt } from "@/lib/ai/prompts";
import { jsonSchemaValidator, parseAiJson } from "@/lib/ai/parse-json";
import { personalizationResultSchema, type PersonalizationResult } from "@/lib/ai/schemas";
import { logSystemEvent } from "@/lib/system-log";

export type AiActionResult<T> = { ok: true; data: T } | { ok: false; errorCode: string };

const FEATURE = "ai.personalization";

/**
 * Generates (and caches on the workspace) the onboarding personalization
 * for a business owner's `businessType`. Idempotent from the caller's
 * perspective — the dashboard only calls this when `workspace.personalization`
 * is still null, so a business owner only ever pays the AI round trip once,
 * on their first dashboard visit after registering.
 */
export async function generatePersonalization(businessType: string): Promise<AiActionResult<PersonalizationResult>> {
  const { workspaceId } = await requireWorkspace();
  if (!businessType.trim()) return { ok: false, errorCode: "BUSINESS_TYPE_REQUIRED" };

  const locale = await getLocale();
  const { system, user } = buildPersonalizationPrompt(businessType, locale);

  const result = await getAiChatCompletion({
    feature: FEATURE,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    jsonMode: true,
    cache: true,
    // Several arrays plus nested suggested-content/email-sequence objects —
    // a bigger generation than this app's other AI tools, see
    // AI_REQUEST_TIMEOUT_MS_MEDIUM.
    timeoutMs: AI_REQUEST_TIMEOUT_MS_MEDIUM,
    validateContent: jsonSchemaValidator(personalizationResultSchema),
  });
  if (!result.ok) return { ok: false, errorCode: result.errorCode };

  const raw = result.content;
  if (!raw) return { ok: false, errorCode: "AI_EMPTY_RESPONSE" };

  const parsed = parseAiJson(FEATURE, personalizationResultSchema, raw);
  if (!parsed.ok) return parsed;

  try {
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: { personalization: parsed.data },
    });
  } catch (error) {
    console.error(`${FEATURE}: failed to persist personalization to workspace:`, error);
    return { ok: false, errorCode: "AI_ERROR" };
  }

  logSystemEvent({ message: "Onboarding personalization generated", feature: FEATURE }).catch(() => {});
  return { ok: true, data: parsed.data };
}

export type ActionResult = { ok: true } | { ok: false; errorCode: string };

/**
 * Turns one "suggestedContent" recommendation into real records: a Template
 * (so it shows up under Templates, reusable elsewhere) and a draft Campaign
 * already linked to it — one click takes the user from a static suggestion
 * to something they can open and send from the Campaigns page.
 */
export async function applySuggestedContent(input: {
  name: string;
  subject: string;
  body: string;
}): Promise<ActionResult> {
  try {
    const { workspaceId } = await requireWorkspace();
    if (!input.name.trim() || !input.body.trim()) return { ok: false, errorCode: "INVALID_INPUT" };

    await prisma.$transaction(async (tx) => {
      const template = await tx.template.create({
        data: {
          workspaceId,
          name: input.name.trim(),
          subject: input.subject.trim() || null,
          body: input.body.trim(),
          category: "Onboarding suggestion",
          isAiGenerated: true,
        },
      });

      await tx.campaign.create({
        data: {
          workspaceId,
          name: input.name.trim(),
          subject: input.subject.trim() || null,
          status: "DRAFT",
          templateId: template.id,
        },
      });
    });

    revalidatePath("/templates");
    revalidatePath("/campaigns");
    return { ok: true };
  } catch (error) {
    console.error("applySuggestedContent failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}
