"use client";

import Link from "next/link";
import {
  CreditCard,
  LifeBuoy,
  LogOut,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const { data: session } = useSession();

  const name = session?.user?.name ?? "Account";
  const email = session?.user?.email ?? "";
  const initials = name.charAt(0).toUpperCase();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 gap-2 px-1.5" />}>
        <Avatar className="size-6">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium">{name}</p>
            <p className="text-muted-foreground text-xs">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/settings/profile" />}>
            <User />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/settings/workspace" />}>
            <Settings />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/billing" />}>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem render={<Link href="/admin" />}>
              <Shield />
              Admin Panel
            </DropdownMenuItem>
          )}
          <DropdownMenuItem render={<Link href="/help" />}>
            <LifeBuoy />
            Help
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
