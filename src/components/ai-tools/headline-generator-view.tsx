"use client";

import * as React from "react";
import { Lightbulb, Loader2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { generateHeadlines } from "@/lib/actions/ai-headline-generator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/ai-tools/copy-button";
import { ToolResultPanel } from "@/components/ai-tools/tool-result-panel";

export default function HeadlineGeneratorView() {
  const t = useTranslations("aiTools.headlineGenerator");
  const tErr = useTranslations("aiTools.errors");
  const [product, setProduct] = React.useState("");
  const [valueProp, setValueProp] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<string[] | null>(null);
  const [errorCode, setErrorCode] = React.useState<string | null>(null);

  async function handleGenerate() {
    if (!product) return;
    setIsLoading(true);
    setResults(null);
    setErrorCode(null);
    const response = await generateHeadlines(product, valueProp);
    setIsLoading(false);
    if (response.ok) {
      setResults(response.data.headlines);
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
            <FieldLabel htmlFor="product">{t("form.productLabel")}</FieldLabel>
            <Input
              id="product"
              placeholder={t("form.productPlaceholder")}
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="valueProp">{t("form.valuePropLabel")}</FieldLabel>
            <Input
              id="valueProp"
              placeholder={t("form.valuePropPlaceholder")}
              value={valueProp}
              onChange={(e) => setValueProp(e.target.value)}
            />
          </Field>
          <Button className="w-full" onClick={handleGenerate} disabled={isLoading || !product}>
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
            hasResult={results !== null}
            emptyIcon={Lightbulb}
            emptyTitle={t("result.emptyTitle")}
            emptyDescription={t("result.emptyDescription")}
          >
            {results && (
              <div className="space-y-2">
                {results.map((headline) => (
                  <div key={headline} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                    <p className="text-sm font-medium">{headline}</p>
                    <CopyButton value={headline} />
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
