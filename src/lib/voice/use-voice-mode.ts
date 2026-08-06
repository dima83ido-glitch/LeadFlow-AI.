"use client";

import * as React from "react";

import { createSpeechRecognizer, isSpeechRecognitionSupported, type SpeechRecognizerHandle } from "@/lib/voice/speech-recognition";
import { cancelSpeech, isSpeechSynthesisSupported, speak as speakText } from "@/lib/voice/speech-synthesis";
import { startAudioLevelMeter, type AudioLevelMeter } from "@/lib/voice/audio-level";

const ENABLED_KEY = "nexora:voice-mode-enabled";
const MUTED_KEY = "nexora:voice-mode-muted";

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
  return Math.min(20000, Math.max(4000, text.length * 90));
}

function readBoolean(key: string): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(key) === "true";
}

interface UseVoiceModeOptions {
  /** Whether the assistant panel is currently open — drives start/teardown of the whole session. */
  active: boolean;
  /** Called once per finished, non-empty user utterance. */
  onFinalTranscript: (text: string) => void;
}

export function useVoiceMode(lang: string, { active, onFinalTranscript }: UseVoiceModeOptions) {
  // Voice Mode is off by default per spec; persisted state is only read
  // after mount (effect below) to avoid an SSR/client hydration mismatch.
  const [enabled, setEnabledState] = React.useState(false);
  const [muted, setMutedState] = React.useState(false);
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
  // now-superseded recognition/speech session can recognize themselves as
  // stale and no-op — the core defense against duplicate sessions, races,
  // and leaks across rapid enable/disable/close/reopen cycles.
  const sessionIdRef = React.useRef(0);

  // Refs mirroring the latest props/state so stable callbacks (created once,
  // reused across renders) always see current values without needing to be
  // recreated on every change.
  const enabledRef = React.useRef(enabled);
  const mutedRef = React.useRef(muted);
  const activeRef = React.useRef(active);
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

  const startListening = React.useCallback(() => {
    if (!enabledRef.current || !activeRef.current || !sttSupported) return;

    sessionIdRef.current += 1;
    const sessionId = sessionIdRef.current;

    recognizerRef.current?.abort();
    clearWatchdog();

    const recognizer = createSpeechRecognizer({
      lang,
      onResult: (transcript, isFinal) => {
        if (sessionIdRef.current !== sessionId || !isFinal) return;
        const text = transcript.trim();
        if (!text) {
          // Recognized silence/noise as a final result with nothing said —
          // keep the hands-free loop going rather than sending nothing.
          if (enabledRef.current && activeRef.current) startListening();
          else setPhase(enabledRef.current ? "idle" : "disabled");
          return;
        }
        setPhase("thinking");
        onFinalTranscriptRef.current(text);
      },
      onError: (error) => {
        if (sessionIdRef.current !== sessionId) return;

        if (error === "no-speech" || error === "aborted") {
          // A pause with nothing said — not a real failure. Loop back to
          // listening silently rather than surfacing an error on every gap.
          if (enabledRef.current && activeRef.current) startListening();
          else setPhase(enabledRef.current ? "idle" : "disabled");
          return;
        }
        if (error === "not-allowed" || error === "service-not-allowed") {
          showError("permissionDenied");
          setEnabledState(false);
          window.localStorage.setItem(ENABLED_KEY, "false");
          setPhase("disabled");
          return;
        }
        showError("micError");
        setPhase(enabledRef.current ? "idle" : "disabled");
      },
      onEnd: () => {
        // Intentionally no-op: onResult/onError above own every state
        // transition. onEnd fires after both and would otherwise race them.
      },
    });

    if (!recognizer) {
      showError("notSupported");
      setPhase("idle");
      return;
    }

    recognizerRef.current = recognizer;
    setPhase("listening");
    recognizer.start();
  }, [lang, sttSupported, showError, clearWatchdog]);

  const speakReply = React.useCallback(
    (text: string) => {
      if (!enabledRef.current || !activeRef.current) return;
      const sessionId = sessionIdRef.current;

      if (mutedRef.current || !ttsSupported || !text.trim()) {
        setPhase("muted");
        clearWatchdog();
        watchdogRef.current = setTimeout(() => {
          if (sessionIdRef.current !== sessionId) return;
          startListening();
        }, MUTED_DWELL_MS);
        return;
      }

      setPhase("speaking");
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        clearWatchdog();
        if (sessionIdRef.current !== sessionId || !enabledRef.current || !activeRef.current) return;
        startListening();
      };

      clearWatchdog();
      watchdogRef.current = setTimeout(finish, speechWatchdogMs(text));
      speakText(text, { lang, onEnd: finish, onError: finish });
    },
    [lang, ttsSupported, startListening, clearWatchdog],
  );

  /**
   * Cancel whatever's currently happening without resuming — used when a new
   * turn is about to start (e.g. the user typed instead of speaking while
   * hands-free listening was still active). Bumps the session id so the
   * aborted recognizer's async onerror("aborted") can't sneak in a stale
   * restart-listening call right as we're about to move to "thinking".
   */
  const stopSpeaking = React.useCallback(() => {
    sessionIdRef.current += 1;
    cancelSpeech();
    recognizerRef.current?.abort();
    clearWatchdog();
  }, [clearWatchdog]);

  /** User-initiated barge-in: stop the assistant talking (or listening) and immediately start listening again. */
  const interrupt = React.useCallback(() => {
    sessionIdRef.current += 1;
    cancelSpeech();
    recognizerRef.current?.abort();
    clearWatchdog();
    if (enabledRef.current && activeRef.current) startListening();
    else setPhase(enabledRef.current ? "idle" : "disabled");
  }, [startListening, clearWatchdog]);

  const teardown = React.useCallback(() => {
    sessionIdRef.current += 1; // invalidate every in-flight callback
    recognizerRef.current?.abort();
    recognizerRef.current = null;
    audioMeterRef.current?.stop();
    audioMeterRef.current = null;
    setMicLevel(0);
    cancelSpeech();
    clearWatchdog();
  }, [clearWatchdog]);

  const setEnabled = React.useCallback((value: boolean) => {
    setEnabledState(value);
    window.localStorage.setItem(ENABLED_KEY, String(value));
  }, []);

  const setMuted = React.useCallback((value: boolean) => {
    setMutedState(value);
    window.localStorage.setItem(MUTED_KEY, String(value));
    if (value) cancelSpeech();
  }, []);

  // The single source of truth for starting/stopping the whole hands-free
  // session: whenever the panel is open AND Voice Mode is on, run it;
  // otherwise fully tear down. Reacting to [active, enabled] here (rather
  // than driving start/stop imperatively from setEnabled) keeps exactly one
  // code path responsible for the session lifecycle.
  React.useEffect(() => {
    if (active && enabled) {
      setPhase("idle");
      audioMeterRef.current = startAudioLevelMeter(setMicLevel);
      startListening();
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
