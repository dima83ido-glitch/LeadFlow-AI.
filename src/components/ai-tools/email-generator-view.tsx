"use client";

import * as React from "react";
import { Loader2, Mail, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { draftEmail } from "@/lib/actions/ai-email-draft";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ai-tools/copy-button";
import { ToolResultPanel } from "@/components/ai-tools/tool-result-panel";

const tones = ["Formal", "Friendly", "Direct"] as const;

interface EmailResult {
  subject: string;
  body: string;
}

export default function EmailGeneratorView() {
  const t = useTranslations("aiTools.emailGenerator");
  const tErr = useTranslations("aiTools.errors");
  const [purpose, setPurpose] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [tone, setTone] = React.useState<string>("Friendly");
  const [keyPoints, setKeyPoints] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<EmailResult | null>(null);
  const [errorCode, setErrorCode] = React.useState<string | null>(null);

  async function handleGenerate() {
    if (!purpose) return;
    setIsLoading(true);
    setResult(null);
    setErrorCode(null);
    const response = await draftEmail({ purpose, recipient: company, tone, keyPoints });
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
            <FieldLabel htmlFor="purpose">{t("form.purposeLabel")}</FieldLabel>
            <Input
              id="purpose"
              placeholder={t("form.purposePlaceholder")}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="company">{t("form.recipientLabel")}</FieldLabel>
            <Input
              id="company"
              placeholder={t("form.recipientPlaceholder")}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
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
          <Field>
            <FieldLabel htmlFor="keyPoints">{t("form.keyPointsLabel")}</FieldLabel>
            <Textarea
              id="keyPoints"
              placeholder={t("form.keyPointsPlaceholder")}
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              rows={4}
            />
          </Field>
          <Button className="w-full" onClick={handleGenerate} disabled={isLoading || !purpose}>
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
            emptyIcon={Mail}
            emptyTitle={t("result.emptyTitle")}
            emptyDescription={t("result.emptyDescription")}
          >
            {result && (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">{t("result.subject")}</p>
                    <p className="font-medium">{result.subject}</p>
                  </div>
                  <CopyButton value={result.subject} label={t("result.copySubject")} />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-xs">{t("result.body")}</p>
                    <CopyButton value={result.body} label={t("result.copyBody")} />
                  </div>
                  <p className="text-sm whitespace-pre-line">{result.body}</p>
                </div>
              </>
            )}
          </ToolResultPanel>
        </CardContent>
      </Card>
    </div>
  );
}
