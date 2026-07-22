import type { AdminSubscription, AdminUser, PromoCode, SystemLog } from "@/types/admin";

export const mockAdminUsers: AdminUser[] = [
  { id: "u_1", name: "Dmitry Ivanov", email: "dima83ido@gmail.com", role: "ADMIN", plan: "Pro", status: "ACTIVE", createdAt: "2026-01-12T00:00:00Z", lastActiveAt: "2026-07-19T09:00:00Z" },
  { id: "u_2", name: "Priya Shah", email: "priya.shah@leadflow.ai", role: "USER", plan: "Pro", status: "ACTIVE", createdAt: "2026-02-03T00:00:00Z", lastActiveAt: "2026-07-18T17:30:00Z" },
  { id: "u_3", name: "Marco Silva", email: "marco@brightpath.io", role: "USER", plan: "Starter", status: "ACTIVE", createdAt: "2026-03-20T00:00:00Z", lastActiveAt: "2026-07-10T12:00:00Z" },
  { id: "u_4", name: "Nina Petrova", email: "nina@outreachly.com", role: "USER", plan: "Free", status: "INVITED", createdAt: "2026-07-15T00:00:00Z" },
  { id: "u_5", name: "Tom Becker", email: "tom.becker@vantagegrowth.com", role: "USER", plan: "Enterprise", status: "SUSPENDED", createdAt: "2026-01-28T00:00:00Z", lastActiveAt: "2026-05-01T09:00:00Z" },
];

export const mockAdminSubscriptions: AdminSubscription[] = [
  { id: "sub_1", workspaceName: "LeadFlow Internal", plan: "Pro", status: "ACTIVE", mrr: 149, renewsAt: "2026-08-19T00:00:00Z" },
  { id: "sub_2", workspaceName: "Brightpath Media", plan: "Starter", status: "ACTIVE", mrr: 49, renewsAt: "2026-08-02T00:00:00Z" },
  { id: "sub_3", workspaceName: "Vantage Growth", plan: "Enterprise", status: "PAST_DUE", mrr: 499, renewsAt: "2026-07-22T00:00:00Z" },
  { id: "sub_4", workspaceName: "Outreachly", plan: "Free", status: "TRIALING", mrr: 0, renewsAt: "2026-07-29T00:00:00Z" },
];

export const mockPromoCodes: PromoCode[] = [
  { id: "promo_1", code: "LAUNCH25", discountPercent: 25, redemptions: 84, maxRedemptions: 200, expiresAt: "2026-09-01T00:00:00Z", active: true },
  { id: "promo_2", code: "WELCOME10", discountPercent: 10, redemptions: 312, active: true },
  { id: "promo_3", code: "SUMMER2026", discountPercent: 20, redemptions: 150, maxRedemptions: 150, expiresAt: "2026-07-01T00:00:00Z", active: false },
];

export const mockSystemLogs: SystemLog[] = [
  { id: "log_1", level: "INFO", message: "Scheduled campaign dispatch completed", source: "campaign-worker", createdAt: "2026-07-19T09:05:00Z" },
  { id: "log_2", level: "WARN", message: "Stripe webhook retried after timeout", source: "billing-service", createdAt: "2026-07-19T08:40:00Z" },
  { id: "log_3", level: "ERROR", message: "Failed to charge card for workspace sub_3", source: "billing-service", createdAt: "2026-07-19T02:00:00Z" },
  { id: "log_4", level: "INFO", message: "Nightly lead enrichment job finished (1,204 records)", source: "enrichment-worker", createdAt: "2026-07-19T01:00:00Z" },
  { id: "log_5", level: "INFO", message: "Database backup completed successfully", source: "infra", createdAt: "2026-07-18T23:00:00Z" },
];

export const mockUserGrowth = [
  { month: "Feb", users: 412, mrr: 8200 },
  { month: "Mar", users: 498, mrr: 9840 },
  { month: "Apr", users: 561, mrr: 11480 },
  { month: "May", users: 640, mrr: 13760 },
  { month: "Jun", users: 712, mrr: 16150 },
  { month: "Jul", users: 803, mrr: 18420 },
];

export const mockPlanDistribution = [
  { plan: "Free", count: 340 },
  { plan: "Starter", count: 215 },
  { plan: "Pro", count: 198 },
  { plan: "Enterprise", count: 50 },
];
