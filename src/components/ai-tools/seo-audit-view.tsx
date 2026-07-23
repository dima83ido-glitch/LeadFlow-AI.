"use client";

import * as React from "react";
import { Gauge, Loader2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { FindingItem, type FindingStatus, ToolResultPanel } from "@/components/ai-tools/tool-result-panel";

interface SeoResult {
  score: number;
  categories: { category: string; status: FindingStatus; detail: string }[];
}

function buildResult(url: string): SeoResult {
  const site = url || "the site";
  return {
    score: 82,
    categories: [
      { category: "Meta tags", status: "good", detail: `${site} has unique title tags and meta descriptions on key pages.` },
      { category: "Performance", status: "warning", detail: "Largest image assets aren't compressed, adding ~1.1s to load time." },
      { category: "Accessibility", status: "good", detail: "Color contrast and alt text coverage meet WCAG AA on sampled pages." },
      { category: "Content", status: "warning", detail: "Blog content hasn't been updated in 90+ days — may affect freshness signals." },
    ],
  };
}

export default function SeoAuditView() {
  const t = useTranslations("aiTools.seoAudit");
  const [url, setUrl] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<SeoResult | null>(null);

  function handleRun() {
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
          <Button className="w-full" onClick={handleRun} disabled={isLoading || !url}>
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
            emptyIcon={Gauge}
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
                  {result.categories.map((category) => (
                    <FindingItem
                      key={category.category}
                      status={category.status}
                      label={category.category}
                      detail={category.detail}
                    />
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
