"use server";

import { getLocale } from "next-intl/server";

import { prisma } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import { getAiChatCompletion } from "@/lib/ai/provider";
import type { AiChatMessage } from "@/lib/ai/types";
import { buildAssistantSystemPrompt } from "@/lib/ai/prompts";
import { getAssistantTools, executeAssistantTool } from "@/lib/ai/assistant-tools";
import { checkRateLimit } from "@/lib/rate-limit";
import { logSystemEvent } from "@/lib/system-log";

export type AiActionResult<T> = { ok: true; data: T } | { ok: false; errorCode: string };

export type AssistantChatMessage = { role: "user" | "assistant"; content: string };

const MAX_HISTORY_MESSAGES = 20;
const MAX_TOOL_ROUNDS = 4;

export async function sendAssistantMessage(
  history: AssistantChatMessage[],
): Promise<AiActionResult<{ reply: string }>> {
  const { workspaceId, userId } = await requireWorkspace();

  const rateLimit = checkRateLimit(`assistant:${userId}`, { limit: 20, windowMs: 5 * 60_000 });
  if (!rateLimit.allowed) return { ok: false, errorCode: "RATE_LIMITED" };

  if (history.length === 0) return { ok: false, errorCode: "EMPTY_HISTORY" };

  try {
    const locale = await getLocale();
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { hasExistingBusiness: true, businessType: true },
    });
    const businessContext =
      workspace?.hasExistingBusiness === null || workspace?.hasExistingBusiness === undefined
        ? null
        : { hasExistingBusiness: workspace.hasExistingBusiness, businessType: workspace.businessType };
    const systemPrompt = buildAssistantSystemPrompt(locale, businessContext);
    const tools = getAssistantTools();

    const messages: AiChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...history.slice(-MAX_HISTORY_MESSAGES).map((m): AiChatMessage => ({ role: m.role, content: m.content })),
    ];

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const result = await getAiChatCompletion({ feature: "ai.assistant", messages, tools });
      if (!result.ok) return { ok: false, errorCode: result.errorCode };

      if (result.toolCalls.length === 0) {
        const reply = result.content?.trim();
        if (!reply) return { ok: false, errorCode: "AI_EMPTY_RESPONSE" };
        logSystemEvent({ message: "AI assistant message", feature: "ai.assistant" }).catch(() => {});
        return { ok: true, data: { reply } };
      }

      messages.push({ role: "assistant", content: result.content, tool_calls: result.toolCalls });

      for (const call of result.toolCalls) {
        let args: unknown = {};
        try {
          args = call.function.arguments ? JSON.parse(call.function.arguments) : {};
        } catch {
          args = {};
        }

        const toolResult = await executeAssistantTool(call.function.name, args, { workspaceId, userId, locale });
        if (toolResult.ok) {
          logSystemEvent({ message: `AI assistant tool: ${call.function.name}`, feature: "ai.assistant" }).catch(
            () => {},
          );
        }

        messages.push({ role: "tool", tool_call_id: call.id, content: toolResult.summary });
      }
    }

    return { ok: false, errorCode: "AI_TOO_MANY_TOOL_CALLS" };
  } catch (error) {
    console.error("sendAssistantMessage: unexpected failure:", error);
    logSystemEvent({
      level: "ERROR",
      message: "AI assistant unexpected failure",
      feature: "ai.assistant",
      context: { error: error instanceof Error ? error.message : String(error) },
    }).catch(() => {});
    return { ok: false, errorCode: "AI_ERROR" };
  }
}
