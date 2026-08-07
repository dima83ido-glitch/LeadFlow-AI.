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
 * Tried in order — the first model to return a valid, schema-conforming
 * response wins, and any failure (rate limit, timeout, model unavailable,
 * provider error, malformed/empty content) falls through to the next one.
 *
 * Chosen and verified directly against OpenRouter (see the incident writeup
 * in `getAiChatCompletion`'s doc comment for the reproduction) after
 * `openai/gpt-oss-20b:free` was found to be permanently broken for this app
 * and removed:
 *
 * - "google/gemma-4-26b-a4b-it:free" — primary. Verified clean, schema-valid
 *   JSON on every call in repeated testing, fastest of the three, and no
 *   reasoning trace to strip.
 * - "nvidia/nemotron-3-super-120b-a12b:free" — a reasoning model that, on
 *   this app's longer prompts, was intermittently spending its whole output
 *   budget on the hidden `reasoning` field and returning empty `content`
 *   (logged in production as "invalid" failures). Fixed by sending
 *   `reasoning: { enabled: false }` on every request (see provider.ts) —
 *   verified this reliably restores real `content`.
 * - "nvidia/nemotron-nano-9b-v2:free" — same family, kept as a second
 *   fallback for provider diversity; also reasoning-capable but (unlike
 *   gpt-oss-20b) still reliably populates `content` alongside `reasoning`.
 *
 * All three support both tool-calling and JSON response_format, which every
 * AI feature in this app relies on.
 */
export const AI_MODEL_CHAIN = [
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "nvidia/nemotron-nano-9b-v2:free",
] as const;

/**
 * Removed from AI_MODEL_CHAIN and must never be re-added without re-testing:
 * confirmed via direct reproduction against OpenRouter that this endpoint
 * makes reasoning mandatory (HTTP 400 if disabled) and returns
 * `message.content: null` on every call regardless — the answer only ever
 * exists in the (unusable) reasoning trace. Not a transient/rate-limit
 * issue; a structural incompatibility with a `content`-based integration.
 */
export const AI_PERMANENTLY_REMOVED_MODELS = ["openai/gpt-oss-20b:free"] as const;

// Free-tier models can be slower under load than paid ones, but 30s left
// users staring at a spinner through two or three full dead attempts before
// ever reaching a model that works. Short enough to fail fast into the next
// model in the chain, long enough not to cut off a real response for
// small/medium JSON payloads (headlines, CTAs, single-page analyses, ...).
export const AI_REQUEST_TIMEOUT_MS = 10_000;

// A handful of features ask for a genuinely large structured JSON payload
// (the marketing plan schema alone has 20+ fields, several of them arrays
// of objects) — the model needs real generation time for that regardless of
// provider reliability, so the fast default would cut off a working
// response, not just a broken one. Opt in per-request via `timeoutMs`.
export const AI_REQUEST_TIMEOUT_MS_LARGE = 25_000;

export const AI_CACHE_TTL_MS = 5 * 60_000;

// Only for the three transient failure kinds (timeout, rate_limited,
// network) — see provider.ts's TRANSIENT_FAILURE_KINDS. A failure that's a
// property of the request itself (malformed JSON, no choices, unsupported
// format) will fail identically on retry, so it skips straight to the next
// model instead of wasting one of these.
export const AI_MAX_SAME_MODEL_RETRIES = 1;
