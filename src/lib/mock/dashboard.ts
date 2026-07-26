import type { LucideIcon } from "lucide-react";
import { Mail, Target, TrendingUp, Users } from "lucide-react";

export interface DashboardStat {
  labelKey: "totalLeads" | "activeCampaigns" | "replyRate" | "revenueMtd";
  value: string;
  numericValue: number;
  delta: number;
  trend: "up" | "down";
  icon: LucideIcon;
}

export const mockDashboardStats: DashboardStat[] = [
  { labelKey: "totalLeads", value: "3,428", numericValue: 3428, delta: 12.4, trend: "up", icon: Users },
  { labelKey: "activeCampaigns", value: "6", numericValue: 6, delta: 2, trend: "up", icon: Mail },
  { labelKey: "replyRate", value: "12.6%", numericValue: 12.6, delta: 1.8, trend: "up", icon: Target },
  { labelKey: "revenueMtd", value: "$18,240", numericValue: 18240, delta: -3.2, trend: "down", icon: TrendingUp },
];
