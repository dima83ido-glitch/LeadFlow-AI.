"use client";

import * as React from "react";
import { Globe, Loader2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { analyzeWebsite } from "@/lib/actions/ai-website-analyzer";
import type { WebsiteAnalysisResult } from "@/lib/ai/schemas";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { FindingItem, ToolResultPanel } from "@/components/ai-tools/tool-result-panel";

export default function WebsiteAnalyzerView() {
  const t = useTranslations("aiTools.websiteAnalyzer");
  const tCat = useTranslations("aiTools.websiteAnalyzer.categories");
  const tErr = useTranslations("aiTools.errors");
  const [url, setUrl] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<WebsiteAnalysisResult | null>(null);
  const [errorCode, setErrorCode] = React.useState<string | null>(null);

  async function handleAnalyze() {
    if (!url) return;
    setIsLoading(true);
    setResult(null);
    setErrorCode(null);
    const response = await analyzeWebsite(url);
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
            emptyIcon={Globe}
            emptyTitle={t("result.emptyTitle")}
            emptyDescription={t("result.emptyDescription")}
          >
            {result && (
              <>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{t("result.overallScore")}</span>
                    <span className="text-muted-foreground">{result.overallScore} / 100</span>
                  </div>
                  <Progress value={result.overallScore} className="h-2" />
                </div>

                {result.categories.map((category) => (
                  <div key={category.key} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold">
                        {tCat.has(category.key) ? tCat(category.key) : category.key}
                      </h4>
                      <Badge variant="outline">{category.score}/100</Badge>
                    </div>
                    <div className="space-y-2">
                      {category.findings.map((finding, i) => (
                        <FindingItem key={`${category.key}-${i}`} {...finding} />
                      ))}
                    </div>
                  </div>
                ))}

                <div className="space-y-2 rounded-lg border p-3">
                  <h4 className="text-sm font-semibold">{t("result.recommendations")}</h4>
                  <ul className="list-disc space-y-1 pl-4 text-sm">
                    {result.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </ToolResultPanel>
        </CardContent>
      </Card>
    </div>
  );
}
