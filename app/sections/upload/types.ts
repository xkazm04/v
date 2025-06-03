export interface ResearchRequest {
  statement: string;
  source: string;
  context: string;
  datetime: string;
  statement_date?: string;
  country?: string; // ISO country code
  category?: StatementCategory;
}

export type StatementCategory = 
  | 'politics'
  | 'economy'
  | 'environment'
  | 'military'
  | 'healthcare'
  | 'education'
  | 'technology'
  | 'social'
  | 'international'
  | 'other';

export interface ResourceReference {
  url: string;
  title: string;
  category: 'mainstream' | 'governance' | 'academic' | 'medical' | 'other';
  country: string;
  credibility: 'high' | 'medium' | 'low';
}

export interface ResourceAnalysis {
  total: string; // e.g., "85%"
  count: number;
  mainstream: number;
  governance: number;
  academic: number;
  medical: number;
  other: number;
  major_countries: string[];
  references: ResourceReference[];
}

export interface ExpertOpinion {
  critic?: string;
  devil?: string;
  nerd?: string;
  psychic?: string;
}

export interface ResearchResponse {
  request: ResearchRequest;
  valid_sources: string;
  verdict: string;
  status: 'TRUE' | 'FALSE' | 'MISLEADING' | 'PARTIALLY_TRUE' | 'UNVERIFIABLE';
  correction?: string;
  country?: string; // ISO country code
  category?: StatementCategory;
  resources_agreed?: ResourceAnalysis;
  resources_disagreed?: ResourceAnalysis;
  resources?: string[]; // Legacy field for backwards compatibility
  experts: ExpertOpinion;
  processed_at: string;
  database_id?: string;
  is_duplicate?: boolean;
  research_method?: string;
}

export const STATUS_COLORS = {
  TRUE: 'bg-verified text-white',
  FALSE: 'bg-false text-white',
  MISLEADING: 'bg-unverified text-white',
  PARTIALLY_TRUE: 'bg-unverified text-white',
  UNVERIFIABLE: 'bg-neutral-400 text-white'
} as const;

export const EXPERT_ICONS = {
  critic: '🔍',
  devil: '😈',
  nerd: '🤓',
  psychic: '🧠'
} as const;

export const EXPERT_COLORS = {
  critic: 'border-red-400 bg-red-50',
  devil: 'border-purple-400 bg-purple-50',
  nerd: 'border-blue-400 bg-blue-50',
  psychic: 'border-green-400 bg-green-50'
} as const;