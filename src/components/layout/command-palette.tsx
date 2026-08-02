"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { CommandShortcut } from "@/components/ui/command";

// The palette itself (cmdk + the search-results UI) is only needed once a
// user actually opens it — code-split it out of the app shell's bundle
// instead of shipping it on every single page load.
const CommandPaletteDialog = dynamic(
  () => import("@/components/layout/command-palette-dialog").then((m) => m.CommandPaletteDialog),
  { ssr: false },
);

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [hasOpened, setHasOpened] = React.useState(false);
  const tc = useTranslations("common");

  const openPalette = React.useCallback(() => {
    setHasOpened(true);
    setOpen(true);
  }, []);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setHasOpened(true);
        setOpen((value) => !value);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="text-muted-foreground h-8 w-8 justify-center px-0 font-normal sm:w-56 sm:justify-between sm:px-3"
        onClick={openPalette}
      >
        <span className="flex items-center gap-2">
          <Search className="size-4" />
          <span className="hidden sm:inline">{tc("search")}</span>
        </span>
        <CommandShortcut className="hidden sm:inline-flex">Ctrl K</CommandShortcut>
      </Button>
      {hasOpened && <CommandPaletteDialog open={open} onOpenChange={setOpen} />}
    </>
  );
}
