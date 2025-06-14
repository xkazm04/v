export type StatusType = "TRUE" | "FALSE" | "PARTIALLY_TRUE" | "MISLEADING" | "UNVERIFIABLE";

export interface Reference {
  url: string;
  title: string;
  category: 'mainstream' | 'governance' | 'academic' | 'medical' | 'other';
  country: string;
  credibility: 'high' | 'medium' | 'low';
}

export interface ResourceAnalysis {
  total: string;
  count: number;
  mainstream: number;
  governance: number;
  academic: number;
  medical: number;
  other: number;
  major_countries: string[];
  references: Reference[];
}

export interface ExpertOpinion {
  critic?: string | null;
  devil?: string | null;
  nerd?: string | null;
  psychic?: string | null;
}

export interface ExpertPerspective {
  expert_type: string;
  opinion: string;
  confidence: number;
}

export interface ResearchMetadata {
  research_sources: string[];
  processing_time_seconds: number;
  confidence_factors: string[];
}

// Main synchronized response interface used by both quote and Twitter research
export interface LLMResearchResponse {
  // Core LLM response fields
  valid_sources: string;
  verdict: string;
  status: StatusType;
  correction?: string | null;
  country?: string | null;
  category?: "POLITICS" | "ECONOMY" | "ENVIRONMENT" | "MILITARY" | "HEALTHCARE" | "EDUCATION" | "TECHNOLOGY" | "SOCIAL" | "INTERNATIONAL" | "OTHER" | null;
  resources_agreed?: ResourceAnalysis | null;
  resources_disagreed?: ResourceAnalysis | null;
  experts?: ExpertOpinion | null;
  research_method?: string;
  profile_id?: string | null;
  
  // Enhanced tri-factor fields
  expert_perspectives?: ExpertPerspective[];
  key_findings?: string[];
  research_summary?: string;
  confidence_score?: number;
  research_metadata?: ResearchMetadata;
  llm_findings?: string[];
  web_findings?: string[];
  resource_findings?: string[];
  
  // Request metadata
  request_statement: string;
  request_source: string;
  request_context: string;
  request_datetime: string;
  request_country?: string | null;
  request_category?: string | null;
  processed_at: string;
  
  // Database and processing metadata
  database_id?: string | null;
  is_duplicate?: boolean;
  
  // Error handling metadata
  research_errors?: string[];
  fallback_reason?: string | null;
}

// Twitter-specific request interface
export interface TwitterAnalysisRequest {
  tweet_url: string;
  additional_context?: string;
  country?: string;
}

// Twitter extraction response (for /extract endpoint)
export interface TwitterExtractionResponse {
  username: string;
  content: string;
  posted_at: string;
  tweet_id: string;
  tweet_url: string;
  user_display_name?: string;
  user_verified: boolean;
  retweet_count?: number;
  like_count?: number;
  reply_count?: number;
  extraction_method: string;
}

// Quote research request interface
export interface ResearchRequest {
  statement: string;
  source?: string;
  context?: string;
  datetime?: string;
  statement_date?: string;
  country?: string;
  category?: string;
}

// Predefined tweet interface
export interface PredefinedTweet {
  id: string;
  url: string;
  preview: {
    username: string;
    display_name: string;
    content: string;
    verified: boolean;
    engagement: {
      likes: number;
      retweets: number;
      replies: number;
    };
  };
  category: string;
  description: string;
}