export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  messageParams: Record<string, string | number>;
  read: boolean;
  createdAt: string;
  href?: string;
}

export interface ActivityItem {
  id: string;
  actorName: string;
  actorAvatarUrl?: string;
  action: string;
  target: string;
  createdAt: string;
}
