"use client";

import * as React from "react";
import { Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { Locale } from "@/i18n/config";
import { mockContacts } from "@/lib/mock/companies";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { getContactsColumns } from "@/components/crm/contacts-columns";

export function ContactsView() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const columns = React.useMemo(() => getContactsColumns(t, locale), [t, locale]);

  if (mockContacts.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={t("crm.contacts.emptyTitle")}
        description={t("crm.contacts.emptyDescription")}
      />
    );
  }

  return <DataTable columns={columns} data={mockContacts} />;
}
