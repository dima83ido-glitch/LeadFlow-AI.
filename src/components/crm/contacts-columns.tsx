"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { Contact } from "@/types/company";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

function initials(firstName: string, lastName?: string) {
  return `${firstName[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

export const contactsColumns: ColumnDef<Contact>[] = [
  {
    id: "name",
    header: "Contact",
    cell: ({ row }) => {
      const contact = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">
              {initials(contact.firstName, contact.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {contact.firstName} {contact.lastName ?? ""}
            </p>
            <p className="text-muted-foreground text-xs">{contact.jobTitle ?? "—"}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "companyName",
    header: "Company",
    cell: ({ row }) => <span className="text-sm">{row.original.companyName ?? "—"}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) =>
      row.original.email ? (
        <a href={`mailto:${row.original.email}`} className="text-sm hover:underline">
          {row.original.email}
        </a>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <span className="text-sm">{row.original.phone ?? "—"}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Added",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">{formatDate(row.original.createdAt)}</span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const contact = row.original;
      return (
        <div className="flex items-center justify-end gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8" />}>
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast.info("Editing isn't wired up yet.")}>
                <Pencil />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ConfirmDialog
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive size-8"
              >
                <Trash2 className="size-4" />
              </Button>
            }
            title="Delete this contact?"
            description={`This will permanently remove ${contact.firstName} ${contact.lastName ?? ""} from your CRM.`}
            confirmLabel="Delete contact"
            onConfirm={() => toast.success(`${contact.firstName} was deleted.`)}
          />
        </div>
      );
    },
  },
];
