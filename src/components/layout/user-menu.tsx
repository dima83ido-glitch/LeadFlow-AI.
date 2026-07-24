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
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export function UserMenu({ avatarUrl }: { avatarUrl?: string | null }) {
  const { data: session } = useSession();
  const t = useTranslations();
  const tc = useTranslations("common");

  const name = session?.user?.name ?? tc("account");
  const email = session?.user?.email ?? "";
  const initials = name.charAt(0).toUpperCase();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 gap-2 px-1.5" />}>
        <Avatar className="size-6">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium">{name}</p>
              <p className="text-muted-foreground text-xs">{email}</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/settings/profile" />}>
            <User />
            {t("nav.settings.profile")}
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/settings/workspace" />}>
            <Settings />
            {t("nav.items.settings")}
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/billing" />}>
            <CreditCard />
            {t("nav.items.billing")}
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem render={<Link href="/admin" />}>
              <Shield />
              {t("nav.breadcrumbs.admin")}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem render={<Link href="/help" />}>
            <LifeBuoy />
            {t("nav.items.help")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut />
          {tc("actions.logOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
