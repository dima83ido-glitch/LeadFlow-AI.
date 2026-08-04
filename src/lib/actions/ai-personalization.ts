"use server";

import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import { getOpenAIClientSafe, AI_MODEL } from "@/lib/ai/client";
import { buildPersonalizationPrompt } from "@/lib/ai/prompts";
import { personalizationResultSchema, type PersonalizationResult } from "@/lib/ai/schemas";
import { logSystemEvent } from "@/lib/system-log";

export type AiActionResult<T> = { ok: true; data: T } | { ok: false; errorCode: string };

/**
 * Generates (and caches on the workspace) the onboarding personalization
 * for a business owner's `businessType`. Idempotent from the caller's
 * perspective — the dashboard only calls this when `workspace.personalization`
 * is still null, so a business owner only ever pays the OpenAI round trip
 * once, on their first dashboard visit after registering.
 */
export async function generatePersonalization(businessType: string): Promise<AiActionResult<PersonalizationResult>> {
  const { workspaceId } = await requireWorkspace();
  if (!businessType.trim()) return { ok: false, errorCode: "BUSINESS_TYPE_REQUIRED" };

  const clientResult = getOpenAIClientSafe();
  if ("error" in clientResult) return { ok: false, errorCode: clientResult.error };

  const locale = await getLocale();
  const { system, user } = buildPersonalizationPrompt(businessType, locale);

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

    const parsed = personalizationResultSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return { ok: false, errorCode: "AI_INVALID_RESPONSE" };

    await prisma.workspace.update({
      where: { id: workspaceId },
      data: { personalization: parsed.data },
    });

    await logSystemEvent({ message: "Onboarding personalization generated", feature: "ai.personalization" });
    return { ok: true, data: parsed.data };
  } catch {
    return { ok: false, errorCode: "AI_ERROR" };
  }
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
