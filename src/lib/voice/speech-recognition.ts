// The Web Speech API's SpeechRecognition interface isn't part of TypeScript's
// standard DOM lib, and only ships prefixed as `webkitSpeechRecognition` in
// Chrome/Edge (Firefox has no implementation at all). These are minimal local
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

export function createSpeechRecognizer(options: {
  lang: string;
  onResult: (transcript: string, isFinal: boolean) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}): { start: () => void; stop: () => void } | null {
  const Constructor = getSpeechRecognitionConstructor();
  if (!Constructor) return null;

  const recognition = new Constructor();
  recognition.lang = options.lang;
  recognition.continuous = false;
  recognition.interimResults = true;

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
  recognition.onerror = (event) => options.onError?.(event.error);
  recognition.onend = () => options.onEnd?.();

  return {
    start: () => recognition.start(),
    stop: () => recognition.stop(),
  };
}
