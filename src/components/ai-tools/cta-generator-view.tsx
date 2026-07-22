"use client";

import * as React from "react";
import { Loader2, MousePointerClick, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyButton } from "@/components/ai-tools/copy-button";
import { ToolResultPanel } from "@/components/ai-tools/tool-result-panel";

const goals = ["Book a call", "Start free trial", "Reply to email", "Download resource"] as const;

const templates: Record<(typeof goals)[number], (context: string) => string[]> = {
  "Book a call": (context) => [
    "Book a 15-minute call",
    "Grab a time on my calendar",
    `See how it works for ${context || "your team"}`,
    "Talk to us this week",
    "Schedule a quick demo",
    "Find a time that works",
  ],
  "Start free trial": () => [
    "Start your free trial",
    "Try it free for 14 days",
    "Get started at no cost",
    "Create your free account",
    "See it in action free",
    "Start free — no card needed",
  ],
  "Reply to email": (context) => [
    "Worth a quick reply?",
    `Interested in ${context || "this"}?`,
    "Let me know your thoughts",
    "Reply if this is useful",
    "Should we connect?",
    "Happy to share more — just reply",
  ],
  "Download resource": (context) => [
    `Download the ${context || "free"} guide`,
    "Get the free resource",
    "Grab your copy now",
    "Download now — it's free",
    "Access the full report",
    "Get instant access",
  ],
};

export default function CtaGeneratorView() {
  const [goal, setGoal] = React.useState<(typeof goals)[number]>("Book a call");
  const [context, setContext] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<string[] | null>(null);

  function handleGenerate() {
    setIsLoading(true);
    setResults(null);
    setTimeout(() => {
      setResults(templates[goal](context));
      setIsLoading(false);
    }, 800);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="h-fit lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Campaign Goal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel htmlFor="goal">Goal</FieldLabel>
            <Select value={goal} onValueChange={(value) => value && setGoal(value as (typeof goals)[number])}>
              <SelectTrigger id="goal" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {goals.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="context">Context (optional)</FieldLabel>
            <Input
              id="context"
              placeholder="e.g. the pricing guide"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </Field>
          <Button className="w-full" onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Generate
          </Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-base">CTA Variants</CardTitle>
        </CardHeader>
        <CardContent>
          <ToolResultPanel
            isLoading={isLoading}
            hasResult={results !== null}
            emptyIcon={MousePointerClick}
            emptyTitle="No CTAs yet"
            emptyDescription="Pick a goal and click Generate to see call-to-action variants."
          >
            {results && (
              <div className="grid gap-2 sm:grid-cols-2">
                {results.map((cta) => (
                  <div key={cta} className="flex items-center justify-between gap-2 rounded-lg border p-3">
                    <p className="text-sm font-medium">{cta}</p>
                    <CopyButton value={cta} label="Copy" />
                  </div>
                ))}
              </div>
            )}
          </ToolResultPanel>
        </CardContent>
      </Card>
    </div>
  );
}
