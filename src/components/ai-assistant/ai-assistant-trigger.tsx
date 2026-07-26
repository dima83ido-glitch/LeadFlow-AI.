"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAiAssistant } from "@/components/ai-assistant/ai-assistant-provider";

export function AiAssistantTrigger() {
  const t = useTranslations("aiAssistant");
  const { open, toggle } = useAiAssistant();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-pressed={open}
            aria-label={t("trigger.label")}
            onClick={toggle}
            className={cn(
              "relative overflow-visible",
              !open &&
                "before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-gradient-to-br before:from-violet-500/40 before:via-fuchsia-500/30 before:to-cyan-400/40 before:opacity-0 before:blur-md before:transition-opacity before:duration-300 hover:before:opacity-100",
            )}
          />
        }
      >
        <Sparkles className={cn("size-4 transition-colors", open ? "text-primary" : "")} />
        {!open && (
          <span className="absolute top-1 right-1 flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-violet-500" />
          </span>
        )}
      </TooltipTrigger>
      <TooltipContent side="bottom">{t("trigger.label")}</TooltipContent>
    </Tooltip>
  );
}
