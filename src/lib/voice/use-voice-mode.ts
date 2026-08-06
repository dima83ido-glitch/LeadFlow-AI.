"use client";

import * as React from "react";

import { createSpeechRecognizer, isSpeechRecognitionSupported, type SpeechRecognizerHandle } from "@/lib/voice/speech-recognition";
import { cancelSpeech, isSpeechSynthesisSupported, speak as speakText } from "@/lib/voice/speech-synthesis";
import { startAudioLevelMeter, type AudioLevelMeter } from "@/lib/voice/audio-level";

const ENABLED_KEY = "nexora:voice-mode-enabled";
const MUTED_KEY = "nexora:voice-mode-muted";
const LANGUAGE_KEY = "nexora:voice-mode-language";

export type VoiceLanguage = "en" | "ru" | "uk";
export const VOICE_LANGUAGES: VoiceLanguage[] = ["en", "ru", "uk"];

export const VOICE_LANGUAGE_BCP47: Record<VoiceLanguage, string> = {
  en: "en-US",
  ru: "ru-RU",
  uk: "uk-UA",
};

export const VOICE_LANGUAGE_LABELS: Record<VoiceLanguage, string> = {
  ru: "Русский",
  uk: "Українська",
  en: "English",
};

export type VoicePhase = "disabled" | "idle" | "listening" | "thinking" | "speaking" | "muted";
export type VoiceErrorKey = "notSupported" | "permissionDenied" | "micError" | "synthesisUnavailable";

// How long the "Muted" phase is held on screen in place of actually
// speaking, so the state transition reads as intentional rather than an
// instant flicker, before the hands-free loop resumes listening.
const MUTED_DWELL_MS = 700;

// Safety net for a known intermittent Chrome bug where a TTS utterance's
// onend/onerror can simply never fire. Without this, the hands-free loop
// would hang in "speaking" forever instead of returning to listening.
function speechWatchdogMs(text: string): number {
  return Math.min(45000, Math.max(4000, text.length * 90));
}

// Minimum length of an interim transcript captured while the assistant is
// talking before it's treated as a genuine barge-in rather than mic noise
// or the assistant's own voice leaking back through the microphone.
const BARGE_IN_MIN_CHARS = 3;

function readBoolean(key: string): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(key) === "true";
}

function readLanguage(fallback: VoiceLanguage): VoiceLanguage {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(LANGUAGE_KEY);
  return stored === "en" || stored === "ru" || stored === "uk" ? stored : fallback;
}

interface UseVoiceModeOptions {
  /** Whether the assistant panel is currently open — drives start/teardown of the whole session. */
  active: boolean;
  /** Seeds the initial language before any explicit user choice has been persisted. */
  defaultLanguage: VoiceLanguage;
  /** Called once per finished, non-empty user utterance. */
  onFinalTranscript: (text: string) => void;
}

type Turn = "idle" | "listening" | "thinking" | "speaking" | "muted-dwell";

