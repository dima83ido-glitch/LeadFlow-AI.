"use client";

import * as React from "react";
import { Lightbulb, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/ai-tools/copy-button";
import { ToolResultPanel } from "@/components/ai-tools/tool-result-panel";

function buildResults(product: string, valueProp: string): string[] {
  const name = product || "Your Product";
  const value = valueProp || "get more done in less time";
  return [
    `${name}: The fastest way to ${value}`,
    `Meet ${name} — built to help you ${value}`,
    `${value.charAt(0).toUpperCase() + value.slice(1)}, powered by ${name}`,
    `Stop wasting time. Start using ${name}.`,
    `${name} helps teams ${value} every day`,
  ];
}

export default function HeadlineGeneratorView() {
  const [product, setProduct] = React.useState("");
  const [valueProp, setValueProp] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<string[] | null>(null);

  function handleGenerate() {
    setIsLoading(true);
    setResults(null);
    setTimeout(() => {
      setResults(buildResults(product, valueProp));
      setIsLoading(false);
    }, 900);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="h-fit lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel htmlFor="product">Product / company name</FieldLabel>
            <Input
              id="product"
              placeholder="e.g. LeadFlow AI"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="valueProp">Value proposition</FieldLabel>
            <Input
              id="valueProp"
              placeholder="e.g. find and close new clients faster"
              value={valueProp}
              onChange={(e) => setValueProp(e.target.value)}
            />
          </Field>
          <Button className="w-full" onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Generate
          </Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-base">Headline Variants</CardTitle>
        </CardHeader>
        <CardContent>
          <ToolResultPanel
            isLoading={isLoading}
            hasResult={results !== null}
            emptyIcon={Lightbulb}
            emptyTitle="No headlines yet"
            emptyDescription="Describe your product and click Generate to see headline options."
          >
            {results && (
              <div className="space-y-2">
                {results.map((headline) => (
                  <div key={headline} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                    <p className="text-sm font-medium">{headline}</p>
                    <CopyButton value={headline} label="Copy" />
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
