import type { LucideIcon } from "lucide-react";

export interface NavItem {
  titleKey: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  titleKey?: string;
  items: NavItem[];
}
