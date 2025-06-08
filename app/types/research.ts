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
    references: Reference[];
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
    references: Reference[];
  } | null;
  experts?: {
    critic?: string | null;
    devil?: string | null;
    nerd?: string | null;
    psychic?: string | null;
  } | null;
  research_method?: string;
  profile_id?: string | null;
  expert_perspectives?: any;
  key_findings?: any;
  research_summary?: string | null;
  confidence_score?: number | null;
  request_statement: string;
  request_source: string;
  request_context: string
  request_datetime: string;
}

type Reference = {
  url: string;
  title: string;
  category: 'mainstream' | 'governance' | 'academic' | 'medical' | 'other';
  country: string;
  credibility: 'high' | 'medium' | 'low';
};