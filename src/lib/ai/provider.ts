import crypto from "node:crypto";

import {
  AI_PROVIDER_BASE_URL,
  AI_PROVIDER_API_KEY_ENV,
  AI_MODEL_CHAIN,
  AI_REQUEST_TIMEOUT_MS,
  AI_CACHE_TTL_MS,
  AI_MAX_SAME_MODEL_RETRIES,
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
  /** Per-request override — see AI_REQUEST_TIMEOUT_MS_LARGE for when a feature's schema needs more generation time than the default. */
  timeoutMs?: number;
  /**
   * Extra pass/fail check run on a model's raw `content` on top of "has
   * content at all" — typically `jsonSchemaValidator(mySchema)` from
   * parse-json.ts. Returning false marks *this model's* response as a
   * failure so the router falls through to the next one, instead of hand-
   * ing the UI a response that will only fail to parse/validate downstream.
   */
  validateContent?: (content: string) => boolean;
};

type AttemptFailureKind = "timeout" | "rate_limited" | "auth" | "provider" | "network" | "invalid";

/** Only these can plausibly succeed on an immediate retry of the *same* model — everything else is a property of the request/response itself and would fail identically again. */
const TRANSIENT_FAILURE_KINDS = new Set<AttemptFailureKind>(["timeout", "rate_limited", "network"]);

type AttemptFailure = { kind: AttemptFailureKind; detail: string; status?: number; provider?: string };

type AttemptSuccess = { ok: true; content: string | null; toolCalls: AiToolCall[]; provider?: string };
type AttemptResult = AttemptSuccess | { ok: false; failure: AttemptFailure };

function hashMessages(messages: AiChatMessage[]): string {
  return crypto.createHash("sha256").update(JSON.stringify(messages)).digest("hex").slice(0, 24);
}

