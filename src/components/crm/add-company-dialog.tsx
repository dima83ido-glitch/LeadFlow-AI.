"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { CompanyFormDialog } from "@/components/crm/company-form-dialog";

export function AddCompanyDialog() {
  const t = useTranslations("crm.companies.addDialog");
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        {t("trigger")}
      </Button>
      <CompanyFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
