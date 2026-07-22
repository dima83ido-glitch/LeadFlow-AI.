"use client";

import { Users } from "lucide-react";

import { mockContacts } from "@/lib/mock/companies";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { contactsColumns } from "@/components/crm/contacts-columns";

export function ContactsView() {
  if (mockContacts.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No contacts yet"
        description="Add a contact to start tracking outreach with them."
      />
    );
  }

  return <DataTable columns={contactsColumns} data={mockContacts} />;
}
