import crypto from "node:crypto";

import {
  AI_PROVIDER_BASE_URL,
  AI_PROVIDER_API_KEY_ENV,
  AI_MODEL_CHAIN,
  AI_REQUEST_TIMEOUT_MS,
  AI_CACHE_TTL_MS,
} from "@/lib/ai/config";
import type { AiChatMessage, AiTool, AiToolCall, AiChatResult, AiErrorCode } from "@/lib/ai/types";
import { getCached, setCached } from "@/lib/ai/cache";
import { logSystemEvent } from "@/lib/system-log";

export type AiChatRequest = {
  /** Dotted feature id used for logging, e.g. "ai.headlineGenerator". */
  feature: string;
  messages: AiChatMessage[];
  tools?: AiTool[];
  jsonMode?: boolean;
  /** Opt in for deterministic, repeatable one-shot requests. Never set for multi-turn conversation. */
  cache?: boolean;
};

type AttemptFailureKind = "timeout" | "rate_limited" | "auth" | "provider" | "network" | "invalid";

type AttemptFailure = { kind: AttemptFailureKind; detail: string; status?: number };

type AttemptSuccess = { ok: true; content: string | null; toolCalls: AiToolCall[] };
type AttemptResult = AttemptSuccess | { ok: false; failure: AttemptFailure };

function hashMessages(messages: AiChatMessage[]): string {
  return crypto.createHash("sha256").update(JSON.stringify(messages)).digest("hex").slice(0, 24);
}

async function callModel(model: string, apiKey: string, request: AiChatRequest): Promise<AttemptResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${AI_PROVIDER_BASE_URL}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://nexora.ai",
        "X-Title": "Nexora",
      },
      body: JSON.stringify({
        model,
        messages: request.messages,
        ...(request.tools ? { tools: request.tools, tool_choice: "auto" } : {}),
        ...(request.jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => response.statusText);
      if (response.status === 401 || response.status === 403) {
        return { ok: false, failure: { kind: "auth", detail, status: response.status } };
      }
      if (response.status === 429) {
        return { ok: false, failure: { kind: "rate_limited", detail, status: response.status } };
      }
      // 404 (model not found) / 400 ("no endpoints") / 5xx all land here —
      // they're all "this model didn't work", which the caller handles
      // identically: move on to the next one in the chain.
      return { ok: false, failure: { kind: "provider", detail, status: response.status } };
    }

    const json = (await response.json().catch(() => null)) as
      | { choices?: { message?: { content?: string | null; tool_calls?: unknown[] } }[] }
      | null;
    const message = json?.choices?.[0]?.message;
    if (!message) {
      return { ok: false, failure: { kind: "invalid", detail: "Response had no choices/message." } };
    }

    const toolCalls = (message.tool_calls ?? []).filter(
      (call): call is AiToolCall => (call as { type?: string })?.type === "function",
    );

    // Reasoning models occasionally dump their whole answer into a
    // `reasoning` field and leave `content` null/empty with no tool calls —
    // a non-answer, not a real completion. Treat it as this model's failure
    // so the chain falls through to the next one instead of surfacing
    // "the AI didn't return a response" for what's really "this specific
    // free model flaked."
    if (toolCalls.length === 0 && !message.content?.trim()) {
      return { ok: false, failure: { kind: "invalid", detail: "Model returned empty content and no tool calls." } };
    }

    return { ok: true, content: message.content ?? null, toolCalls };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { ok: false, failure: { kind: "timeout", detail: "Request timed out." } };
    }
    return { ok: false, failure: { kind: "network", detail: err instanceof Error ? err.message : String(err) } };
  } finally {
    clearTimeout(timeout);
  }
}

function classifyOverallFailure(failures: { model: string; failure: AttemptFailure }[]): AiErrorCode {
  if (failures.length === 0) return "AI_ERROR";
  if (failures.every((f) => f.failure.kind === "auth")) return "MISSING_API_KEY";
  if (failures.every((f) => f.failure.kind === "rate_limited")) return "AI_RATE_LIMITED";
  if (failures.every((f) => f.failure.kind === "timeout")) return "AI_TIMEOUT";
  return "AI_ERROR";
}

/**
 * The single entry point every AI feature in this app calls. Walks
 * AI_MODEL_CHAIN in order, returning the first successful completion; any
 * per-model failure (rate limit, timeout, model unavailable, network,
 * malformed response) falls through to the next model. Never throws —
 * every failure mode resolves to a friendly AiErrorCode the caller maps to
 * a translated, non-technical message. Full failure detail is only ever
 * logged server-side (console + SystemLog), never returned to the caller.
 */
export async function getAiChatCompletion(request: AiChatRequest): Promise<AiChatResult> {
  const apiKey = process.env[AI_PROVIDER_API_KEY_ENV];
  if (!apiKey) {
    console.error(`[ai-provider] ${request.feature}: ${AI_PROVIDER_API_KEY_ENV} is not set.`);
    return { ok: false, errorCode: "MISSING_API_KEY" };
  }

  const cacheKey = request.cache ? `${request.feature}:${hashMessages(request.messages)}` : null;
  if (cacheKey) {
    const cached = getCached(cacheKey);
    if (cached !== null) {
      return { ok: true, content: cached, toolCalls: [], model: "cache" };
    }
  }

  const failures: { model: string; failure: AttemptFailure }[] = [];

  for (const model of AI_MODEL_CHAIN) {
    const started = Date.now();
    const result = await callModel(model, apiKey, request);
    const latencyMs = Date.now() - started;

    if (result.ok) {
      // Console-only, not a SystemLog row: each call site already logs its
      // own success event (feature-scoped, used by the admin usage stats,
      // which count SystemLog rows per feature) — a second row here would
      // silently double-count every successful call in that dashboard.
      console.log(
        `[ai-provider] ${request.feature}: model "${model}" succeeded after ${latencyMs}ms` +
          (failures.length > 0 ? ` (attempt ${failures.length + 1})` : ""),
      );

      if (cacheKey && result.content) setCached(cacheKey, result.content, AI_CACHE_TTL_MS);

      return { ok: true, content: result.content, toolCalls: result.toolCalls, model };
    }

    failures.push({ model, failure: result.failure });
    console.error(
      `[ai-provider] ${request.feature}: model "${model}" failed (${result.failure.kind}` +
        `${result.failure.status ? ` ${result.failure.status}` : ""}) after ${latencyMs}ms — ` +
        `${result.failure.detail.slice(0, 500)}`,
    );

    // An auth failure uses the same key for every model in the chain, so
    // it will fail identically each time — stop instead of burning the
    // rest of the chain (and the user's wait) on a foregone conclusion.
    if (result.failure.kind === "auth") break;
  }

  console.error(
    `[ai-provider] ${request.feature}: all models exhausted — ` +
      failures.map((f) => `${f.model}=${f.failure.kind}`).join(", "),
  );
  logSystemEvent({
    level: "ERROR",
    message: `AI provider exhausted all models: ${request.feature}`,
    feature: request.feature,
    context: { failures: failures.map((f) => ({ model: f.model, kind: f.failure.kind, status: f.failure.status })) },
  }).catch(() => {});

  return { ok: false, errorCode: classifyOverallFailure(failures) };
}
