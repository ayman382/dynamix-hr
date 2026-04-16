export type Locale = 'en' | 'ar';
export type ThemeMode = 'dark' | 'light' | 'system';
export type DisplayMode = 'Home' | 'Transfer';

export interface CompanyDetails {
  company_name: string;
  company_name_ar: string;
  logo: string;
  company_address: string;
  company_address_ar: string;
  contact_number: string;
  email: string;
  timezone: string;
}

export interface CountryOption {
  en: string;
  ar: string;
  slug: string;
  count_home: number;
  count_transfer: number;
  logo_or_flag: string;
}

export interface CategoryOption {
  value: string;
  en: string;
  ar: string;
}

export interface Testimonial {
  name: string;
  name_ar: string;
  text: string;
  text_ar: string;
  rating: number;
  location: string;
}

export interface SiteCounters {
  available_candidates: number;
  assigned_workers: number;
  years_experience: number;
}

export interface PublicBootstrapPayload {
  company: CompanyDetails;
  countries: CountryOption[];
  categories: CategoryOption[];
  whatsapp_number: string;
  reservation_durations: string[];
  settings: { default_country: string; default_agent: string };
  testimonials: Testimonial[];
  counters: SiteCounters;
}

export interface Candidate {
  id: number;
  name: string;
  image: string;
  cv_file: string;
  religion: string;
  age: number | null;
  experience: string | null;
  work: string;
  country: string;
  passport: string | null;
  agent: string | null;
  reserved: 0 | 1;
  reserved_by: string | null;
  reserved_for: string | null;
  reservation_duration: string | null;
  reservation_expiry: string | null;
  reservation_date: string | null;
  prioritized: 0 | 1;
  display_mode: DisplayMode;
  updated_at: string;
}

export interface CandidateFilters {
  display_mode: DisplayMode;
  country?: string;
  work?: string;
  religion?: string;
  experience?: string;
  search?: string;
  reserved?: '0' | '1';
  prioritized?: '0' | '1';
  page?: number;
  page_size?: number;
}

export interface CandidatesResponse {
  data: Candidate[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
