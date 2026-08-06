// Chrome's `speechSynthesis` engine has a handful of well-known, long-standing
// bugs that this module works around explicitly:
//
// 1. Calling `cancel()` immediately followed by `speak()` in the same tick
//    frequently drops the new utterance after a word or two, or silently no-ops.
//    Fix: only cancel when something is actually speaking/pending, and defer
//    the following `speak()` to the next tick.
// 2. A single long utterance (Chrome, some OS voices) can simply stop firing
//    boundary/end events and go silent after roughly 15s, as if the engine's
//    internal keep-alive timed out. Fix: split text into sentence-sized
//    chunks spoken back-to-back, and pulse pause()/resume() while speaking.
// 3. `SpeechSynthesisUtterance` objects with no other reference are prone to
//    being garbage-collected mid-utterance in some engines, which silently
//    kills playback. Fix: hold a module-level reference for the lifetime of
//    the utterance.

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!isSpeechSynthesisSupported()) return Promise.resolve([]);
  if (voicesPromise) return voicesPromise;

  voicesPromise = new Promise((resolve) => {
    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) {
      resolve(existing);
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.speechSynthesis.removeEventListener?.("voiceschanged", finish);
      resolve(window.speechSynthesis.getVoices());
    };
    // Most browsers populate voices asynchronously on first access; some
    // never fire `voiceschanged` at all (older WebKit), hence the timeout.
    window.speechSynthesis.addEventListener?.("voiceschanged", finish, { once: true });
    setTimeout(finish, 1000);
  });
  return voicesPromise;
}

// The Web Speech API exposes no gender metadata, so the best available
// signal is the voice's own name. These are the common male-voice names
// shipped by Chrome/Edge/Windows/macOS/Android per language.
const MALE_NAME_HINTS: Record<string, string[]> = {
  en: ["david", "guy", "mark", "daniel", "alex", "fred", "aaron", "matthew", "ryan", "eric", "male"],
  ru: ["pavel", "dmitry", "dmitri", "yuri", "ivan", "male", "павел", "дмитрий", "юрий", "иван"],
  uk: ["ostap", "pavlo", "mykyta", "male", "остап", "павло", "микита"],
};

function langPrefix(bcp47: string): string {
  return bcp47.slice(0, 2).toLowerCase();
}

function pickBestVoice(voices: SpeechSynthesisVoice[], bcp47: string): SpeechSynthesisVoice | undefined {
  const prefix = langPrefix(bcp47);
  const forLang = voices.filter((v) => v.lang.toLowerCase().startsWith(prefix));
  const pool = forLang.length > 0 ? forLang : voices;
  if (pool.length === 0) return undefined;

  const hints = MALE_NAME_HINTS[prefix] ?? MALE_NAME_HINTS.en;
  const male = pool.find((v) => {
    const name = v.name.toLowerCase();
    if (name.includes("female")) return false;
    return hints.some((hint) => name.includes(hint));
  });
  if (male) return male;

  // No confidently-male voice found for this language — fall back to
  // whatever is available for the language rather than failing loudly.
  return pool[0];
}

// Bumped on every cancel/new speak call so stale async continuations (a
// chunk's onend firing after the session moved on) recognize themselves as
// superseded and stop chaining further chunks.
let generation = 0;
// Intentionally never read back — merely holding this reference keeps the
// in-flight utterance reachable so engines that GC unreferenced utterances
// mid-speech (observed intermittently in Chromium) don't cut it off.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let currentUtterance: SpeechSynthesisUtterance | null = null;
let keepAliveTimer: ReturnType<typeof setInterval> | null = null;

function stopKeepAlive() {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}

function startKeepAlive() {
  stopKeepAlive();
  // Chrome silently halts long utterances after ~15s unless nudged; a
  // pause/resume pulse resets its internal timer without audibly
  // interrupting playback.
  keepAliveTimer = setInterval(() => {
    if (!window.speechSynthesis.speaking) return;
    window.speechSynthesis.pause();
    window.speechSynthesis.resume();
  }, 12000);
}

export function cancelSpeech() {
  generation += 1;
  stopKeepAlive();
  currentUtterance = null;
  if (!isSpeechSynthesisSupported()) return;
  if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
    window.speechSynthesis.cancel();
  }
}

// Splits text into speakable chunks on sentence boundaries, keeping chunks
// under a length that reliably avoids Chrome's long-utterance cutoff, and
// never splitting mid-sentence unless a single sentence itself is too long.
function chunkText(text: string): string[] {
  const MAX_CHUNK = 200;
  const sentences = text.match(/[^.!?\n]+[.!?\n]*/g) ?? [text];

  const chunks: string[] = [];
  let current = "";
  for (const rawSentence of sentences) {
    const sentence = rawSentence.trim();
    if (!sentence) continue;
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (candidate.length <= MAX_CHUNK) {
      current = candidate;
      continue;
    }
    if (current) chunks.push(current);
    if (sentence.length <= MAX_CHUNK) {
      current = sentence;
    } else {
      // A single sentence longer than the limit — hard-split on whitespace.
      const words = sentence.split(/\s+/);
      let piece = "";
      for (const word of words) {
        const next = piece ? `${piece} ${word}` : word;
        if (next.length > MAX_CHUNK) {
          if (piece) chunks.push(piece);
          piece = word;
        } else {
          piece = next;
        }
      }
      current = piece;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

export async function speak(
  text: string,
  options: { lang?: string; onEnd?: () => void; onError?: () => void } = {},
) {
  const trimmed = text.trim();
  if (!isSpeechSynthesisSupported() || !trimmed) {
    // No voice available — the caller must still be able to continue
    // (e.g. resume listening) as if speech had finished normally.
    options.onError?.();
    options.onEnd?.();
    return;
  }

  const wasBusy = window.speechSynthesis.speaking || window.speechSynthesis.pending;
  generation += 1;
  const myGeneration = generation;
  if (wasBusy) {
    window.speechSynthesis.cancel();
    // Give Chrome's engine a tick to actually flush the cancel before the
    // next speak() call — issuing them back-to-back is what triggers the
    // "only speaks a word or two" bug.
    await new Promise((resolve) => setTimeout(resolve, 60));
    if (myGeneration !== generation) return; // superseded while we waited
  }

  const voices = await loadVoices();
  if (myGeneration !== generation) return; // superseded while voices loaded
  const voice = options.lang ? pickBestVoice(voices, options.lang) : undefined;

  const chunks = chunkText(trimmed);
  let index = 0;

  const speakNext = () => {
    if (myGeneration !== generation) return;
    if (index >= chunks.length) {
      stopKeepAlive();
      currentUtterance = null;
      options.onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    index += 1;
    if (options.lang) utterance.lang = options.lang;
    if (voice) utterance.voice = voice;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => {
      if (myGeneration !== generation) return;
      speakNext();
    };
    // A synthesis failure must still resolve the caller's completion callback
    // — otherwise a hands-free conversation loop waiting on "speaking
    // finished" hangs forever. Text stays visible in the chat regardless.
    utterance.onerror = () => {
      if (myGeneration !== generation) return;
      stopKeepAlive();
      currentUtterance = null;
      options.onError?.();
      options.onEnd?.();
    };

    currentUtterance = utterance; // keep a live reference so it can't be GC'd mid-utterance
    startKeepAlive();
    window.speechSynthesis.speak(utterance);
  };

  speakNext();
}
