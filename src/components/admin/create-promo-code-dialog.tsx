"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

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

export function CreatePromoCodeDialog({ onCreate }: { onCreate: (code: string, discount: number) => void }) {
  const t = useTranslations("admin.promoCodes.createDialog");
  const tc = useTranslations("common.actions");
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [discount, setDiscount] = React.useState("10");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    const upperCode = code.trim().toUpperCase();
    onCreate(upperCode, Number(discount) || 0);
    toast.success(t("createdToast", { code: upperCode }));
    setCode("");
    setDiscount("10");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="size-4" />
        {t("trigger")}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="code">{t("codeLabel")}</FieldLabel>
              <Input
                id="code"
                placeholder={t("codePlaceholder")}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="discount">{t("discountLabel")}</FieldLabel>
              <Input
                id="discount"
                type="number"
                min={1}
                max={100}
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {tc("cancel")}
            </Button>
            <Button type="submit">{tc("create")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
