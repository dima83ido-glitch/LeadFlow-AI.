"use client";

import * as React from "react";
import { UserPlus } from "lucide-react";
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

export function InviteMemberDialog() {
  const t = useTranslations("settings.workspace");
  const tc = useTranslations("common.actions");
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success(t("inviteSuccessToast", { email: email.trim() }));
    setEmail("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <UserPlus className="size-4" />
        {t("inviteMember")}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("inviteDialogTitle")}</DialogTitle>
            <DialogDescription>{t("inviteDialogDescription")}</DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="inviteEmail">{t("emailAddress")}</FieldLabel>
              <Input
                id="inviteEmail"
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {tc("cancel")}
            </Button>
            <Button type="submit">{t("sendInvite")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
