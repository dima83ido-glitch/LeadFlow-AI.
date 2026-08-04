export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function cancelSpeech() {
  if (!isSpeechSynthesisSupported()) return;
  window.speechSynthesis.cancel();
}

export function speak(text: string, options: { lang?: string; onEnd?: () => void } = {}) {
  if (!isSpeechSynthesisSupported() || !text.trim()) return;

  // Only one utterance should ever be audible at a time — cancel whatever
  // is currently speaking/queued before starting the new one.
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  if (options.lang) utterance.lang = options.lang;
  if (options.onEnd) utterance.onend = options.onEnd;
  window.speechSynthesis.speak(utterance);
}
