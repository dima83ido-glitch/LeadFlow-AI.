"use client";

import * as React from "react";
import { Check, Copy, Plus, TriangleAlert } from "lucide-react";
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
    toast.success("API key copied to clipboard.");
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
        Create API Key
      </DialogTrigger>
      <DialogContent>
        {generatedKey ? (
          <>
            <DialogHeader>
              <DialogTitle>API key created</DialogTitle>
              <DialogDescription>
                Copy this key now — for security, it won&apos;t be shown again.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 py-4">
              <Input readOnly value={generatedKey} className="font-mono text-sm" />
              <Button type="button" variant="outline" size="icon" onClick={handleCopy}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </Button>
            </div>
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertTitle>This key won&apos;t be shown again</AlertTitle>
              <AlertDescription>Store it somewhere safe, like a password manager.</AlertDescription>
            </Alert>
            <DialogFooter>
              <Button onClick={() => handleClose(false)}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>Give your key a name to identify where it&apos;s used.</DialogDescription>
            </DialogHeader>
            <FieldGroup className="py-4">
              <Field>
                <FieldLabel htmlFor="keyName">Name</FieldLabel>
                <Input
                  id="keyName"
                  placeholder="e.g. Production integration"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleClose(false)}>
                Cancel
              </Button>
              <Button type="submit">Generate key</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
