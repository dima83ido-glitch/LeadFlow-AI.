"use client";

import * as React from "react";
import { Loader2, Wand2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { rewriteEmail } from "@/lib/actions/ai-rewrite-email";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ai-tools/copy-button";
import { ToolResultPanel } from "@/components/ai-tools/tool-result-panel";

const tones = ["More formal", "More friendly", "More concise", "More persuasive"] as const;

export default function RewriteEmailView() {
  const t = useTranslations("aiTools.rewriteEmail");
  const tErr = useTranslations("aiTools.errors");
  const [original, setOriginal] = React.useState("");
  const [tone, setTone] = React.useState<string>("More concise");
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [errorCode, setErrorCode] = React.useState<string | null>(null);

  async function handleRewrite() {
    if (!original) return;
    setIsLoading(true);
    setResult(null);
    setErrorCode(null);
    const response = await rewriteEmail(original, tone);
    setIsLoading(false);
    if (response.ok) {
      setResult(response.data.rewrittenText);
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
          <Button className="w-full" onClick={handleRewrite} disabled={isLoading || !original}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
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
            emptyIcon={Wand2}
            emptyTitle={t("result.emptyTitle")}
            emptyDescription={t("result.emptyDescription")}
          >
            {result && (
              <Tabs defaultValue="rewritten">
                <TabsList>
                  <TabsTrigger value="rewritten">{t("result.rewrittenTab")}</TabsTrigger>
                  <TabsTrigger value="original">{t("result.originalTab")}</TabsTrigger>
                </TabsList>
                <TabsContent value="rewritten" className="space-y-2">
                  <div className="flex justify-end">
                    <CopyButton value={result} />
                  </div>
                  <p className="text-sm whitespace-pre-line">{result}</p>
                </TabsContent>
                <TabsContent value="original">
                  <p className="text-muted-foreground text-sm whitespace-pre-line">{original}</p>
                </TabsContent>
              </Tabs>
            )}
          </ToolResultPanel>
        </CardContent>
      </Card>
    </div>
  );
}
