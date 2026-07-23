export interface AnalyticsMetric {
  labelKey: "openRate" | "replyRate" | "conversionRate" | "revenue";
  value: string;
  delta: number;
  trend: "up" | "down";
}

export const mockAnalyticsMetrics: AnalyticsMetric[] = [
  { labelKey: "openRate", value: "58.2%", delta: 4.1, trend: "up" },
  { labelKey: "replyRate", value: "12.6%", delta: 1.8, trend: "up" },
  { labelKey: "conversionRate", value: "6.4%", delta: -0.6, trend: "down" },
  { labelKey: "revenue", value: "$42,180", delta: 9.2, trend: "up" },
];

export const mockEmailPerformance = [
  { month: "Feb", sent: 820, opened: 410, replied: 62 },
  { month: "Mar", sent: 940, opened: 505, replied: 88 },
  { month: "Apr", sent: 1120, opened: 610, replied: 104 },
  { month: "May", sent: 1305, opened: 742, replied: 139 },
  { month: "Jun", sent: 1480, opened: 861, replied: 168 },
  { month: "Jul", sent: 1610, opened: 937, replied: 203 },
];

export const mockRevenueByPlan = [
  { planKey: "free", revenue: 0 },
  { planKey: "starter", revenue: 6370 },
  { planKey: "pro", revenue: 24170 },
  { planKey: "enterprise", revenue: 11640 },
];

export const mockLeadsBySource = [
  { sourceKey: "googleMaps", value: 342 },
  { sourceKey: "linkedIn", value: 218 },
  { sourceKey: "referral", value: 96 },
  { sourceKey: "website", value: 154 },
  { sourceKey: "manualImport", value: 61 },
];

export const mockConversionFunnel = [
  { stageKey: "leadsFound", count: 1240 },
  { stageKey: "contacted", count: 812 },
  { stageKey: "qualified", count: 430 },
  { stageKey: "proposalSent", count: 218 },
  { stageKey: "won", count: 96 },
];
