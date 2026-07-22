export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string;
}

export interface Deal {
  id: string;
  title: string;
  companyName: string;
  contactName?: string;
  value: number;
  currency: string;
  stageId: string;
  closeDate?: string;
  createdAt: string;
}

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface CrmTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assigneeName: string;
  assigneeAvatarUrl?: string;
  relatedTo?: string;
}

export interface Meeting {
  id: string;
  title: string;
  contactName?: string;
  companyName?: string;
  startTime: string;
  endTime: string;
  location: string;
  attendees: string[];
}

export interface Note {
  id: string;
  content: string;
  authorName: string;
  authorAvatarUrl?: string;
  relatedTo?: string;
  createdAt: string;
}
