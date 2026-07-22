export interface AnalyticsMetric {
  label: string;
  value: string;
  delta: number;
  trend: "up" | "down";
}

export const mockAnalyticsMetrics: AnalyticsMetric[] = [
  { label: "Open Rate", value: "58.2%", delta: 4.1, trend: "up" },
  { label: "Reply Rate", value: "12.6%", delta: 1.8, trend: "up" },
  { label: "Conversion Rate", value: "6.4%", delta: -0.6, trend: "down" },
  { label: "Revenue", value: "$42,180", delta: 9.2, trend: "up" },
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
  { plan: "Free", revenue: 0 },
  { plan: "Starter", revenue: 6370 },
  { plan: "Pro", revenue: 24170 },
  { plan: "Enterprise", revenue: 11640 },
];

export const mockLeadsBySource = [
  { source: "Google Maps", value: 342 },
  { source: "LinkedIn", value: 218 },
  { source: "Referral", value: 96 },
  { source: "Website", value: 154 },
  { source: "Manual Import", value: 61 },
];

export const mockConversionFunnel = [
  { stage: "Leads Found", count: 1240 },
  { stage: "Contacted", count: 812 },
  { stage: "Qualified", count: 430 },
  { stage: "Proposal Sent", count: 218 },
  { stage: "Won", count: 96 },
];
