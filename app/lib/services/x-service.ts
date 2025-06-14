export interface TwitterExtractionRequest {
  tweet_url: string;
  additional_context?: string;
  country?: string;
}

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

export interface TwitterResearchResponse {
  tweet_data: TwitterExtractionResponse;
  research_result: any;
  processing_time_seconds: number;
  research_method: string;
}

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class XService {
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

  async extractTweet(request: TwitterExtractionRequest): Promise<TwitterExtractionResponse> {
    try {
      return await this.request<TwitterExtractionResponse>('/x/extract', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch (error: any) {
      console.error('Failed to extract tweet:', error);
      throw new Error(
        error.message || 'Failed to extract tweet content'
      );
    }
  }

  async researchTweet(request: TwitterExtractionRequest): Promise<TwitterResearchResponse> {
    try {
      return await this.request<TwitterResearchResponse>('/x/research', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch (error: any) {
      console.error('Failed to research tweet:', error);
      throw new Error(
        error.message || 'Failed to research tweet'
      );
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

export const xService = new XService();