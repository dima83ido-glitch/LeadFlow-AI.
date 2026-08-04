"use server";

import { getLocale } from "next-intl/server";
import type OpenAI from "openai";

import { requireWorkspace } from "@/lib/workspace";
import { getOpenAIClientSafe, AI_MODEL } from "@/lib/ai/client";
import { buildAssistantSystemPrompt } from "@/lib/ai/prompts";
import { getAssistantOpenAiTools, executeAssistantTool } from "@/lib/ai/assistant-tools";
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

  const clientResult = getOpenAIClientSafe();
  if ("error" in clientResult) return { ok: false, errorCode: clientResult.error };

  const locale = await getLocale();
  const systemPrompt = buildAssistantSystemPrompt(locale);
  const tools = getAssistantOpenAiTools();

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...history.slice(-MAX_HISTORY_MESSAGES).map(
      (m): OpenAI.Chat.Completions.ChatCompletionMessageParam => ({ role: m.role, content: m.content }),
    ),
  ];

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const completion = await clientResult.client.chat.completions.create({
        model: AI_MODEL,
        messages,
        tools,
        tool_choice: "auto",
      });

      const choice = completion.choices[0];
      const message = choice?.message;
      if (!message) return { ok: false, errorCode: "AI_EMPTY_RESPONSE" };

      const toolCalls = message.tool_calls?.filter((call) => call.type === "function") ?? [];
      if (toolCalls.length === 0) {
        const reply = message.content?.trim();
        if (!reply) return { ok: false, errorCode: "AI_EMPTY_RESPONSE" };
        await logSystemEvent({ message: "AI assistant message", feature: "ai.assistant" });
        return { ok: true, data: { reply } };
      }

      messages.push({
        role: "assistant",
        content: message.content ?? null,
        tool_calls: toolCalls,
      });

      for (const call of toolCalls) {
        let args: unknown = {};
        try {
          args = call.function.arguments ? JSON.parse(call.function.arguments) : {};
        } catch {
          args = {};
        }

        const result = await executeAssistantTool(call.function.name, args, { workspaceId, userId, locale });
        if (result.ok) {
          await logSystemEvent({ message: `AI assistant tool: ${call.function.name}`, feature: "ai.assistant" });
        }

        messages.push({
          role: "tool",
          tool_call_id: call.id,
          content: result.summary,
        });
      }
    }

    return { ok: false, errorCode: "AI_TOO_MANY_TOOL_CALLS" };
  } catch {
    return { ok: false, errorCode: "AI_ERROR" };
  }
}
