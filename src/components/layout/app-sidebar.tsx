"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, HelpCircle, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { adminNav, mainNav } from "@/lib/nav-config";
import { cn } from "@/lib/utils";
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

export function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslations();
  const isAdmin = pathname.startsWith("/admin");
  const groups = isAdmin ? adminNav : mainNav;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-2 py-1.5 group-data-[collapsible=icon]:justify-center"
        >
          <div className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-md">
            <Sparkles className="size-4" />
          </div>
          <span className="text-sm font-semibold group-data-[collapsible=icon]:hidden">
            LeadFlow AI
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

      <SidebarFooter>
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
