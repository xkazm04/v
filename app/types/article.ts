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

// Utility function to convert ResearchResult to NewsArticle
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

  return {
    id: research.id,
    headline: research.statement.length > 100 
      ? research.statement.substring(0, 97) + '...'
      : research.statement,
    source: {
      name: research.source || 'Unknown Source',
      logoUrl: undefined
    },
    category: 'Fact Check',
    datePublished: research.statement_date || research.processed_at,
    truthScore: statusToScore[research.status],
    isBreaking: research.status === 'FALSE' || research.status === 'MISLEADING',
    publishedAt: research.processed_at,
    factCheck: {
      evaluation: research.status,
      confidence: statusToConfidence[research.status],
      verdict: research.verdict,
      experts: research.experts,
      resources_agreed: research.resources_agreed,
      resources_disagreed: research.resources_disagreed
    },
    citation: research.source || '',
    summary: research.verdict,
    statementDate: research.statement_date,
    researchId: research.id
  };
}