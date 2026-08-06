"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Sparkles, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAiAssistant } from "@/components/ai-assistant/ai-assistant-provider";

// Only ever needed once the panel is actually opened, and it's a lot of
// generated star/dust/meteor markup plus the full voice-mode stack — code-
// split it out of the main bundle instead of shipping it to every page load
// for admins/Enterprise users who may never open the assistant. It renders
// its own EarthScene banner internally (sized via earthSceneClassName) so
// that Voice Mode's listening/speaking state can react on it directly.
const AiChatPanel = dynamic(
  () => import("@/components/ai-assistant/ai-chat-panel").then((m) => m.AiChatPanel),
  { ssr: false },
);

const PANEL_WIDTH = "w-[420px] xl:w-[640px] 2xl:w-[780px]";

function PanelHeader({ onClose }: { onClose: () => void }) {
  const t = useTranslations("aiAssistant");
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="from-primary to-primary/60 flex size-7 items-center justify-center rounded-lg bg-gradient-to-br text-primary-foreground">
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

  // The Earth scene and chat are only mounted once the assistant has been
  // opened at least once — otherwise their ~180 animated elements and
  // dedicated chunk would load and animate on every page for nothing.
  // Once opened, they stay mounted so closing/reopening keeps the
  // conversation instead of resetting it.
  const [hasOpened, setHasOpened] = React.useState(false);
  React.useEffect(() => {
    if (open) setHasOpened(true);
  }, [open]);

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md" showCloseButton={false}>
          <SheetHeader className="sr-only">
            <SheetTitle>{t("panelTitle")}</SheetTitle>
            <SheetDescription>{t("panelDescription")}</SheetDescription>
          </SheetHeader>
          <PanelHeader onClose={() => setOpen(false)} />
          {hasOpened && (
            <AiChatPanel
              className="min-h-0 flex-1"
              earthSceneClassName="h-48 w-full shrink-0 border-b border-white/5 sm:h-56"
            />
          )}
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
        {hasOpened && (
          <AiChatPanel
            className="min-h-0 flex-1"
            earthSceneClassName="h-64 w-full shrink-0 border-b border-white/5 xl:h-72 2xl:h-80"
          />
        )}
      </div>
    </>
  );
}
