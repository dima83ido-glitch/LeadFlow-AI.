"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { commandPaletteNav } from "@/lib/nav-config";
import { mockLeads } from "@/lib/mock/leads";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const t = useTranslations();
  const tc = useTranslations("common");

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="text-muted-foreground h-8 w-8 justify-center px-0 font-normal sm:w-56 sm:justify-between sm:px-3"
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center gap-2">
          <Search className="size-4" />
          <span className="hidden sm:inline">{tc("search")}</span>
        </span>
        <CommandShortcut className="hidden sm:inline-flex">Ctrl K</CommandShortcut>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t("nav.commandPalettePlaceholder")} />
        <CommandList>
          <CommandEmpty>{tc("noResults")}</CommandEmpty>
          <CommandGroup heading={t("nav.commandPaletteNavigate")}>
            {commandPaletteNav.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => runCommand(() => router.push(item.href))}
              >
                <item.icon />
                {t(item.titleKey)}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={t("nav.commandPaletteLeads")}>
            {mockLeads.slice(0, 5).map((lead) => (
              <CommandItem
                key={lead.id}
                onSelect={() => runCommand(() => router.push(`/leads/${lead.id}`))}
              >
                <Users />
                {lead.companyName}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
