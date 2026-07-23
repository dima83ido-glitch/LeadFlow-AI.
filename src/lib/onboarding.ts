const STORAGE_KEY = "leadflow:onboarding-completed";

export function hasCompletedOnboarding(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

export function markOnboardingCompleted() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, "true");
}