async function callModel(model: string, apiKey: string, request: AiChatRequest): Promise<AttemptResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), request.timeoutMs ?? AI_REQUEST_TIMEOUT_MS);

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
        // Several models in the chain are reasoning-capable and will, under
        // long/complex prompts, spend their whole output budget on the
        // hidden `reasoning` field and leave `content` empty — confirmed by
        // reproducing it directly against OpenRouter. Disabling reasoning
        // fixes that and is a no-op (silently ignored, never errors) on
        // every model currently in AI_MODEL_CHAIN.
        reasoning: { enabled: false },
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => response.statusText);
      const upstreamProvider = (() => {
        try {
          const parsed = JSON.parse(detail) as { error?: { metadata?: { provider_name?: string } } };
          return parsed.error?.metadata?.provider_name ?? undefined;
        } catch {
          return undefined;
        }
      })();

      if (response.status === 401 || response.status === 403) {
        return { ok: false, failure: { kind: "auth", detail, status: response.status, provider: upstreamProvider } };
      }
      if (response.status === 429) {
        return {
          ok: false,
          failure: { kind: "rate_limited", detail, status: response.status, provider: upstreamProvider },
        };
      }
      // 404 (model not found) / 400 ("no endpoints") / 5xx all land here —
      // they're all "this model didn't work", which the caller handles
      // identically: move on to the next one in the chain.
      return { ok: false, failure: { kind: "provider", detail, status: response.status, provider: upstreamProvider } };
    }

    const bodyText = await response.text();
    const json = (() => {
      try {
        return JSON.parse(bodyText) as {
          choices?: { message?: { content?: string | null; tool_calls?: unknown[] } }[];
          provider?: string;
        };
      } catch {
        return null;
      }
    })();

    if (!json) {
      return { ok: false, failure: { kind: "invalid", detail: `Response body was not valid JSON: ${bodyText.slice(0, 300)}` } };
    }

    const message = json.choices?.[0]?.message;
    if (!message) {
      return { ok: false, failure: { kind: "invalid", detail: "Response had no choices/message.", provider: json.provider } };
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
      return {
        ok: false,
        failure: { kind: "invalid", detail: "Model returned empty content and no tool calls.", provider: json.provider },
      };
    }

    // JSON-mode callers get the raw wire-format check here (provider-
    // agnostic — every jsonMode caller needs this) so a model that returns
    // prose instead of JSON is this model's failure, not a downstream crash.
    if (request.jsonMode && message.content) {
      try {
        JSON.parse(message.content);
      } catch {
        return {
          ok: false,
          failure: { kind: "invalid", detail: "Response content is not valid JSON.", provider: json.provider },
        };
      }
    }

    // Feature-specific schema check (e.g. website analysis' category/score
    // shape) — a model whose JSON is well-formed but doesn't match what the
    // caller actually needs is, from the router's perspective, exactly as
    // much a failure as empty content, and falls through the same way.
    if (request.validateContent && message.content && !request.validateContent(message.content)) {
      return {
        ok: false,
        failure: { kind: "invalid", detail: "Response content failed caller-provided schema validation.", provider: json.provider },
      };
    }

    return { ok: true, content: message.content ?? null, toolCalls, provider: json.provider };
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
 * AI_MODEL_CHAIN in order, returning the first successful, schema-valid
 * completion; any per-model failure falls through to the next model:
 *
 *   - transient (timeout / rate_limited / network): retried once against
 *     the SAME model first (AI_MAX_SAME_MODEL_RETRIES) — worth a second try
 *     since the exact same request can plausibly succeed a moment later —
 *     then falls through if still failing.
 *   - non-transient (invalid JSON, no choices, empty content, schema
 *     mismatch, model/provider error): never retried against the same
 *     model — it's a property of the request or the model itself and would
 *     fail identically — falls through immediately.
 *   - auth: uses the same key for every model in the chain, so it fails
 *     identically each time — stops immediately instead of burning the
 *     rest of the chain on a foregone conclusion.
 *
 * Never throws — every failure mode resolves to a friendly AiErrorCode the
 * caller maps to a translated, non-technical message. Full failure detail
 * (model, upstream provider, duration, reason, retry count, and the model
 * that's about to be tried next) is only ever logged server-side (console +
 * SystemLog), never returned to the caller.
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

  for (const [modelIndex, model] of AI_MODEL_CHAIN.entries()) {
    let lastFailure: AttemptFailure | null = null;
    let retryCount = 0;

    for (;;) {
      const started = Date.now();
      const result = await callModel(model, apiKey, request);
      const latencyMs = Date.now() - started;

      if (result.ok) {
        console.log(
          `[ai-provider] ${request.feature}: model="${model}" provider="${result.provider ?? "unknown"}" ` +
            `succeeded after ${latencyMs}ms (attempt ${failures.length + 1}, retry ${retryCount})`,
        );

        if (cacheKey && result.content) setCached(cacheKey, result.content, AI_CACHE_TTL_MS);

        return { ok: true, content: result.content, toolCalls: result.toolCalls, model };
      }

      lastFailure = result.failure;
      const nextModel = AI_MODEL_CHAIN[modelIndex + 1] ?? null;
      console.error(
        `[ai-provider] ${request.feature}: model="${model}" provider="${result.failure.provider ?? "unknown"}" ` +
          `reason=${result.failure.kind}${result.failure.status ? ` status=${result.failure.status}` : ""} ` +
          `duration=${latencyMs}ms retry=${retryCount} fallback=${nextModel ?? "none"} — ` +
          `${result.failure.detail.slice(0, 500)}`,
      );

      const canRetrySameModel = TRANSIENT_FAILURE_KINDS.has(result.failure.kind) && retryCount < AI_MAX_SAME_MODEL_RETRIES;
      if (canRetrySameModel) {
        retryCount++;
        continue;
      }
      break;
    }

    failures.push({ model, failure: lastFailure });

    // An auth failure uses the same key for every model in the chain, so
    // it will fail identically each time — stop instead of burning the
    // rest of the chain (and the user's wait) on a foregone conclusion.
    if (lastFailure.kind === "auth") break;
  }

  console.error(
    `[ai-provider] ${request.feature}: all models exhausted — ` +
      failures.map((f) => `${f.model}=${f.failure.kind}`).join(", "),
  );
  logSystemEvent({
    level: "ERROR",
    message: `AI provider exhausted all models: ${request.feature}`,
    feature: request.feature,
    context: {
      failures: failures.map((f) => ({
        model: f.model,
        kind: f.failure.kind,
        status: f.failure.status,
        provider: f.failure.provider,
      })),
    },
  }).catch(() => {});

  return { ok: false, errorCode: classifyOverallFailure(failures) };
}
