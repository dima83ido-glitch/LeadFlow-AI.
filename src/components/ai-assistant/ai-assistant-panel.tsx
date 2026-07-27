"use client";

import { Sparkles, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AiChatPanel } from "@/components/ai-assistant/ai-chat-panel";
import { useAiAssistant } from "@/components/ai-assistant/ai-assistant-provider";
import { EarthScene } from "@/components/ai-assistant/earth-scene";

const PANEL_WIDTH = "w-[420px] xl:w-[640px] 2xl:w-[780px]";

function PanelHeader({ onClose }: { onClose: () => void }) {
  const t = useTranslations("aiAssistant");
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="from-primary to-primary/60 flex size-7 items-center justify-center rounded-lg bg-gradient-to-br text-white">
          <Sparkles className="size-4" />
        </div>
        <div>
          <p className="text-sm leading-none font-semibold">{t("panelTitle")}</p>
        </div>
        <Badge variant="secondary" className="ml-1">
          {t("badge")}
        </Badge>
      </div>
      <Button variant="ghost" size="icon-sm" aria-label={t("close")} onClick={onClose}>
        <X className="size-4" />
      </Button>
    </div>
  );
}

export function AiAssistantPanel() {
  const { open, setOpen } = useAiAssistant();
  const isMobile = useIsMobile();
  const t = useTranslations("aiAssistant");

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md" showCloseButton={false}>
          <SheetHeader className="sr-only">
            <SheetTitle>{t("panelTitle")}</SheetTitle>
            <SheetDescription>{t("panelDescription")}</SheetDescription>
          </SheetHeader>
          <PanelHeader onClose={() => setOpen(false)} />
          <AiChatPanel className="min-h-0 flex-1" />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <>
      <div
        aria-hidden
        className={cn("hidden shrink-0 transition-[width] duration-300 ease-in-out lg:block", open ? PANEL_WIDTH : "w-0")}
      />
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-30 hidden flex-col border-l bg-popover shadow-2xl transition-transform duration-300 ease-in-out lg:flex",
          PANEL_WIDTH,
          open ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-label={t("panelTitle")}
        aria-hidden={!open}
      >
        <PanelHeader onClose={() => setOpen(false)} />
        <div className="flex min-h-0 flex-1">
          <EarthScene className="hidden w-[44%] shrink-0 border-r border-white/5 lg:flex" />
          <AiChatPanel className="min-w-0 flex-1" />
        </div>
      </div>
    </>
  );
}
