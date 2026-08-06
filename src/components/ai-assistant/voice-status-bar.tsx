"use client";

import * as React from "react";
import { Loader2, Mic, Volume2, VolumeX } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import type { VoicePhase } from "@/lib/voice/use-voice-mode";

// Stable per-bar multipliers so the real mic-level waveform has natural
// variance instead of every bar moving in lockstep with the raw level.
const BAR_JITTER = [0.55, 0.85, 1, 0.7, 1, 0.8, 0.6];

export function VoiceStatusBar({
  phase,
  micLevel,
  onInterrupt,
}: {
  phase: VoicePhase;
  micLevel: number;
  onInterrupt: () => void;
}) {
  const t = useTranslations("aiAssistant.chat.voice.states");
  const interactive = phase === "listening" || phase === "speaking";

  const icon =
    phase === "thinking" ? (
      <Loader2 className="size-3.5 animate-spin" />
    ) : phase === "speaking" ? (
      <Volume2 className="size-3.5" />
    ) : phase === "muted" ? (
      <VolumeX className="size-3.5" />
    ) : (
      <Mic className={cn("size-3.5", phase === "listening" && "animate-pulse")} />
    );

  return (
    <button
      type="button"
      onClick={interactive ? onInterrupt : undefined}
      aria-label={interactive ? t("interruptHint") : undefined}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-300",
        phase === "listening" &&
          "border-primary/40 bg-primary/8 text-foreground shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_30%,transparent),0_0_16px_-6px_color-mix(in_oklch,var(--primary)_50%,transparent)]",
        phase === "thinking" && "border-border/70 bg-muted/40 text-muted-foreground",
        phase === "speaking" &&
          "border-[color-mix(in_oklch,var(--chart-3)_45%,var(--border))] bg-[color-mix(in_oklch,var(--chart-3)_10%,transparent)] text-foreground shadow-[0_0_16px_-6px_color-mix(in_oklch,var(--chart-3)_55%,transparent)]",
        phase === "muted" && "border-border/70 bg-muted/30 text-muted-foreground",
        phase === "idle" && "border-border/60 bg-muted/20 text-muted-foreground",
        interactive && "cursor-pointer hover:-translate-y-px active:translate-y-0",
        !interactive && "cursor-default",
      )}
    >
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
          phase === "listening" && "bg-primary text-primary-foreground",
          phase === "speaking" && "bg-[var(--chart-3)] text-white",
          (phase === "thinking" || phase === "muted" || phase === "idle") && "bg-foreground/10 text-foreground/70",
        )}
      >
        {icon}
      </span>

      <span className="flex-1 text-left">{t(phase)}</span>

      {/* waveform */}
      <span className="flex h-4 items-center gap-[3px]" aria-hidden>
        {phase === "thinking"
          ? [0, 1, 2].map((i) => (
              <span
                key={i}
                className="bg-foreground/50 size-1 rounded-full"
                style={{ animation: `typing-dot 1.2s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }}
              />
            ))
          : BAR_JITTER.map((jitter, i) => (
              <span
                key={i}
                className={cn(
                  "w-[3px] rounded-full transition-[height] duration-100",
                  phase === "listening" && "bg-primary",
                  phase === "speaking" && "bg-[var(--chart-3)]",
                  (phase === "muted" || phase === "idle") && "bg-foreground/25",
                )}
                style={
                  phase === "listening"
                    ? { height: `${4 + Math.min(1, micLevel * jitter * 1.6) * 12}px` }
                    : phase === "speaking"
                      ? {
                          height: "10px",
                          animation: `bar-grow ${0.55 + jitter * 0.35}s ease-in-out ${i * 0.06}s infinite`,
                        }
                      : { height: "4px" }
                }
              />
            ))}
      </span>
    </button>
  );
}
