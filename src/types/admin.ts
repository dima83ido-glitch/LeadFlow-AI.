export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "USER" | "ADMIN";
  plan: string;
  status: "ACTIVE" | "SUSPENDED" | "INVITED";
  createdAt: string;
  lastActiveAt?: string;
}

export interface AdminSubscription {
  id: string;
  workspaceName: string;
  plan: string;
  status: string;
  mrr: number;
  renewsAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  redemptions: number;
  maxRedemptions?: number;
  expiresAt?: string;
  active: boolean;
}

export type SystemLogLevel = "INFO" | "WARN" | "ERROR";

export interface SystemLog {
  id: string;
  level: SystemLogLevel;
  message: string;
  source: string;
  createdAt: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt?: string;
}
