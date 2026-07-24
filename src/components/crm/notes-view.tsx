"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { NotebookText, Pencil, Send, Trash2, X, Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import type { Locale } from "@/i18n/config";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { createNote, deleteNote, updateNote } from "@/lib/actions/notes";
import type { Note } from "@/types/crm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function NoteCard({ note, locale }: { note: Note; locale: Locale }) {
  const t = useTranslations("crm.notes");
  const tc = useTranslations("common");
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(note.content);
  const [isSaving, setIsSaving] = React.useState(false);

  async function handleSave() {
    if (!draft.trim()) return;
    setIsSaving(true);
    const result = await updateNote(note.id, draft);
    setIsSaving(false);
    if (result.ok) {
      toast.success(t("updatedToast"));
      setIsEditing(false);
      router.refresh();
    } else {
      toast.error(tc("genericErrorToast"));
    }
  }

  async function handleDelete() {
    const result = await deleteNote(note.id);
    if (result.ok) {
      toast.success(t("deletedToast"));
      router.refresh();
    } else {
      toast.error(tc("genericErrorToast"));
    }
  }

  return (
    <Card>
      <CardContent className="flex items-start gap-3">
        <Avatar className="size-8">
          <AvatarFallback className="text-xs">{initials(note.authorName)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium">{note.authorName}</p>
            <div className="flex items-center gap-1">
              <p className="text-muted-foreground text-xs">
                {formatDistanceToNow(new Date(note.createdAt), {
                  addSuffix: true,
                  locale: getDateFnsLocale(locale),
                })}
              </p>
              {!isEditing && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() => {
                      setDraft(note.content);
                      setIsEditing(true);
                    }}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <ConfirmDialog
                    trigger={
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive size-7">
                        <Trash2 className="size-3.5" />
                      </Button>
                    }
                    title={t("deleteTitle")}
                    description={t("deleteDescription")}
                    confirmLabel={t("deleteConfirm")}
                    onConfirm={handleDelete}
                  />
                </>
              )}
            </div>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                  <X className="size-3.5" />
                  {tc("actions.cancel")}
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving || !draft.trim()}>
                  <Check className="size-3.5" />
                  {t("editSave")}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              {note.relatedTo && (
                <p className="text-muted-foreground text-xs">{t("relatedTo", { name: note.relatedTo })}</p>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function NotesView({ notes }: { notes: Note[] }) {
  const t = useTranslations("crm.notes");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [draft, setDraft] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function addNote() {
    if (!draft.trim()) return;
    setIsSubmitting(true);
    const result = await createNote(draft);
    setIsSubmitting(false);
    if (result.ok) {
      setDraft("");
      router.refresh();
    } else {
      toast.error(tc("genericErrorToast"));
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-3">
          <Textarea
            placeholder={t("placeholder")}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button onClick={addNote} disabled={!draft.trim() || isSubmitting}>
              <Send className="size-4" />
              {t("submit")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {notes.length === 0 ? (
        <EmptyState
          icon={NotebookText}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
        />
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
