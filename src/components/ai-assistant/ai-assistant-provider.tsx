"use client";

import * as React from "react";

interface AiAssistantContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const AiAssistantContext = React.createContext<AiAssistantContextValue | null>(null);

export function AiAssistantProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const toggle = React.useCallback(() => setOpen((value) => !value), []);

  const value = React.useMemo<AiAssistantContextValue>(
    () => ({ open, setOpen, toggle }),
    [open, toggle],
  );

  return <AiAssistantContext.Provider value={value}>{children}</AiAssistantContext.Provider>;
}

export function useAiAssistant() {
  const ctx = React.useContext(AiAssistantContext);
  if (!ctx) {
    throw new Error("useAiAssistant must be used within an AiAssistantProvider");
  }
  return ctx;
}
