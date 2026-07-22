export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "UNQUALIFIED"
  | "CONVERTED";

export interface Lead {
  id: string;
  companyName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  country: string;
  city: string;
  industry: string;
  rating: number;
  status: LeadStatus;
  source?: string;
  employeeCount?: string;
  logoUrl?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadSearchFilters {
  country?: string;
  city?: string;
  industry?: string;
  keywords?: string;
  hasWebsite?: boolean;
  hasEmail?: boolean;
  hasPhone?: boolean;
  minRating?: number;
}
