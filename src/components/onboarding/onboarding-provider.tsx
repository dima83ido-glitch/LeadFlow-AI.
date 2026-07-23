"use client";

import * as React from "react";

import { hasCompletedOnboarding, markOnboardingCompleted } from "@/lib/onboarding";
import { OnboardingDialog } from "@/components/onboarding/onboarding-dialog";

interface OnboardingContextValue {
  openOnboarding: () => void;
}

const OnboardingContext = React.createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!hasCompletedOnboarding()) {
      setOpen(true);
    }
  }, []);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      markOnboardingCompleted();
    }
  }

  const value = React.useMemo<OnboardingContextValue>(
    () => ({ openOnboarding: () => setOpen(true) }),
    [],
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
      <OnboardingDialog open={open} onOpenChange={handleOpenChange} />
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = React.useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return ctx;
}
