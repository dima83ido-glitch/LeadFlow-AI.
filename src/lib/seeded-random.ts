/**
 * Deterministic PRNG (mulberry32). Used for decorative particle fields that
 * are server-rendered — the same seed must produce the same sequence on the
 * server and the client, or React hydration mismatches.
 */
export function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
