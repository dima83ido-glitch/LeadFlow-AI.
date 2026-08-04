"use client";

import * as React from "react";
import { Loader2, Mails, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { generateSubjectLines } from "@/lib/actions/ai-subject-generator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ai-tools/copy-button";
import { ToolResultPanel } from "@/components/ai-tools/tool-result-panel";

const tones = ["Curious", "Direct", "Playful", "Formal"] as const;

interface SubjectVariant {
  text: string;
  openRate: number;
}

export default function SubjectGeneratorView() {
  const t = useTranslations("aiTools.subjectGenerator");
  const tErr = useTranslations("aiTools.errors");
  const [context, setContext] = React.useState("");
  const [tone, setTone] = React.useState<string>("Curious");
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<SubjectVariant[] | null>(null);
  const [errorCode, setErrorCode] = React.useState<string | null>(null);

  async function handleGenerate() {
    if (!context) return;
    setIsLoading(true);
    setResults(null);
    setErrorCode(null);
    const response = await generateSubjectLines(context, tone);
    setIsLoading(false);
    if (response.ok) {
      setResults(response.data.subjects);
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
            <FieldLabel htmlFor="context">{t("form.contextLabel")}</FieldLabel>
            <Textarea
              id="context"
              placeholder={t("form.contextPlaceholder")}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={4}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="tone">{t("form.toneLabel")}</FieldLabel>
            <Select value={tone} onValueChange={(value) => value && setTone(value)}>
              <SelectTrigger id="tone" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tones.map((toneOption) => (
                  <SelectItem key={toneOption} value={toneOption}>
                    {t(`form.tones.${toneOption}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Button className="w-full" onClick={handleGenerate} disabled={isLoading || !context}>
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
            emptyIcon={Mails}
            emptyTitle={t("result.emptyTitle")}
            emptyDescription={t("result.emptyDescription")}
          >
            {results && (
              <div className="space-y-2">
                {results.map((variant) => (
                  <div
                    key={variant.text}
                    className="flex items-center justify-between gap-3 rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{variant.text}</p>
                      <Badge variant="secondary" className="text-xs">
                        {t("result.openRate", { rate: variant.openRate })}
                      </Badge>
                    </div>
                    <CopyButton value={variant.text} />
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
