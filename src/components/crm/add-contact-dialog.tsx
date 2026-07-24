"use client";

import * as React from "react";
import { UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { ContactFormDialog } from "@/components/crm/contact-form-dialog";

export function AddContactDialog() {
  const t = useTranslations("crm.contacts.addDialog");
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="size-4" />
        {t("trigger")}
      </Button>
      <ContactFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
