"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { docGroupIcon, docGroupOrder, docRegistry } from "@/lib/docs/registry";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function DocsIndexView() {
  const t = useTranslations("docs");
  const [query, setQuery] = React.useState("");

  const normalized = query.trim().toLowerCase();
  const filtered = React.useMemo(() => {
    if (!normalized) return docRegistry;
    return docRegistry.filter((entry) => {
      const title = t(`pages.${entry.slug}.title`).toLowerCase();
      const summary = t(`pages.${entry.slug}.summary`).toLowerCase();
      return title.includes(normalized) || summary.includes(normalized);
    });
  }, [normalized, t]);

  const groups = docGroupOrder
    .map((group) => ({ group, entries: filtered.filter((entry) => entry.group === group) }))
    .filter((g) => g.entries.length > 0);

  return (
    <div className="space-y-10">
      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("index.searchPlaceholder")}
          className="h-11 pl-9"
        />
      </div>

      {groups.length === 0 && (
        <p className="text-sm text-muted-foreground">{t("index.noResults")}</p>
      )}

      {groups.map(({ group, entries }, groupIndex) => {
        const GroupIcon = docGroupIcon[group];
        return (
          <section
            key={group}
            className="animate-in fade-in slide-in-from-bottom-2 space-y-4 duration-500 ease-out"
            style={{ animationDelay: `${Math.min(groupIndex, 5) * 60}ms` }}
          >
            <div className="flex items-center gap-2">
              <GroupIcon className="size-4 text-primary" />
              <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">
                {t(`index.groups.${group}`)}
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => {
                const EntryIcon = entry.icon;
                return (
                  <Link key={entry.slug} href={`/help/docs/${entry.slug}`} className="group/doc-card">
                    <Card className="h-full">
                      <CardContent className="flex h-full flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
                            <EntryIcon className="size-4.5" />
                          </div>
                          {entry.status === "comingSoon" && (
                            <Badge variant="outline" className="border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400">
                              {t("index.comingSoonBadge")}
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="font-heading text-sm font-medium">{t(`pages.${entry.slug}.title`)}</p>
                          <p className="text-sm text-muted-foreground">{t(`pages.${entry.slug}.summary`)}</p>
                        </div>
                        <span
                          className={cn(
                            "mt-auto flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity duration-200 group-hover/doc-card:opacity-100",
                          )}
                        >
                          {t("index.readMore")}
                          <ArrowRight className="size-3" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
