"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { NotebookText, Send } from "lucide-react";

import { mockNotes } from "@/lib/mock/crm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/empty-state";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function NotesView() {
  const [notes, setNotes] = React.useState(mockNotes);
  const [draft, setDraft] = React.useState("");

  function addNote() {
    if (!draft.trim()) return;
    setNotes((prev) => [
      {
        id: `note_${Date.now()}`,
        content: draft.trim(),
        authorName: "Dmitry",
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setDraft("");
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Write a note..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button onClick={addNote} disabled={!draft.trim()}>
              <Send className="size-4" />
              Add Note
            </Button>
          </div>
        </CardContent>
      </Card>

      {notes.length === 0 ? (
        <EmptyState
          icon={NotebookText}
          title="No notes yet"
          description="Notes about your leads, contacts, and deals will show up here."
        />
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardContent className="flex items-start gap-3">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">{initials(note.authorName)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{note.authorName}</p>
                    <p className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <p className="text-sm">{note.content}</p>
                  {note.relatedTo && (
                    <p className="text-muted-foreground text-xs">Re: {note.relatedTo}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
