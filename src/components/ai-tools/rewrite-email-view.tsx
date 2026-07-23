"use client";

import * as React from "react";
import { Loader2, Wand2 } from "lucide-react";
import { useTranslations } from "next-intl";

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

function buildResult(original: string, tone: string): string {
  const base =
    original.trim() ||
    "Hi there, just wanted to check in about the proposal we sent last week. Let me know if you have any questions.";

  if (tone === "More concise") {
    return "Hi — following up on our proposal. Any questions before we move forward?";
  }
  if (tone === "More formal") {
    return `Dear team,\n\nI wanted to follow up regarding the proposal shared last week. Please let us know if you require any further information.\n\nBest regards,\nDmitry`;
  }
  if (tone === "More persuasive") {
    return `Hi! Quick nudge on the proposal — teams that move on this within a week typically see results within the first month. Happy to answer anything holding you back.`;
  }
  return `Hey! Just checking in on the proposal 🙂 Let me know if anything's unclear — happy to hop on a quick call.\n\n(Original: "${base.slice(0, 60)}...")`;
}

export default function RewriteEmailView() {
  const t = useTranslations("aiTools.rewriteEmail");
  const [original, setOriginal] = React.useState("");
  const [tone, setTone] = React.useState<string>("More concise");
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);

  function handleRewrite() {
    if (!original) return;
    setIsLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(buildResult(original, tone));
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
