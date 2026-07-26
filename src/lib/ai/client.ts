import OpenAI from "openai";

export const AI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export type OpenAIClientResult = { client: OpenAI } | { error: "MISSING_API_KEY" };

// The SDK's default timeout is 10 minutes — far too long for a
// request-response UI. Fail fast so callers can show a clear error
// instead of a spinner that never resolves.
const AI_REQUEST_TIMEOUT_MS = 30_000;

export function getOpenAIClientSafe(): OpenAIClientResult {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { error: "MISSING_API_KEY" };
  return { client: new OpenAI({ apiKey, timeout: AI_REQUEST_TIMEOUT_MS, maxRetries: 2 }) };
}
