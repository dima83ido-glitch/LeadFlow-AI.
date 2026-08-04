const STORAGE_KEY = "nexora:push-prompt-dismissed";

export function hasDismissedPushPrompt(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

export function dismissPushPrompt() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, "true");
}
