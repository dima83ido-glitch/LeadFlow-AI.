"use client";

import * as React from "react";
import { Languages, Loader2 } from "lucide-react";

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

const languages = ["Spanish", "French", "German", "Japanese", "Portuguese"] as const;

const placeholders: Record<(typeof languages)[number], string> = {
  Spanish:
    "Hola, quería hacer un seguimiento de la propuesta que enviamos la semana pasada. Avísame si tienes alguna pregunta.",
  French:
    "Bonjour, je voulais faire un suivi concernant la proposition envoyée la semaine dernière. N'hésitez pas si vous avez des questions.",
  German:
    "Hallo, ich wollte kurz zu unserem Angebot von letzter Woche nachfragen. Lassen Sie mich wissen, falls Sie Fragen haben.",
  Japanese: "こんにちは、先週お送りした提案について確認のご連絡です。ご質問があればお知らせください。",
  Portuguese:
    "Olá, gostaria de dar um retorno sobre a proposta enviada na semana passada. Me avise se tiver alguma dúvida.",
};

export default function TranslateEmailView() {
  const [original, setOriginal] = React.useState("");
  const [language, setLanguage] = React.useState<(typeof languages)[number]>("Spanish");
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);

  function handleTranslate() {
    if (!original) return;
    setIsLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(placeholders[language]);
      setIsLoading(false);
    }, 1000);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="h-fit lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Original Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel htmlFor="original">Paste your email</FieldLabel>
            <Textarea
              id="original"
              placeholder="Paste the email you want to translate..."
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              rows={6}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="language">Target language</FieldLabel>
            <Select
              value={language}
              onValueChange={(value) => value && setLanguage(value as (typeof languages)[number])}
            >
              <SelectTrigger id="language" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Button className="w-full" onClick={handleTranslate} disabled={isLoading || !original}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Languages className="size-4" />}
            Translate
          </Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-base">Translation</CardTitle>
        </CardHeader>
        <CardContent>
          <ToolResultPanel
            isLoading={isLoading}
            hasResult={result !== null}
            emptyIcon={Languages}
            emptyTitle="No translation yet"
            emptyDescription="Paste an email and pick a language to translate it."
          >
            {result && (
              <>
                <div className="flex justify-end">
                  <CopyButton value={result} label="Copy" />
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
