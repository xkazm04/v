import { AnalysisStatus } from "../components/research/utils/statusConfig";
import { ExpertOpinion, ResourceAnalysis } from "./research";

export type ResearchResult = {
  id: string;
  statement: string;
  source: string;
  context: string;
  request_datetime: string;
  statement_date?: string;
  country?: string; // Add country field
  valid_sources: string;
  verdict: string;
  status: AnalysisStatus; 
  correction?: string;
  experts: ExpertOpinion;
  expert_perspectives?: ExpertPerspective[] | string; 
  resources_agreed?: ResourceAnalysis;
  resources_disagreed?: ResourceAnalysis;
  profile_id?: string; 
  profileId?: string; 
  processed_at: string;
  created_at: string;
  updated_at: string;
  topic_id?: string | null;
  resources?: string[];
  category?: string; 
  __meta?: {
    source?: string;
    fetchTime?: number;
    timestamp?: string;
    warning?: string;
  };
};

export type ExpertPerspective = {
  expert_name: string;
  stance: 'SUPPORTING' | 'OPPOSING' | 'NEUTRAL';
  reasoning: string;
  confidence_level: number; // 0-100
  summary: string;
  source_type: 'llm' | 'external' | 'hybrid';
  expertise_area: string;
  publication_date?: string | null;
}

export type NewsArticle = {
  id: string;
  headline: string;
  source: {
    name: string;
    logoUrl?: string;
  };
  category: string;
  country?: string; // Add country field
  datePublished: string;
  truthScore: number; // 0 to 1
  isBreaking: boolean;
  publishedAt: string;
  factCheck: {
    evaluation: AnalysisStatus
    confidence: number; // Percentage as a number (0-100)
    verdict: string;
    experts?: ExpertOpinion;
    resources_agreed?: ResourceAnalysis;
    resources_disagreed?: ResourceAnalysis;
  };
  citation: string;
  profileId?: string; 
  summary: string;
  statementDate?: string;
  researchId?: string; // Link to research_results table
  __meta?: {
    source?: string;
    fetchTime?: number;
    timestamp?: string;
    warning?: string;
  };
};

// Enhanced utility function with better error handling
export function convertResearchToNews(research: ResearchResult): NewsArticle {
  const safeStatement = research.statement || 'Untitled Research';
  const safeSource = research.source || 'Unknown Source';
  const safeStatus = research.status || 'UNVERIFIABLE';
  const safeVerdict = research.verdict || 'No verdict available';

  return {
    id: research.id,
    headline: safeStatement,
    source: {
      name: safeSource,
      logoUrl: undefined
    },
    category: research.category || 'general',
    country: research.country,
    datePublished: research.request_datetime,
    truthScore:  0.5,
    isBreaking: false,
    publishedAt: research.processed_at || research.created_at,
    factCheck: {
      evaluation: safeStatus,
      confidence: 50,
      verdict: safeVerdict,
      experts: research.experts,
      resources_agreed: research.resources_agreed,
      resources_disagreed: research.resources_disagreed
    },
    citation: safeSource,
    profileId: research.profileId || research.profile_id,
    summary: research.context || 'No summary available',
    statementDate: research.statement_date,
    researchId: research.id,
    __meta: research.__meta
  };
}