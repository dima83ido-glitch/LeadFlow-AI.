import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/page-header";
import { AddContactDialog } from "@/components/crm/add-contact-dialog";
import { ContactsView } from "@/components/crm/contacts-view";

export const metadata: Metadata = { title: "Contacts" };

export default function ContactsPage() {
  const t = useTranslations("crm.contacts");

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("pageTitle")}
        description={t("pageDescription")}
        actions={<AddContactDialog />}
      />
      <ContactsView />
    </div>
  );
}
