"use client";

import * as React from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { applySuggestedContent } from "@/lib/actions/ai-personalization";
import { Button } from "@/components/ui/button";

export function SuggestedContentCard({ item }: { item: { name: string; subject: string; body: string } }) {
  const t = useTranslations("personalization.dashboard");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [used, setUsed] = React.useState(false);

  async function handleUse() {
    setIsSubmitting(true);
    const result = await applySuggestedContent(item);
    setIsSubmitting(false);
    if (result.ok) {
      setUsed(true);
      toast.success(t("usedToast"));
    } else {
      toast.error(t("useError"));
    }
  }

  return (
    <div className="bg-muted/50 flex flex-col gap-2 rounded-lg border p-3">
      <div>
        <p className="text-sm font-medium">{item.name}</p>
        <p className="text-muted-foreground text-xs">{item.subject}</p>
      </div>
      <p className="text-muted-foreground line-clamp-3 text-xs leading-relaxed">{item.body}</p>
      <Button size="sm" variant="outline" disabled={isSubmitting || used} onClick={handleUse} className="mt-1 self-start">
        {isSubmitting ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
        {t("useThis")}
      </Button>
    </div>
  );
}
