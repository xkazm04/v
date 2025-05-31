export interface ResearchRequest {
  statement: string;
  source: string;
  context: string;
  datetime: string;
  statement_date?: string; // New field - ISO date string (YYYY-MM-DD)
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
  resources: string[];
  experts: ExpertOpinion;
  processed_at: string;
  database_id?: string;
  is_duplicate?: boolean; // New field to indicate duplicates
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