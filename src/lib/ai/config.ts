/**
 * Single point of configuration for the AI provider layer. OpenRouter
 * exposes an OpenAI-compatible /chat/completions endpoint that proxies to
 * every major lab (Anthropic, Google, OpenAI, xAI, ...), so swapping which
 * model(s) this app runs on — including moving off free tiers entirely —
 * is just editing AI_MODEL_CHAIN below. No other file needs to change.
 */
export const AI_PROVIDER_BASE_URL = "https://openrouter.ai/api/v1";
export const AI_PROVIDER_API_KEY_ENV = "OPENROUTER_API_KEY";

/**
 * Tried in order — the first model to return a valid response wins, and any
 * failure (rate limit, timeout, model unavailable, provider error) falls
 * through to the next one. All three are OpenRouter's $0/token free tier
 * and support both tool-calling and JSON response_format, which every AI
 * feature in this app relies on.
 */
export const AI_MODEL_CHAIN = [
  "nvidia/nemotron-3-super-120b-a12b:free",
  "google/gemma-4-31b-it:free",
  "openai/gpt-oss-20b:free",
] as const;

// Free-tier models can be slower under load than paid ones — long enough to
// not cut off a real response, short enough to fail fast into the next
// model in the chain instead of leaving the UI spinning.
export const AI_REQUEST_TIMEOUT_MS = 30_000;

export const AI_CACHE_TTL_MS = 5 * 60_000;
