export interface Company {
  id: string;
  name: string;
  domain?: string;
  industry: string;
  size?: string;
  country: string;
  city: string;
  address?: string;
  logoUrl?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  dealCount: number;
  contactCount: number;
  createdAt: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  companyId?: string;
  companyName?: string;
  avatarUrl?: string;
  createdAt: string;
}
