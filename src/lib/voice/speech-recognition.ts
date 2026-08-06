// The Web Speech API's SpeechRecognition interface isn't part of TypeScript's
// standard DOM lib, and only ships prefixed as `webkitSpeechRecognition` in
// Chromium browsers (Chrome, Edge, Brave, Opera all support it via the same
// prefix; Firefox has no implementation at all). These are minimal local
// types covering just what this app uses — not a full spec definition.

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getSpeechRecognitionConstructor() !== null;
}

// Errors that mean "nothing happened, just keep going" — not worth
// surfacing to the user or treating as a failed session.
const TRANSIENT_ERRORS = new Set(["no-speech", "aborted"]);
// Errors that can clear up on their own (flaky mic capture, brief network
// blip) and are worth a bounded number of automatic retries.
const RECOVERABLE_ERRORS = new Set(["network", "audio-capture"]);
const MAX_RECOVERY_ATTEMPTS = 5;
const RESTART_DELAY_MS = 250;

export interface SpeechRecognizerHandle {
  start: () => void;
  /** Hard stop — no restart, no further callbacks. */
  abort: () => void;
  /** Update recognition language for the next (re)start. Takes effect immediately if already running. */
  setLang: (lang: string) => void;
}

export function createSpeechRecognizer(options: {
  lang: string;
  /** Fired continuously as the user talks, before the phrase is finalized — useful for live captions / barge-in detection. */
  onInterim?: (transcript: string) => void;
  /** Fired once per finalized phrase. Never re-fires for the same phrase. */
  onFinal: (transcript: string) => void;
  /** Fired for errors that could not be recovered from automatically (permission denied, or repeated failures). */
  onError?: (error: string) => void;
}): SpeechRecognizerHandle | null {
  const Constructor = getSpeechRecognitionConstructor();
  if (!Constructor) return null;
  const RecognitionCtor = Constructor; // narrowed to non-null for closures below

  let stoppedByCaller = false;
  let recognition: SpeechRecognitionLike | null = null;
  let restartTimer: ReturnType<typeof setTimeout> | null = null;
  let recoveryAttempts = 0;
  let lastFinalText = "";
  let lastFinalAt = 0;

  const clearRestartTimer = () => {
    if (restartTimer) {
      clearTimeout(restartTimer);
      restartTimer = null;
    }
  };

  function attach(instance: SpeechRecognitionLike) {
    // Continuous mode keeps the microphone open across pauses instead of
    // ending the session after a single utterance — this is what lets the
    // hands-free loop hear speech that starts right as a previous phrase is
    // still being finalized, instead of missing it during a restart gap.
    instance.continuous = true;
    instance.interimResults = true;
    instance.maxAlternatives = 1;
    instance.lang = options.lang;

    instance.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        if (result.isFinal) {
          const text = transcript.trim();
          recoveryAttempts = 0;
          if (!text) continue;
          // Guard against the same phrase being finalized twice in a row —
          // observed on some Chromium builds right after an internal restart.
          const now = Date.now();
          if (text === lastFinalText && now - lastFinalAt < 1500) continue;
          lastFinalText = text;
          lastFinalAt = now;
          options.onFinal(text);
        } else {
          interim += transcript;
        }
      }
      if (interim.trim()) options.onInterim?.(interim);
    };

    instance.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        stoppedByCaller = true;
        options.onError?.(event.error);
        return;
      }
      if (TRANSIENT_ERRORS.has(event.error)) return; // onend will drive the restart
      if (RECOVERABLE_ERRORS.has(event.error) && recoveryAttempts < MAX_RECOVERY_ATTEMPTS) {
        recoveryAttempts += 1;
        return; // onend will drive the restart
      }
      stoppedByCaller = true;
      options.onError?.(event.error);
    };

    instance.onend = () => {
      if (stoppedByCaller) return;
      // The browser can end a "continuous" session on its own (backgrounded
      // tab, brief silence timeout, transient error) — restart transparently
      // so the hands-free loop never just goes quiet without the user
      // noticing. A short delay avoids InvalidStateError from restarting a
      // recognition engine that hasn't fully released the mic yet.
      clearRestartTimer();
      restartTimer = setTimeout(() => {
        if (stoppedByCaller) return;
        beginSession();
      }, RESTART_DELAY_MS);
    };
  }

  function beginSession() {
    const instance = new RecognitionCtor();
    attach(instance);
    recognition = instance;
    try {
      instance.start();
    } catch {
      // Already running or engine not ready — the periodic onend-driven
      // restart will retry; nothing to do here.
    }
  }

  return {
    start: () => {
      stoppedByCaller = false;
      recoveryAttempts = 0;
      lastFinalText = "";
      clearRestartTimer();
      beginSession();
    },
    abort: () => {
      stoppedByCaller = true;
      clearRestartTimer();
      try {
        recognition?.abort();
      } catch {
        // Not currently running — nothing to abort.
      }
      recognition = null;
    },
    setLang: (lang: string) => {
      options.lang = lang;
      if (recognition) recognition.lang = lang;
    },
  };
}
