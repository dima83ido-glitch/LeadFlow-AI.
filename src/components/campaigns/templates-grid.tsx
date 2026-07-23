"use client";

import * as React from "react";
import { Copy, FileText, MoreHorizontal, Pencil, Sparkles, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { Locale } from "@/i18n/config";
import { toast } from "sonner";

import { mockTemplates } from "@/lib/mock/campaigns";
import type { TemplateCategory } from "@/types/campaign";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

const categories: (TemplateCategory | "All")[] = [
  "All",
  "Cold Outreach",
  "Introduction",
  "Follow-up",
  "Proposal",
  "Re-engagement",
];

export function TemplatesGrid() {
  const t = useTranslations("templates");
  const tCategory = useTranslations("templates.categories");
  const locale = useLocale() as Locale;
  const [category, setCategory] = React.useState<TemplateCategory | "All">("All");
  const [search, setSearch] = React.useState("");

  const filtered = mockTemplates.filter((template) => {
    if (category !== "All" && template.category !== category) return false;
    if (search && !template.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={category} onValueChange={(value) => setCategory(value as TemplateCategory | "All")}>
          <TabsList>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat === "All" ? t("allCategories") : tCategory(cat)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Input
          placeholder={t("searchPlaceholder")}
          className="w-full sm:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={t("noResultsTitle")}
          description={t("noResultsDescription")}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
            <Card key={template.id}>
              <CardHeader className="flex-row items-start justify-between gap-2">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary">{tCategory(template.category)}</Badge>
                    {template.isAiGenerated && (
                      <Badge variant="outline" className="gap-1">
                        <Sparkles className="size-3" />
                        {t("aiBadge")}
                      </Badge>
                    )}
                  </div>
                  <p className="font-medium">{template.name}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8" />}>
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toast.info(t("editNotWiredUp"))}>
                      <Pencil />
                      {t("edit")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.success(t("duplicatedToast", { name: template.name }))}>
                      <Copy />
                      {t("duplicate")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => toast.success(t("deletedToast", { name: template.name }))}>
                      <Trash2 />
                      {t("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm font-medium">{template.subject}</p>
                <p className="text-muted-foreground line-clamp-3 text-sm">{template.preview}</p>
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <span>{t("campaignsCount", { count: template.usageCount })}</span>
                  <span>{t("updatedOn", { date: formatDate(template.updatedAt, locale) })}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
