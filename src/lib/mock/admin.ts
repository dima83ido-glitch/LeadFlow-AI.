import type { AdminUser } from "@/types/admin";

export const mockAdminUsers: AdminUser[] = [
  { id: "u_1", name: "Dmitry Ivanov", email: "dima83ido@gmail.com", role: "ADMIN", plan: "Pro", status: "ACTIVE", createdAt: "2026-01-12T00:00:00Z", lastActiveAt: "2026-07-19T09:00:00Z" },
  { id: "u_2", name: "Priya Shah", email: "priya.shah@nexora.ai", role: "USER", plan: "Pro", status: "ACTIVE", createdAt: "2026-02-03T00:00:00Z", lastActiveAt: "2026-07-18T17:30:00Z" },
  { id: "u_3", name: "Marco Silva", email: "marco@brightpath.io", role: "USER", plan: "Starter", status: "ACTIVE", createdAt: "2026-03-20T00:00:00Z", lastActiveAt: "2026-07-10T12:00:00Z" },
  { id: "u_4", name: "Nina Petrova", email: "nina@outreachly.com", role: "USER", plan: "Free", status: "INVITED", createdAt: "2026-07-15T00:00:00Z" },
  { id: "u_5", name: "Tom Becker", email: "tom.becker@vantagegrowth.com", role: "USER", plan: "Enterprise", status: "SUSPENDED", createdAt: "2026-01-28T00:00:00Z", lastActiveAt: "2026-05-01T09:00:00Z" },
];
