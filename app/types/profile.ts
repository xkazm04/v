export interface Profile {
  id: string;
  name: string;
  name_normalized: string;
  avatar_url?: string;
  country?: string; // ISO 3166-1 alpha-2 country code
  party?: string;
  type?: string; // person, media, organization, etc.
  position?: string; // president, politician, CEO, etc.
  bg_url?: string; // background image URL
  score?: number; // credibility/reliability score (0-100)
  created_at: string;
  updated_at: string;
}

export interface ProfileCreate {
  name: string;
  avatar_url?: string;
  country?: string;
  party?: string;
  type?: string;
  position?: string;
  bg_url?: string;
  score?: number;
}

export interface ProfileUpdate {
  name?: string;
  avatar_url?: string;
  country?: string;
  party?: string;
  type?: string;
  position?: string;
  bg_url?: string;
  score?: number;
}

export interface ProfileStatement {
  id: string;
  statement: string;
  verdict?: string;
  status?: string;
  confidence?: number;
  created_at: string;
}

// New types for stats functionality
export type StatementStatus = "TRUE" | "FALSE" | "MISLEADING" | "PARTIALLY_TRUE" | "UNVERIFIABLE";
export type StatementCategory = "politics" | "economy" | "environment" | "military" | "healthcare" | "education" | "technology" | "social" | "international" | "other";

export interface ExpertOpinion {
  critic?: string;
  devil?: string;
  nerd?: string;
  psychic?: string;
}

export interface ExpertPerspective {
  expert_name: string;
  stance: "SUPPORTING" | "OPPOSING" | "NEUTRAL";
  reasoning: string;
  confidence_level: number; // 0-100
  summary: string;
  source_type?: "llm" | "web" | "resource";
  expertise_area?: string;
  publication_date?: string;
}

export interface StatementSummary {
  id?: string;
  verdict: string;
  status: StatementStatus;
  correction?: string;
  country?: string;
  category?: StatementCategory;
  experts?: ExpertOpinion;
  profile_id?: string;
  expert_perspectives: ExpertPerspective[];
  created_at?: string;
}

export interface CategoryStats {
  category: string;
  count: number;
}

export interface StatsData {
  total_statements: number;
  categories: CategoryStats[];
  status_breakdown: Record<StatementStatus, number>;
}

export interface ProfileStatsResponse {
  profile_id: string;
  recent_statements: StatementSummary[];
  stats: StatsData;
}