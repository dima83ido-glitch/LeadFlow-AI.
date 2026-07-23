"use client";

import * as React from "react";
import { FileCode2, Loader2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { FindingItem, type FindingStatus, ToolResultPanel } from "@/components/ai-tools/tool-result-panel";

interface LandingPageResult {
  score: number;
  findings: { status: FindingStatus; label: string; detail: string }[];
}

function buildResult(): LandingPageResult {
  return {
    score: 71,
    findings: [
      { status: "good", label: "Headline clarity", detail: "The hero headline clearly states who the product is for and what it does." },
      { status: "warning", label: "CTA visibility", detail: "Primary CTA button contrast is low against the background." },
      { status: "bad", label: "Social proof", detail: "No testimonials, logos, or reviews found above the fold." },
      { status: "good", label: "Page length", detail: "Page length is appropriate for the offer — not too short or overwhelming." },
    ],
  };
}

export default function LandingPageAnalyzerView() {
  const t = useTranslations("aiTools.landingPageAnalyzer");
  const [url, setUrl] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<LandingPageResult | null>(null);

  function handleAnalyze() {
    if (!url) return;
    setIsLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(buildResult());
      setIsLoading(false);
    }, 1100);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="h-fit lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">{t("form.cardTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel htmlFor="url">{t("form.urlLabel")}</FieldLabel>
            <Input
              id="url"
              placeholder={t("form.urlPlaceholder")}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Field>
          <Button className="w-full" onClick={handleAnalyze} disabled={isLoading || !url}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {t("form.submit")}
          </Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-base">{t("result.cardTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ToolResultPanel
            isLoading={isLoading}
            hasResult={result !== null}
            emptyIcon={FileCode2}
            emptyTitle={t("result.emptyTitle")}
            emptyDescription={t("result.emptyDescription")}
          >
            {result && (
              <>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{t("result.score")}</span>
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
