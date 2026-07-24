"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { LANGUAGES } from "@/lib/languages";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function LanguageCombobox({
  value,
  onChange,
  placeholder,
  emptyText,
}: {
  value: string;
  onChange: (code: string) => void;
  placeholder: string;
  emptyText: string;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = LANGUAGES.find((l) => l.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" className="w-full justify-between font-normal">
            <span className="truncate">
              {selected ? `${selected.nameEn} (${selected.nameNative})` : placeholder}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </Button>
        }
      />
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {LANGUAGES.map((language) => (
                <CommandItem
                  key={language.code}
                  value={`${language.nameEn} ${language.nameNative} ${language.code}`}
                  onSelect={() => {
                    onChange(language.code);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn("size-4", value === language.code ? "opacity-100" : "opacity-0")}
                  />
                  {language.nameEn}
                  <span className="text-muted-foreground">{language.nameNative}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
