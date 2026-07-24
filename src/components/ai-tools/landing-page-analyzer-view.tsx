"use client";

import * as React from "react";
import { FileCode2, Loader2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { analyzeLandingPage } from "@/lib/actions/ai-landing-page-analyzer";
import type { LandingPageAnalysisResult } from "@/lib/ai/schemas";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { FindingItem, ToolResultPanel } from "@/components/ai-tools/tool-result-panel";

export default function LandingPageAnalyzerView() {
  const t = useTranslations("aiTools.landingPageAnalyzer");
  const tErr = useTranslations("aiTools.errors");
  const [url, setUrl] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<LandingPageAnalysisResult | null>(null);
  const [errorCode, setErrorCode] = React.useState<string | null>(null);

  async function handleAnalyze() {
    if (!url) return;
    setIsLoading(true);
    setResult(null);
    setErrorCode(null);
    const response = await analyzeLandingPage(url);
    setIsLoading(false);
    if (response.ok) {
      setResult(response.data);
    } else {
      setErrorCode(response.errorCode);
    }
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
          {errorCode && !isLoading && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>{tErr("title")}</AlertTitle>
              <AlertDescription>{tErr.has(errorCode) ? tErr(errorCode) : tErr("generic")}</AlertDescription>
            </Alert>
          )}
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
                  {result.findings.map((finding, i) => (
                    <FindingItem key={i} {...finding} />
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
