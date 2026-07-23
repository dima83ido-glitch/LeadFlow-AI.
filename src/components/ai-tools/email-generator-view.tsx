"use client";

import * as React from "react";
import { Loader2, Mail, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

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

function buildResult(company: string, tone: string, keyPoints: string): EmailResult {
  const name = company || "there";
  const opener =
    tone === "Formal"
      ? `Dear ${name} team,`
      : tone === "Direct"
        ? `Hi ${name},`
        : `Hey ${name}! 👋`;

  return {
    subject: `A faster way for ${company || "your team"} to close more deals`,
    body: `${opener}

I came across ${company || "your company"} and wanted to reach out — ${
      keyPoints || "it looks like your team could benefit from a more streamlined outreach process"
    }.

We've helped similar teams cut their prospecting time in half while improving reply rates. Would you be open to a quick 15-minute call this week to see if it's a fit?

Best,
Dmitry`,
  };
}

export default function EmailGeneratorView() {
  const t = useTranslations("aiTools.emailGenerator");
  const [company, setCompany] = React.useState("");
  const [tone, setTone] = React.useState<string>("Friendly");
  const [keyPoints, setKeyPoints] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<EmailResult | null>(null);

  function handleGenerate() {
    setIsLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(buildResult(company, tone, keyPoints));
      setIsLoading(false);
    }, 1000);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="h-fit lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">{t("form.cardTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
