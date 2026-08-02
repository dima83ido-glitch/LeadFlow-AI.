"use client";

import * as React from "react";
import { Check, Copy, Plus, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { generateFakeApiKey } from "@/lib/mock/api-keys";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function CreateApiKeyDialog({ onCreate }: { onCreate: (name: string) => void }) {
  const t = useTranslations("settings.apiKeys");
  const tc = useTranslations("common.actions");
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [generatedKey, setGeneratedKey] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setGeneratedKey(generateFakeApiKey());
  }

  function handleCopy() {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    toast.success(t("copiedToast"));
    setTimeout(() => setCopied(false), 1500);
  }

  function handleClose(nextOpen: boolean) {
    if (!nextOpen && generatedKey) {
      onCreate(name.trim());
    }
    if (!nextOpen) {
      setName("");
      setGeneratedKey(null);
      setCopied(false);
    }
    setOpen(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger render={<Button />}>
        <Plus className="size-4" />
        {t("createButton")}
      </DialogTrigger>
      <DialogContent>
        {generatedKey ? (
          <>
            <DialogHeader>
              <DialogTitle>{t("createdTitle")}</DialogTitle>
              <DialogDescription>{t("createdDescription")}</DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 py-4">
              <Input readOnly value={generatedKey} className="font-mono text-sm" />
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={copied ? tc("copied") : tc("copy")}
                onClick={handleCopy}
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </Button>
            </div>
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertTitle>{t("keyWontShowTitle")}</AlertTitle>
              <AlertDescription>{t("keyWontShowDescription")}</AlertDescription>
            </Alert>
            <DialogFooter>
              <Button onClick={() => handleClose(false)}>{t("done")}</Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{t("createDialogTitle")}</DialogTitle>
              <DialogDescription>{t("createDialogDescription")}</DialogDescription>
            </DialogHeader>
            <FieldGroup className="py-4">
              <Field>
                <FieldLabel htmlFor="keyName">{t("nameLabel")}</FieldLabel>
                <Input
                  id="keyName"
                  placeholder={t("namePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleClose(false)}>
                {tc("cancel")}
              </Button>
              <Button type="submit">{t("generateKey")}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
