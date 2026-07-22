"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Globe, Mail, Phone, Star } from "lucide-react";

import type { Lead } from "@/types/lead";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/status-badge";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export const leadsColumns: ColumnDef<Lead>[] = [
  {
    accessorKey: "companyName",
    header: "Company",
    cell: ({ row }) => {
      const lead = row.original;
      return (
        <Link href={`/leads/${lead.id}`} className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">{initials(lead.companyName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium hover:underline">{lead.companyName}</p>
            <p className="text-muted-foreground text-xs">{lead.industry}</p>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "contactName",
    header: "Contact",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.contactName ?? "—"}</span>
    ),
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
    id: "channels",
    header: "Reachable via",
    cell: ({ row }) => {
      const lead = row.original;
      return (
        <div className="text-muted-foreground flex items-center gap-2.5">
          {lead.website && <Globe className="size-4" />}
          {lead.email && <Mail className="size-4" />}
          {lead.phone && <Phone className="size-4" />}
        </div>
      );
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <span className="flex items-center gap-1 text-sm">
        <Star className="size-3.5 fill-amber-400 text-amber-400" />
        {row.original.rating.toFixed(1)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];
