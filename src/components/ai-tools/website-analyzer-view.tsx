"use client";

import * as React from "react";
import { ExternalLink, Globe, Loader2, Lock, LockOpen, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { analyzeWebsite, type WebsiteAnalysisData } from "@/lib/actions/ai-website-analyzer";
import { cn } from "@/lib/utils";
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
  const [result, setResult] = React.useState<WebsiteAnalysisData | null>(null);
  const [errorCode, setErrorCode] = React.useState<string | null>(null);

  async function handleAnalyze(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = url.trim();
    if (!trimmed || isLoading) return;
    setIsLoading(true);
    setResult(null);
    setErrorCode(null);
    const response = await analyzeWebsite(trimmed);
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
        <form onSubmit={handleAnalyze}>
          <CardContent className="space-y-4">
            <Field>
              <FieldLabel htmlFor="url">{t("form.urlLabel")}</FieldLabel>
              <Input
                id="url"
                type="text"
                inputMode="url"
                autoComplete="url"
                placeholder={t("form.urlPlaceholder")}
                value={url}
                disabled={isLoading}
                onChange={(e) => setUrl(e.target.value)}
              />
            </Field>
            <Button type="submit" className="w-full" disabled={isLoading || !url.trim()}>
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {isLoading ? t("form.analyzing") : t("form.submit")}
            </Button>
          </CardContent>
        </form>
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
                <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <a
                    href={result.analyzedUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-foreground hover:text-primary flex min-w-0 items-center gap-1.5 text-sm font-medium transition-colors"
                  >
                    <span className="truncate">{result.analyzedUrl}</span>
                    <ExternalLink className="size-3.5 shrink-0" />
                  </a>
                  <Badge
                    variant="outline"
                    className={cn(
                      "shrink-0 gap-1",
                      result.isHttps
                        ? "border-transparent bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400",
                    )}
                  >
                    {result.isHttps ? <Lock className="size-3" /> : <LockOpen className="size-3" />}
                    {result.isHttps ? "HTTPS" : "HTTP"}
                  </Badge>
                </div>

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
