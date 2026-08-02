"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { adminNav, mainNav } from "@/lib/nav-config";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/shared/brand-mark";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SupportButton } from "@/components/shared/support-button";

export function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslations();
  const tc = useTranslations("common");
  const isAdmin = pathname.startsWith("/admin");
  const groups = isAdmin ? adminNav : mainNav;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          href="/dashboard"
          className="group flex items-center gap-2 px-2 py-1.5 group-data-[collapsible=icon]:justify-center"
        >
          <span className="relative flex items-center justify-center">
            <span className="absolute inset-0 scale-[2] rounded-full bg-primary/25 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
            <BrandMark className="relative size-7 transition-transform duration-300 group-hover:scale-105" />
          </span>
          <span className="text-sm font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            {tc("appName")}
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group, index) => {
          const groupTitle = group.titleKey ? t(group.titleKey) : undefined;
          const isCollapsibleGroup = Boolean(groupTitle) && group.items.length > 3;
          const hasActiveChild = group.items.some(
            (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
          );

          if (isCollapsibleGroup) {
            return (
              <Collapsible key={group.titleKey ?? index} defaultOpen={hasActiveChild} className="group/collapsible">
                <SidebarGroup>
                  <CollapsibleTrigger
                    render={
                      <SidebarGroupLabel className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex cursor-pointer items-center justify-between rounded-md" />
                    }
                  >
                    {groupTitle}
                    <ChevronRight className="size-3.5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <NavItems items={group.items} pathname={pathname} />
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            );
          }

          return (
            <SidebarGroup key={group.titleKey ?? index}>
              {groupTitle && <SidebarGroupLabel>{groupTitle}</SidebarGroupLabel>}
              <SidebarGroupContent>
                <NavItems items={group.items} pathname={pathname} />
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/help" />}
              isActive={pathname === "/help"}
              tooltip={t("nav.items.help")}
            >
              <HelpCircle />
              <span>{t("nav.items.help")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="group-data-[collapsible=icon]:hidden">
          <SupportButton variant="ghost" className="w-full justify-start" />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function NavItems({
  items,
  pathname,
}: {
  items: { titleKey: string; href: string; icon: React.ElementType }[];
  pathname: string;
}) {
  const t = useTranslations();
  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const title = t(item.titleKey);
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              render={<Link href={item.href} className={cn(isActive && "font-medium")} />}
              isActive={isActive}
              tooltip={title}
            >
              <item.icon />
              <span>{title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
