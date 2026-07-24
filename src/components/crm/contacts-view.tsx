"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import type { Locale } from "@/i18n/config";
import { deleteContact } from "@/lib/actions/contacts";
import type { Contact } from "@/types/company";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { getContactsColumns } from "@/components/crm/contacts-columns";
import { ContactFormDialog } from "@/components/crm/contact-form-dialog";

export function ContactsView({ contacts }: { contacts: Contact[] }) {
  const t = useTranslations();
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [editingContact, setEditingContact] = React.useState<Contact | null>(null);

  async function handleDelete(contact: Contact) {
    const result = await deleteContact(contact.id);
    if (result.ok) {
      toast.success(t("crm.contacts.deletedToast", { name: contact.firstName }));
      router.refresh();
    } else {
      toast.error(tc("genericErrorToast"));
    }
  }

  const columns = React.useMemo(
    () => getContactsColumns(t, locale, { onEdit: setEditingContact, onDelete: handleDelete }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, locale],
  );

  if (contacts.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={t("crm.contacts.emptyTitle")}
        description={t("crm.contacts.emptyDescription")}
      />
    );
  }

  return (
    <>
      <DataTable columns={columns} data={contacts} />
      <ContactFormDialog
        open={Boolean(editingContact)}
        onOpenChange={(open) => !open && setEditingContact(null)}
        contact={editingContact ?? undefined}
      />
    </>
  );
}
