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
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
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

export interface SpeechRecognizerHandle {
  start: () => void;
  /** Graceful stop — lets the browser report a final result for speech already captured. */
  stop: () => void;
  /** Hard cancel — no further results, used for teardown/interruption. */
  abort: () => void;
}

export function createSpeechRecognizer(options: {
  lang: string;
  onResult: (transcript: string, isFinal: boolean) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}): SpeechRecognizerHandle | null {
  const Constructor = getSpeechRecognitionConstructor();
  if (!Constructor) return null;

  const recognition = new Constructor();
  recognition.lang = options.lang;
  // Single-utterance mode: the browser's own endpointer stops recognition
  // once it detects silence after speech, which is exactly the "silence
  // automatically ends the recording" behavior we want — no custom VAD needed.
  recognition.continuous = false;
  recognition.interimResults = true;

  // Guards against calling start() on an already-started instance, which
  // throws InvalidStateError in every Chromium browser.
  let started = false;

  recognition.onresult = (event) => {
    let transcript = "";
    let isFinal = false;
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      transcript += result[0].transcript;
      if (result.isFinal) isFinal = true;
    }
    options.onResult(transcript, isFinal);
  };
  recognition.onerror = (event) => {
    started = false;
    options.onError?.(event.error);
  };
  recognition.onend = () => {
    started = false;
    options.onEnd?.();
  };

  return {
    start: () => {
      if (started) return;
      try {
        started = true;
        recognition.start();
      } catch {
        started = false;
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch {
        // Not currently started — nothing to stop.
      }
    },
    abort: () => {
      started = false;
      try {
        recognition.abort();
      } catch {
        // Not currently started — nothing to abort.
      }
    },
  };
}
