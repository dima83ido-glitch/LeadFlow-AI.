"use client";

import * as React from "react";

import { cancelSpeech, isSpeechSynthesisSupported, speak as speakText } from "@/lib/voice/speech-synthesis";

const ENABLED_KEY = "nexora:voice-mode-enabled";
const MUTED_KEY = "nexora:voice-mode-muted";

function readBoolean(key: string): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(key) === "true";
}

export function useVoiceMode(lang: string) {
  // Voice Mode is off by default per spec; persisted state is only read
  // after mount (effect below) to avoid an SSR/client hydration mismatch.
  const [enabled, setEnabledState] = React.useState(false);
  const [muted, setMutedState] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const ttsSupported = React.useMemo(() => isSpeechSynthesisSupported(), []);

  React.useEffect(() => {
    setEnabledState(readBoolean(ENABLED_KEY));
    setMutedState(readBoolean(MUTED_KEY));
  }, []);

  const setEnabled = React.useCallback((value: boolean) => {
    setEnabledState(value);
    window.localStorage.setItem(ENABLED_KEY, String(value));
    if (!value) {
      cancelSpeech();
      setIsSpeaking(false);
    }
  }, []);

  const setMuted = React.useCallback((value: boolean) => {
    setMutedState(value);
    window.localStorage.setItem(MUTED_KEY, String(value));
    if (value) {
      cancelSpeech();
      setIsSpeaking(false);
    }
  }, []);

  const stopSpeaking = React.useCallback(() => {
    cancelSpeech();
    setIsSpeaking(false);
  }, []);

  const speak = React.useCallback(
    (text: string) => {
      if (!enabled || muted || !ttsSupported) return;
      setIsSpeaking(true);
      speakText(text, { lang, onEnd: () => setIsSpeaking(false) });
    },
    [enabled, muted, ttsSupported, lang],
  );

  React.useEffect(() => () => cancelSpeech(), []);

  return { enabled, setEnabled, muted, setMuted, speak, stopSpeaking, isSpeaking, ttsSupported };
}
