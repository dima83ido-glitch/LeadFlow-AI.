import OpenAI from "openai";

export const AI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export type OpenAIClientResult = { client: OpenAI } | { error: "MISSING_API_KEY" };

export function getOpenAIClientSafe(): OpenAIClientResult {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { error: "MISSING_API_KEY" };
  return { client: new OpenAI({ apiKey }) };
}