export function useVoiceMode({ active, defaultLanguage, onFinalTranscript }: UseVoiceModeOptions) {
  // Voice Mode is off by default per spec; persisted state is only read
  // after mount (effect below) to avoid an SSR/client hydration mismatch.
  const [enabled, setEnabledState] = React.useState(false);
  const [muted, setMutedState] = React.useState(false);
  const [language, setLanguageState] = React.useState<VoiceLanguage>(defaultLanguage);
  const [phase, setPhase] = React.useState<VoicePhase>("disabled");
  const [micLevel, setMicLevel] = React.useState(0);
  const [lastError, setLastError] = React.useState<VoiceErrorKey | null>(null);

  const sttSupported = React.useMemo(() => isSpeechRecognitionSupported(), []);
  const ttsSupported = React.useMemo(() => isSpeechSynthesisSupported(), []);

  const recognizerRef = React.useRef<SpeechRecognizerHandle | null>(null);
  const audioMeterRef = React.useRef<AudioLevelMeter | null>(null);
  const watchdogRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Incremented on every start/teardown so async callbacks from a
  // now-superseded session (e.g. a TTS watchdog from a previous turn) can
  // recognize themselves as stale and no-op.
  const sessionIdRef = React.useRef(0);

  // What the hands-free loop is doing right now, tracked outside React state
  // so recognizer callbacks (firing at arbitrary async timing) always see
  // the live truth instead of a stale render's closure.
  const turnRef = React.useRef<Turn>("idle");

  // Refs mirroring the latest props/state so stable callbacks (created once,
  // reused across renders) always see current values without needing to be
  // recreated on every change.
  const enabledRef = React.useRef(enabled);
  const mutedRef = React.useRef(muted);
  const activeRef = React.useRef(active);
  const languageRef = React.useRef(language);
  const onFinalTranscriptRef = React.useRef(onFinalTranscript);
  React.useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);
  React.useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);
  React.useEffect(() => {
    activeRef.current = active;
  }, [active]);
  React.useEffect(() => {
    onFinalTranscriptRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

  React.useEffect(() => {
    setEnabledState(readBoolean(ENABLED_KEY));
    setMutedState(readBoolean(MUTED_KEY));
    setLanguageState(readLanguage(defaultLanguage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showError = React.useCallback((key: VoiceErrorKey) => {
    setLastError(key);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = setTimeout(() => setLastError(null), 6000);
  }, []);

  const clearWatchdog = React.useCallback(() => {
    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
  }, []);

  // Lazily creates the single continuous recognizer for this session. It is
  // never torn down between turns — it keeps listening straight through
  // "thinking" and "speaking" so the user can barge in naturally, and so
  // restarting it never creates a gap where speech could be missed.
  const ensureRecognizer = React.useCallback(() => {
    if (recognizerRef.current) return recognizerRef.current;

    const recognizer = createSpeechRecognizer({
      lang: VOICE_LANGUAGE_BCP47[languageRef.current],
      onInterim: (text) => {
        if (turnRef.current !== "speaking") return;
        if (text.trim().length < BARGE_IN_MIN_CHARS) return;
        // Barge-in: the user started talking while the assistant was still
        // speaking — stop TTS immediately and hand control back to them.
        turnRef.current = "listening";
        cancelSpeech();
        clearWatchdog();
        setPhase("listening");
      },
      onFinal: (text) => {
        if (!enabledRef.current || !activeRef.current) return;
        if (turnRef.current === "thinking") return; // a turn is already in flight — drop the overlap
        const trimmed = text.trim();
        if (!trimmed) return;
        if (turnRef.current === "speaking") {
          cancelSpeech();
          clearWatchdog();
        }
        turnRef.current = "thinking";
        setPhase("thinking");
        onFinalTranscriptRef.current(trimmed);
      },
      onError: (error) => {
        if (error === "not-allowed" || error === "service-not-allowed") {
          showError("permissionDenied");
          setEnabledState(false);
          window.localStorage.setItem(ENABLED_KEY, "false");
          turnRef.current = "idle";
          setPhase("disabled");
          return;
        }
        showError("micError");
        turnRef.current = "idle";
        setPhase(enabledRef.current ? "idle" : "disabled");
      },
    });

    recognizerRef.current = recognizer;
    return recognizer;
  }, [showError, clearWatchdog]);

  const startSession = React.useCallback(() => {
    if (!enabledRef.current || !activeRef.current) return;
    if (!sttSupported) {
      showError("notSupported");
      setPhase("idle");
      return;
    }
    if (enabledRef.current && !ttsSupported) showError("synthesisUnavailable");

    sessionIdRef.current += 1;
    const recognizer = ensureRecognizer();
    if (!recognizer) {
      showError("notSupported");
      setPhase("idle");
      return;
    }

    turnRef.current = "listening";
    setPhase("listening");
    recognizer.start();
  }, [sttSupported, ttsSupported, showError, ensureRecognizer]);

  const speakReply = React.useCallback(
    (text: string) => {
      if (!enabledRef.current || !activeRef.current) return;
      const sessionId = sessionIdRef.current;

      if (mutedRef.current || !ttsSupported || !text.trim()) {
        turnRef.current = "muted-dwell";
        setPhase("muted");
        clearWatchdog();
        watchdogRef.current = setTimeout(() => {
          if (sessionIdRef.current !== sessionId) return;
          turnRef.current = "listening";
          setPhase("listening");
        }, MUTED_DWELL_MS);
        return;
      }

      turnRef.current = "speaking";
      setPhase("speaking");
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        clearWatchdog();
        if (sessionIdRef.current !== sessionId || !enabledRef.current || !activeRef.current) return;
        // A barge-in during playback may have already moved the turn back
        // to "listening" — don't stomp that with a stale completion.
        if (turnRef.current === "speaking") {
          turnRef.current = "listening";
          setPhase("listening");
        }
      };

      clearWatchdog();
      watchdogRef.current = setTimeout(finish, speechWatchdogMs(text));
      speakText(text, { lang: VOICE_LANGUAGE_BCP47[languageRef.current], onEnd: finish, onError: finish });
    },
    [ttsSupported, clearWatchdog],
  );

  /**
   * Silence anything voice-related still in flight without resuming — used
   * when a new turn is about to start from typed input while hands-free
   * mode is still active, so it can't race with the reply that's coming.
   */
  const stopSpeaking = React.useCallback(() => {
    sessionIdRef.current += 1;
    cancelSpeech();
    clearWatchdog();
    if (enabledRef.current && activeRef.current) {
      turnRef.current = "thinking";
      setPhase("thinking");
    }
  }, [clearWatchdog]);

  /** User-initiated barge-in via the mic button: stop the assistant talking (or listening) and go straight back to listening. */
  const interrupt = React.useCallback(() => {
    sessionIdRef.current += 1;
    cancelSpeech();
    clearWatchdog();
    if (enabledRef.current && activeRef.current) {
      turnRef.current = "listening";
      setPhase("listening");
    } else {
      turnRef.current = "idle";
      setPhase(enabledRef.current ? "idle" : "disabled");
    }
  }, [clearWatchdog]);

  const teardown = React.useCallback(() => {
    sessionIdRef.current += 1; // invalidate every in-flight callback
    recognizerRef.current?.abort();
    recognizerRef.current = null;
    audioMeterRef.current?.stop();
    audioMeterRef.current = null;
    setMicLevel(0);
    cancelSpeech();
    clearWatchdog();
    turnRef.current = "idle";
  }, [clearWatchdog]);

  const setEnabled = React.useCallback((value: boolean) => {
    setEnabledState(value);
    window.localStorage.setItem(ENABLED_KEY, String(value));
  }, []);

  const setMuted = React.useCallback(
    (value: boolean) => {
      setMutedState(value);
      window.localStorage.setItem(MUTED_KEY, String(value));
      if (value && turnRef.current === "speaking") {
        cancelSpeech();
        clearWatchdog();
        turnRef.current = "listening";
        setPhase("listening");
      }
    },
    [clearWatchdog],
  );

  const setLanguage = React.useCallback((value: VoiceLanguage) => {
    setLanguageState(value);
    window.localStorage.setItem(LANGUAGE_KEY, value);
    languageRef.current = value;
    const recognizer = recognizerRef.current;
    if (recognizer) {
      recognizer.setLang(VOICE_LANGUAGE_BCP47[value]);
      // Recognition language only takes effect on (re)start — restart now so
      // switching languages mid-session is immediate rather than waiting for
      // the next natural restart.
      if (enabledRef.current && activeRef.current) {
        recognizer.abort();
        recognizer.start();
        turnRef.current = "listening";
        setPhase("listening");
      }
    }
  }, []);

  // The single source of truth for starting/stopping the whole hands-free
  // session: whenever the panel is open AND Voice Mode is on, run it;
  // otherwise fully tear down. Reacting to [active, enabled] here (rather
  // than driving start/stop imperatively from setEnabled) keeps exactly one
  // code path responsible for the session lifecycle.
  React.useEffect(() => {
    if (active && enabled) {
      setPhase("idle");
      turnRef.current = "idle";
      audioMeterRef.current = startAudioLevelMeter(setMicLevel);
      startSession();
    } else {
      teardown();
      setPhase(enabled ? "idle" : "disabled");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, enabled]);

  // Belt-and-suspenders cleanup on unmount (the panel component itself stays
  // mounted once opened, so this mainly guards a full page/route teardown).
  React.useEffect(() => {
    return () => {
      teardown();
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    enabled,
    setEnabled,
    muted,
    setMuted,
    language,
    setLanguage,
    phase,
    micLevel,
    sttSupported,
    ttsSupported,
    lastError,
    speakReply,
    stopSpeaking,
    interrupt,
  };
}
