export type ExpertOpinion = {
  critic?: string;
  devil?: string;
  nerd?: string;
  psychic?: string;
};

export type ResourceReference = {
  url: string;
  title: string;
  category: 'mainstream' | 'governance' | 'academic' | 'medical' | 'other';
  country: string;
  credibility: 'high' | 'medium' | 'low';
};

export type ResourceAnalysis = {
  total: string; // e.g., "85%"
  count: number;
  mainstream: number;
  governance: number;
  academic: number;
  medical: number;
  other: number;
  major_countries: string[];
  references: ResourceReference[];
};

export type ResearchResult = {
  id: string;
  statement: string;
  source: string;
  context: string;
  request_datetime: string;
  statement_date?: string;
  valid_sources: string;
  verdict: string;
  status: 'TRUE' | 'FALSE' | 'MISLEADING' | 'PARTIALLY_TRUE' | 'UNVERIFIABLE';
  correction?: string;
  experts: ExpertOpinion;
  resources_agreed?: ResourceAnalysis;
  resources_disagreed?: ResourceAnalysis;
  processed_at: string;
  created_at: string;
  updated_at: string;
  resources?: string[]; // Legacy URLs from view
  category?: string; // Added for better category filtering
};

export type NewsArticle = {
  id: string;
  headline: string;
  source: {
    name: string;
    logoUrl?: string;
  };
  category: string;
  datePublished: string;
  truthScore: number; // 0 to 1
  isBreaking: boolean;
  publishedAt: string;
  factCheck: {
    evaluation: 'TRUE' | 'FALSE' | 'MISLEADING' | 'PARTIALLY_TRUE' | 'UNVERIFIABLE';
    confidence: number; // Percentage as a number (0-100)
    verdict: string;
    experts?: ExpertOpinion;
    resources_agreed?: ResourceAnalysis;
    resources_disagreed?: ResourceAnalysis;
  };
  citation: string;
  summary: string;
  statementDate?: string;
  researchId?: string; // Link to research_results table
};

// Enhanced utility function with better error handling
export function convertResearchToNews(research: ResearchResult): NewsArticle {
  const statusToScore = {
    'TRUE': 0.9,
    'PARTIALLY_TRUE': 0.7,
    'MISLEADING': 0.4,
    'FALSE': 0.1,
    'UNVERIFIABLE': 0.5
  };

  const statusToConfidence = {
    'TRUE': 95,
    'PARTIALLY_TRUE': 75,
    'MISLEADING': 65,
    'FALSE': 90,
    'UNVERIFIABLE': 30
  };

  // Safe property access with fallbacks
  const safeStatement = research.statement || 'Untitled Research';
  const safeSource = research.source || 'Unknown Source';
  const safeStatus = research.status || 'UNVERIFIABLE';
  const safeVerdict = research.verdict || 'No verdict available';

  return {
    id: research.id,
    headline: safeStatement.length > 100 
      ? safeStatement.substring(0, 97) + '...'
      : safeStatement,
    source: {
      name: safeSource,
      logoUrl: undefined
    },
    category: research.category || 'general', // Use category from research
    datePublished: research.statement_date || research.processed_at || new Date().toISOString(),
    truthScore: statusToScore[safeStatus as keyof typeof statusToScore] || 0.5,
    isBreaking: safeStatus === 'FALSE' || safeStatus === 'MISLEADING',
    publishedAt: research.processed_at || new Date().toISOString(),
    factCheck: {
      evaluation: safeStatus as NewsArticle['factCheck']['evaluation'],
      confidence: statusToConfidence[safeStatus as keyof typeof statusToConfidence] || 30,
      verdict: safeVerdict,
      experts: research.experts,
      resources_agreed: research.resources_agreed,
      resources_disagreed: research.resources_disagreed
    },
    citation: safeSource,
    summary: safeVerdict,
    statementDate: research.statement_date,
    researchId: research.id
  };
}