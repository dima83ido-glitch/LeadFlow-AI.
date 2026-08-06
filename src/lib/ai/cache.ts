/**
 * Minimal in-memory TTL cache for repeated, deterministic AI requests (e.g.
 * a double-submitted form, or a user re-running the same URL through an
 * analyzer a minute later). Single-process and best-effort, same tradeoff
 * as src/lib/rate-limit.ts — resets on deploy, not shared across instances.
 */
interface CacheEntry {
  value: string;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

let lastSweep = Date.now();
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, entry] of cache) {
    if (entry.expiresAt <= now) cache.delete(key);
  }
}

export function getCached(key: string): string | null {
  const now = Date.now();
  sweep(now);
  const entry = cache.get(key);
  if (!entry || entry.expiresAt <= now) return null;
  return entry.value;
}

export function setCached(key: string, value: string, ttlMs: number): void {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}
