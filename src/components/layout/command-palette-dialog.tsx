"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Users, Building2, CalendarClock, ScrollText, Notebook, FileText, Megaphone } from "lucide-react";
import { useTranslations } from "next-intl";

import { commandPaletteNav } from "@/lib/nav-config";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

type SearchResults = {
  leads: { id: string; companyName: string; contactName: string | null }[];
  contacts: { id: string; firstName: string; lastName: string | null }[];
  companies: { id: string; name: string }[];
  meetings: { id: string; title: string }[];
  tasks: { id: string; title: string }[];
  notes: { id: string; content: string }[];
  templates: { id: string; name: string }[];
  campaigns: { id: string; name: string }[];
};

const EMPTY_RESULTS: SearchResults = {
  leads: [], contacts: [], companies: [], meetings: [], tasks: [], notes: [], templates: [], campaigns: [],
};

export function CommandPaletteDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResults>(EMPTY_RESULTS);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const t = useTranslations();
  const tc = useTranslations("common");

  React.useEffect(() => {
    if (!open || query.trim().length < 2) {
      setResults(EMPTY_RESULTS);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : EMPTY_RESULTS))
        .then((data: SearchResults) => setResults(data))
        .catch((error) => {
          if ((error as Error).name !== "AbortError") setResults(EMPTY_RESULTS);
        })
        .finally(() => setLoading(false));
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [open, query]);

  const runCommand = React.useCallback((command: () => void) => {
    onOpenChange(false);
    setQuery("");
    command();
  }, [onOpenChange]);

  const hasAnyResult =
    results.leads.length > 0 ||
    results.contacts.length > 0 ||
    results.companies.length > 0 ||
    results.meetings.length > 0 ||
    results.tasks.length > 0 ||
    results.notes.length > 0 ||
    results.templates.length > 0 ||
    results.campaigns.length > 0;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder={t("nav.commandPalettePlaceholder")}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {!loading && (query.trim().length < 2 || !hasAnyResult) && (
          <CommandEmpty>{tc("noResults")}</CommandEmpty>
        )}
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

        {results.leads.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={t("nav.commandPaletteLeads")}>
              {results.leads.map((lead) => (
                <CommandItem key={lead.id} onSelect={() => runCommand(() => router.push(`/leads/${lead.id}`))}>
                  <Users />
                  {lead.companyName}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {results.contacts.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={t("nav.commandPaletteContacts")}>
              {results.contacts.map((contact) => (
                <CommandItem key={contact.id} onSelect={() => runCommand(() => router.push("/crm/contacts"))}>
                  <Users />
                  {[contact.firstName, contact.lastName].filter(Boolean).join(" ")}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {results.companies.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={t("nav.items.companies")}>
              {results.companies.map((company) => (
                <CommandItem key={company.id} onSelect={() => runCommand(() => router.push("/crm/companies"))}>
                  <Building2 />
                  {company.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {results.meetings.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={t("nav.commandPaletteMeetings")}>
              {results.meetings.map((meeting) => (
                <CommandItem key={meeting.id} onSelect={() => runCommand(() => router.push("/crm/meetings"))}>
                  <CalendarClock />
                  {meeting.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {results.tasks.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={t("nav.commandPaletteTasks")}>
              {results.tasks.map((task) => (
                <CommandItem key={task.id} onSelect={() => runCommand(() => router.push("/crm/tasks"))}>
                  <ScrollText />
                  {task.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {results.notes.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={t("nav.commandPaletteNotes")}>
              {results.notes.map((note) => (
                <CommandItem key={note.id} onSelect={() => runCommand(() => router.push("/crm/notes"))}>
                  <Notebook />
                  {note.content.slice(0, 60)}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {results.templates.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={t("nav.commandPaletteTemplates")}>
              {results.templates.map((template) => (
                <CommandItem key={template.id} onSelect={() => runCommand(() => router.push("/templates"))}>
                  <FileText />
                  {template.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {results.campaigns.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={t("nav.commandPaletteCampaigns")}>
              {results.campaigns.map((campaign) => (
                <CommandItem key={campaign.id} onSelect={() => runCommand(() => router.push("/campaigns"))}>
                  <Megaphone />
                  {campaign.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
