"use client";

import * as React from "react";
import { Globe, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { FindingItem, ToolResultPanel } from "@/components/ai-tools/tool-result-panel";

interface AnalysisResult {
  score: number;
  findings: { status: "good" | "warning" | "bad"; label: string; detail: string }[];
}

function buildResult(url: string): AnalysisResult {
  return {
    score: 78,
    findings: [
      { status: "good", label: "Tech stack detected", detail: `${url || "This site"} runs on a modern JS framework with HTTPS enabled.` },
      { status: "warning", label: "Page speed", detail: "Largest Contentful Paint is 3.2s — consider optimizing hero images." },
      { status: "good", label: "Mobile-friendly", detail: "Layout adapts well across common breakpoints." },
      { status: "bad", label: "Messaging clarity", detail: "Homepage headline doesn't clearly state the value proposition." },
      { status: "warning", label: "Call-to-action visibility", detail: "Primary CTA is below the fold on first viewport." },
    ],
  };
}

export default function WebsiteAnalyzerView() {
  const [url, setUrl] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<AnalysisResult | null>(null);

  function handleAnalyze() {
    if (!url) return;
    setIsLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(buildResult(url));
      setIsLoading(false);
    }, 1100);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="h-fit lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Website</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel htmlFor="url">Website URL</FieldLabel>
            <Input
              id="url"
              placeholder="e.g. northwindanalytics.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Field>
          <Button className="w-full" onClick={handleAnalyze} disabled={isLoading || !url}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Analyze
          </Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-base">Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ToolResultPanel
            isLoading={isLoading}
            hasResult={result !== null}
            emptyIcon={Globe}
            emptyTitle="No analysis yet"
            emptyDescription="Enter a website URL and click Analyze to see a report."
          >
            {result && (
              <>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Overall score</span>
                    <span className="text-muted-foreground">{result.score} / 100</span>
                  </div>
                  <Progress value={result.score} className="h-2" />
                </div>
                <div className="space-y-2">
                  {result.findings.map((finding) => (
                    <FindingItem key={finding.label} {...finding} />
                  ))}
                </div>
              </>
            )}
          </ToolResultPanel>
        </CardContent>
      </Card>
    </div>
  );
}
