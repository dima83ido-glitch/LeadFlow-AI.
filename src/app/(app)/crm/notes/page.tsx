import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { NotesView } from "@/components/crm/notes-view";

export const metadata: Metadata = { title: "Notes" };

export default function NotesPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Notes" description="Shared notes about your leads, contacts, and deals." />
      <NotesView />
    </div>
  );
}
