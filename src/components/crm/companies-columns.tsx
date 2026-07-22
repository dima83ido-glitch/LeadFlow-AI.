"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { Company } from "@/types/company";
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

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export const companiesColumns: ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: "Company",
    cell: ({ row }) => {
      const company = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">{initials(company.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{company.name}</p>
            <p className="text-muted-foreground text-xs">{company.industry}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => <span className="text-sm">{row.original.size ?? "—"}</span>,
  },
  {
    id: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.city}, {row.original.country}
      </span>
    ),
  },
  {
    accessorKey: "dealCount",
    header: "Deals",
    cell: ({ row }) => <span className="text-sm">{row.original.dealCount}</span>,
  },
  {
    accessorKey: "contactCount",
    header: "Contacts",
    cell: ({ row }) => <span className="text-sm">{row.original.contactCount}</span>,
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
      const company = row.original;
      return (
        <div
          className="flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
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
            title="Delete this company?"
            description={`This will permanently remove ${company.name} and its associated records from your CRM.`}
            confirmLabel="Delete company"
            onConfirm={() => toast.success(`${company.name} was deleted.`)}
          />
        </div>
      );
    },
  },
];
