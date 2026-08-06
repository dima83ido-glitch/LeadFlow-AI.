export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function cancelSpeech() {
  if (!isSpeechSynthesisSupported()) return;
  window.speechSynthesis.cancel();
}

export function speak(
  text: string,
  options: { lang?: string; onEnd?: () => void; onError?: () => void } = {},
) {
  if (!isSpeechSynthesisSupported() || !text.trim()) {
    // No voice available — the caller must still be able to continue
    // (e.g. resume listening) as if speech had finished normally.
    options.onError?.();
    options.onEnd?.();
    return;
  }

  // Only one utterance should ever be audible at a time — cancel whatever
  // is currently speaking/queued before starting the new one.
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  if (options.lang) utterance.lang = options.lang;
  utterance.onend = () => options.onEnd?.();
  // A synthesis failure must still resolve the caller's completion callback
  // — otherwise a hands-free conversation loop waiting on "speaking finished"
  // hangs forever. Text stays visible in the chat regardless (req: "if
  // SpeechSynthesis fails, display the text normally" — it already is, since
  // the message bubble renders independently of whether speech succeeds).
  utterance.onerror = () => {
    options.onError?.();
    options.onEnd?.();
  };
  window.speechSynthesis.speak(utterance);
}
