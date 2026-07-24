import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/db";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import type { Note } from "@/types/crm";
import { PageHeader } from "@/components/shared/page-header";
import { NotesView } from "@/components/crm/notes-view";

export const metadata: Metadata = { title: "Notes" };

export default async function NotesPage() {
  const t = await getTranslations("crm.notes");
  const workspaceId = await getCurrentWorkspaceId();

  const rows = await prisma.note.findMany({
    where: { workspaceId },
    include: { author: true, company: true, contact: true },
    orderBy: { createdAt: "desc" },
  });

  const notes: Note[] = rows.map((row) => ({
    id: row.id,
    content: row.content,
    authorName: row.author?.name ?? row.author?.email ?? "Unknown",
    relatedTo: row.contact
      ? [row.contact.firstName, row.contact.lastName].filter(Boolean).join(" ")
      : row.company?.name,
    createdAt: row.createdAt.toISOString(),
  }));

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
      <NotesView notes={notes} />
    </div>
  );
}
