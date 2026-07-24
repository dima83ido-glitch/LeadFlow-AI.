import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/db";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import type { Contact } from "@/types/company";
import { PageHeader } from "@/components/shared/page-header";
import { AddContactDialog } from "@/components/crm/add-contact-dialog";
import { ContactsView } from "@/components/crm/contacts-view";

export const metadata: Metadata = { title: "Contacts" };

export default async function ContactsPage() {
  const t = await getTranslations("crm.contacts");
  const workspaceId = await getCurrentWorkspaceId();

  const rows = await prisma.contact.findMany({
    where: { workspaceId },
    include: { company: true },
    orderBy: { createdAt: "desc" },
  });

  const contacts: Contact[] = rows.map((row) => ({
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName ?? "",
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    jobTitle: row.jobTitle ?? undefined,
    telegramUsername: row.telegramUsername ?? undefined,
    companyId: row.companyId ?? undefined,
    companyName: row.company?.name,
    createdAt: row.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("pageTitle")}
        description={t("pageDescription")}
        actions={<AddContactDialog />}
      />
      <ContactsView contacts={contacts} />
    </div>
  );
}
