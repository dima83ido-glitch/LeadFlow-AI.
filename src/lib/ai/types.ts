/**
 * Minimal chat/tool-calling types matching the OpenAI-compatible schema
 * OpenRouter (and virtually every other provider's compat endpoint) speaks.
 * Kept local so no AI action file needs to import a provider-specific SDK.
 */
export type AiToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
};

export type AiChatMessage =
  | { role: "system"; content: string }
  | { role: "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: AiToolCall[] }
  | { role: "tool"; tool_call_id: string; content: string };

export type AiTool = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
};

export type AiErrorCode =
  | "MISSING_API_KEY"
  | "AI_TIMEOUT"
  | "AI_RATE_LIMITED"
  | "AI_EMPTY_RESPONSE"
  | "AI_INVALID_RESPONSE"
  | "AI_ERROR";

export type AiChatResult =
  | { ok: true; content: string | null; toolCalls: AiToolCall[]; model: string }
  | { ok: false; errorCode: AiErrorCode };
