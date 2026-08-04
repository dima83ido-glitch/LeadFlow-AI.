"use client";

import * as React from "react";
import { Loader2, MousePointerClick, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { generateCtas } from "@/lib/actions/ai-cta-generator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

export default function CtaGeneratorView() {
  const t = useTranslations("aiTools.ctaGenerator");
  const tErr = useTranslations("aiTools.errors");
  const [goal, setGoal] = React.useState<(typeof goals)[number]>("Book a call");
  const [context, setContext] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<string[] | null>(null);
  const [errorCode, setErrorCode] = React.useState<string | null>(null);

  async function handleGenerate() {
    setIsLoading(true);
    setResults(null);
    setErrorCode(null);
    const response = await generateCtas(goal, context);
    setIsLoading(false);
    if (response.ok) {
      setResults(response.data.ctas);
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
            <FieldLabel htmlFor="goal">{t("form.goalLabel")}</FieldLabel>
            <Select value={goal} onValueChange={(value) => value && setGoal(value as (typeof goals)[number])}>
              <SelectTrigger id="goal" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {goals.map((g) => (
                  <SelectItem key={g} value={g}>
                    {t(`form.goals.${g}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="context">{t("form.contextLabel")}</FieldLabel>
            <Input
              id="context"
              placeholder={t("form.contextPlaceholder")}
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </Field>
          <Button className="w-full" onClick={handleGenerate} disabled={isLoading}>
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
            emptyIcon={MousePointerClick}
            emptyTitle={t("result.emptyTitle")}
            emptyDescription={t("result.emptyDescription")}
          >
            {results && (
              <div className="grid gap-2 sm:grid-cols-2">
                {results.map((cta) => (
                  <div key={cta} className="flex items-center justify-between gap-2 rounded-lg border p-3">
                    <p className="text-sm font-medium">{cta}</p>
                    <CopyButton value={cta} />
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
