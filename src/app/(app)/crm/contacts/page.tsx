import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { AddContactDialog } from "@/components/crm/add-contact-dialog";
import { ContactsView } from "@/components/crm/contacts-view";

export const metadata: Metadata = { title: "Contacts" };

export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Contacts"
        description="People you're building relationships with."
        actions={<AddContactDialog />}
      />
      <ContactsView />
    </div>
  );
}
