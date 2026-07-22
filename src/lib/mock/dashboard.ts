import type { LucideIcon } from "lucide-react";
import { Mail, Target, TrendingUp, Users } from "lucide-react";

export interface DashboardStat {
  label: string;
  value: string;
  delta: number;
  trend: "up" | "down";
  icon: LucideIcon;
}

export const mockDashboardStats: DashboardStat[] = [
  { label: "Total Leads", value: "3,428", delta: 12.4, trend: "up", icon: Users },
  { label: "Active Campaigns", value: "6", delta: 2, trend: "up", icon: Mail },
  { label: "Reply Rate", value: "12.6%", delta: 1.8, trend: "up", icon: Target },
  { label: "Revenue (MTD)", value: "$18,240", delta: -3.2, trend: "down", icon: TrendingUp },
];
