import type { ZodType } from "zod";

export type ParseAiJsonResult<T> = { ok: true; data: T } | { ok: false; errorCode: "AI_INVALID_RESPONSE" };

/**
 * Parses and schema-validates a `jsonMode` AI completion. Shared by every
 * jsonMode AI feature so "malformed JSON" / "schema mismatch" handling —
 * and its error logging — lives in exactly one place instead of being
 * copy-pasted per action file (it used to be, verbatim, in eleven of them).
 *
 * By the time this runs, `getAiChatCompletion` has already used the same
 * schema (via `jsonSchemaValidator` below, passed as `validateContent`) to
 * reject any model in the chain whose output didn't match it — so a failure
 * here should be rare. It stays as a second, independent check because this
 * function returns the actually-typed data the caller needs, and belt-and-
 * suspenders costs nothing for a payload this small.
 */
export function parseAiJson<T>(feature: string, schema: ZodType<T>, raw: string): ParseAiJsonResult<T> {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (err) {
    console.error(`${feature}: failed to parse AI response as JSON:`, err);
    return { ok: false, errorCode: "AI_INVALID_RESPONSE" };
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    console.error(`${feature}: AI response failed schema validation:`, parsed.error.message);
    return { ok: false, errorCode: "AI_INVALID_RESPONSE" };
  }

  return { ok: true, data: parsed.data };
}

/**
 * Builds the `validateContent` callback `getAiChatCompletion` runs against
 * every model's raw output *before* deciding that model succeeded. A model
 * whose JSON doesn't match the expected schema is treated as that model's
 * failure — the router falls through to the next one — instead of the
 * malformed data ever reaching `parseAiJson` (and, had this gap not been
 * closed, the user).
 */
export function jsonSchemaValidator(schema: ZodType<unknown>): (content: string) => boolean {
  return (content: string) => {
    try {
      return schema.safeParse(JSON.parse(content)).success;
    } catch {
      return false;
    }
  };
}
