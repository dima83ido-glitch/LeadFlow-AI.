"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { docGroupOrder, docGroupIcon, docRegistry, type DocGroup } from "@/lib/docs/registry";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface DocsIndexProps {
  messages: Record<string, { title: string; summary: string }>;
  groupLabels: Record<DocGroup, string>;
  searchPlaceholder: string;
  noResultsLabel: string;
  comingSoonLabel: string;
}

export function DocsIndex({
  messages,
  groupLabels,
  searchPlaceholder,
  noResultsLabel,
  comingSoonLabel,
}: DocsIndexProps) {
  const [query, setQuery] = React.useState("");

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? docRegistry.filter((entry) => {
        const m = messages[entry.slug];
        return !!m && (m.title.toLowerCase().includes(normalized) || m.summary.toLowerCase().includes(normalized));
      })
    : docRegistry;

  return (
    <div className="space-y-10">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          className="h-11 pl-9"
        />
      </div>

      {filtered.length === 0 && <p className="text-muted-foreground text-sm">{noResultsLabel}</p>}

      {docGroupOrder.map((group) => {
        const items = filtered.filter((entry) => entry.group === group);
        if (items.length === 0) return null;
        const GroupIcon = docGroupIcon[group];

        return (
          <section key={group} className="space-y-4">
            <div className="flex items-center gap-2">
              <GroupIcon className="size-4 text-primary" />
              <h2 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                {groupLabels[group]}
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((entry) => {
                const m = messages[entry.slug];
                const Icon = entry.icon;
                return (
                  <Link key={entry.slug} href={`/help/docs/${entry.slug}`} className="group">
                    <Card className="h-full">
                      <CardContent className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 group-hover:scale-105">
                            <Icon className="size-5 text-primary" />
                          </div>
                          {entry.status === "comingSoon" && (
                            <Badge variant="outline" className="shrink-0 text-[0.65rem]">
                              {comingSoonLabel}
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">{m?.title}</p>
                          <p className="text-muted-foreground line-clamp-2 text-sm">{m?.summary}</p>
                        </div>
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
