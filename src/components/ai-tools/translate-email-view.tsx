"use client";

import * as React from "react";
import { Languages, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { translateEmail } from "@/lib/actions/ai-translate-email";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ai-tools/copy-button";
import { LanguageCombobox } from "@/components/ai-tools/language-combobox";
import { ToolResultPanel } from "@/components/ai-tools/tool-result-panel";

export default function TranslateEmailView() {
  const t = useTranslations("aiTools.translateEmail");
  const tErr = useTranslations("aiTools.errors");
  const [original, setOriginal] = React.useState("");
  const [languageCode, setLanguageCode] = React.useState("es");
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [errorCode, setErrorCode] = React.useState<string | null>(null);

  async function handleTranslate() {
    if (!original) return;
    setIsLoading(true);
    setResult(null);
    setErrorCode(null);
    const response = await translateEmail(original, languageCode);
    setIsLoading(false);
    if (response.ok) {
      setResult(response.data.translatedText);
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
            <FieldLabel htmlFor="original">{t("form.originalLabel")}</FieldLabel>
            <Textarea
              id="original"
              placeholder={t("form.originalPlaceholder")}
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              rows={6}
            />
          </Field>
          <Field>
            <FieldLabel>{t("form.languageLabel")}</FieldLabel>
            <LanguageCombobox
              value={languageCode}
              onChange={setLanguageCode}
              placeholder={t("form.languageSearchPlaceholder")}
              emptyText={t("form.languageEmptyText")}
            />
          </Field>
          <Button className="w-full" onClick={handleTranslate} disabled={isLoading || !original}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Languages className="size-4" />}
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
            emptyIcon={Languages}
            emptyTitle={t("result.emptyTitle")}
            emptyDescription={t("result.emptyDescription")}
          >
            {result && (
              <>
                <div className="flex justify-end">
                  <CopyButton value={result} />
                </div>
                <p className="text-sm whitespace-pre-line">{result}</p>
              </>
            )}
          </ToolResultPanel>
        </CardContent>
      </Card>
    </div>
  );
}
