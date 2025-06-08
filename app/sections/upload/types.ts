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

export const STATUS_COLORS = {
  TRUE: 'bg-verified text-white',
  FALSE: 'bg-false text-white',
  MISLEADING: 'bg-unverified text-white',
  PARTIALLY_TRUE: 'bg-unverified text-white',
  UNVERIFIABLE: 'bg-neutral-400 text-white'
} as const;
