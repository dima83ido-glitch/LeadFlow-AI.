"use client";

import * as React from "react";
import { Copy, FileText, MoreHorizontal, Pencil, Sparkles, Trash2 } from "lucide-react";
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
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Input
          placeholder="Search templates..."
          className="w-full sm:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No templates found"
          description="Try a different category or search term."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
            <Card key={template.id}>
              <CardHeader className="flex-row items-start justify-between gap-2">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary">{template.category}</Badge>
                    {template.isAiGenerated && (
                      <Badge variant="outline" className="gap-1">
                        <Sparkles className="size-3" />
                        AI
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
                    <DropdownMenuItem onClick={() => toast.info("Editing isn't wired up yet.")}>
                      <Pencil />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.success(`Duplicated "${template.name}".`)}>
                      <Copy />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => toast.success(`Deleted "${template.name}".`)}>
                      <Trash2 />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm font-medium">{template.subject}</p>
                <p className="text-muted-foreground line-clamp-3 text-sm">{template.preview}</p>
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <span>{template.usageCount} campaigns</span>
                  <span>Updated {formatDate(template.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
