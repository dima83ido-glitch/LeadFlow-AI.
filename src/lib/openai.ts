import OpenAI from "openai";

// Deferred: not called from any page or component yet. Every AI Tools page
// renders static placeholder output in this phase.

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set — see .env.example");
  }
  return new OpenAI({ apiKey });
}
