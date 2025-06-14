import { 
  LLMResearchResponse, 
  ResearchRequest, 
  TwitterAnalysisRequest, 
  TwitterExtractionResponse,
  PredefinedTweet 
} from '@/app/types/research';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ResearchService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage: string;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Quote research (existing endpoint)
  async researchQuote(request: ResearchRequest): Promise<LLMResearchResponse> {
    try {
      return await this.request<LLMResearchResponse>('/fc/research', {
        method: 'POST',
        body: JSON.stringify({
          statement: request.statement,
          source: request.source || 'Unknown',
          context: request.context || '',
          datetime: request.datetime || new Date().toISOString(),
          statement_date: request.statement_date || null,
          country: request.country || null,
          category: request.category || null
        }),
      });
    } catch (error: any) {
      console.error('Failed to research quote:', error);
      throw new Error(error.message || 'Failed to research quote');
    }
  }

  // Twitter research (now returns same format as quote research)
  async researchTweet(request: TwitterAnalysisRequest): Promise<LLMResearchResponse> {
    try {
      return await this.request<LLMResearchResponse>('/x/research', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch (error: any) {
      console.error('Failed to research tweet:', error);
      throw new Error(error.message || 'Failed to research tweet');
    }
  }

  // Twitter extraction (separate endpoint for extraction only)
  async extractTweet(request: TwitterAnalysisRequest): Promise<TwitterExtractionResponse> {
    try {
      return await this.request<TwitterExtractionResponse>('/x/extract', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch (error: any) {
      console.error('Failed to extract tweet:', error);
      throw new Error(error.message || 'Failed to extract tweet content');
    }
  }

  // Predefined tweets for demo/testing
  getPredefinedTweets(): PredefinedTweet[] {
    return [
      {
        id: 'climate-1',
        url: 'https://x.com/ClimateReality/status/1700000000000000000',
        preview: {
          username: 'ClimateReality',
          display_name: 'Climate Reality Project',
          content: 'Global temperatures have risen by 1.1°C since pre-industrial times, making this the warmest decade on record.',
          verified: true,
          engagement: {
            likes: 2847,
            retweets: 891,
            replies: 234
          }
        },
        category: 'Climate',
        description: 'Scientific claim about global temperature rise'
      },
      {
        id: 'health-1',
        url: 'https://x.com/WHO/status/1700000000000000001',
        preview: {
          username: 'WHO',
          display_name: 'World Health Organization',
          content: 'Studies show that regular exercise can reduce the risk of heart disease by up to 35% and stroke by up to 20%.',
          verified: true,
          engagement: {
            likes: 5623,
            retweets: 1204,
            replies: 567
          }
        },
        category: 'Health',
        description: 'Health statistics about exercise benefits'
      },
      {
        id: 'tech-1',
        url: 'https://x.com/TechCrunch/status/1700000000000000002',
        preview: {
          username: 'TechCrunch',
          display_name: 'TechCrunch',
          content: 'AI models now consume 10x more energy than traditional computing systems, raising concerns about sustainability.',
          verified: true,
          engagement: {
            likes: 1892,
            retweets: 445,
            replies: 178
          }
        },
        category: 'Technology',
        description: 'Claim about AI energy consumption'
      }
    ];
  }

  // Utility methods
  validateTwitterUrl(url: string): boolean {
    if (!url?.trim()) return false;
    
    const twitterUrlPatterns = [
      /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+\/status\/\d+/,
      /^https?:\/\/(www\.)?(mobile\.twitter\.com|mobile\.x\.com)\/\w+\/status\/\d+/
    ];
    
    return twitterUrlPatterns.some(pattern => pattern.test(url.trim()));
  }

  formatEngagement(count?: number): string {
    if (!count) return '0';
    
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    
    return count.toString();
  }
}

export const researchService = new ResearchService();

// Legacy exports for backward compatibility
export const xService = researchService;
export type { TwitterAnalysisRequest as TwitterExtractionRequest };
export type { LLMResearchResponse as TwitterResearchResponse };