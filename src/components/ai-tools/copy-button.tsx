"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

export function CopyButton({ value, label, className }: CopyButtonProps) {
  const t = useTranslations();
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(t("aiTools.copyButton.success"));
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error(t("aiTools.copyButton.error"));
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("shrink-0", className)}
      onClick={handleCopy}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {label ?? t("common.actions.copy")}
    </Button>
  );
}
