export interface LLMResearchResponse {
  valid_sources: string;
  verdict: string;
  status: "TRUE" | "FALSE" | "MISLEADING" | "PARTIALLY_TRUE" | "UNVERIFIABLE";
  correction?: string | null;
  country?: string | null;
  category?: "POLITICS" | "ECONOMY" | "ENVIRONMENT" | "MILITARY" | "HEALTHCARE" | "EDUCATION" | "TECHNOLOGY" | "SOCIAL" | "INTERNATIONAL" | "OTHER" | null;
  resources_agreed?: {
    total: string;
    count: number;
    mainstream: number;
    governance: number;
    academic: number;
    medical: number;
    other: number;
    major_countries: string[];
    references: any[];
  } | null;
  resources_disagreed?: {
    total: string;
    count: number;
    mainstream: number;
    governance: number;
    academic: number;
    medical: number;
    other: number;
    major_countries: string[];
    references: any[];
  } | null;
  experts?: {
    critic?: string | null;
    devil?: string | null;
    nerd?: string | null;
    psychic?: string | null;
  } | null;
  research_method: string;
  profile_id?: string | null;
}