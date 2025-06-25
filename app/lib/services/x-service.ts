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

  // ✅ UPDATED: Predefined tweets with clean, consistent structure
  getPredefinedTweets(): PredefinedTweet[] {
    return [
      {
        id: 'climate-warming-2025',
        tweet_url: 'https://x.com/ClimateReality/status/1700000000000000000',
        category: 'Climate Science',
        description: 'Scientific claim about global temperature rise and climate records',
        preview: {
          username: 'ClimateReality',
          display_name: 'Climate Reality Project',
          content: 'Global temperatures have risen by 1.1°C since pre-industrial times, making this the warmest decade on record according to NASA and NOAA data.',
          verified: true,
          engagement: {
            likes: 2847,
            retweets: 891,
            replies: 234
          }
        }
      },
      {
        id: 'health-exercise-benefits',
        tweet_url: 'https://x.com/WHO/status/1700000000000000001',
        category: 'Public Health',
        description: 'WHO claim about exercise benefits and disease prevention statistics',
        preview: {
          username: 'WHO',
          display_name: 'World Health Organization',
          content: 'Studies show that regular exercise can reduce the risk of heart disease by up to 35% and stroke by up to 20%. Just 150 minutes per week makes a difference! 💪 #HealthyLiving',
          verified: true,
          engagement: {
            likes: 5623,
            retweets: 1204,
            replies: 567
          }
        }
      },
      {
        id: 'tech-ai-energy-consumption',
        tweet_url: 'https://x.com/TechCrunch/status/1700000000000000002',
        category: 'Technology',
        description: 'Tech industry claim about AI energy consumption and environmental impact',
        preview: {
          username: 'TechCrunch',
          display_name: 'TechCrunch',
          content: 'AI models now consume 10x more energy than traditional computing systems, raising serious concerns about sustainability in the tech industry. 🌱⚡',
          verified: true,
          engagement: {
            likes: 1892,
            retweets: 445,
            replies: 178
          }
        }
      },
      {
        id: 'economics-inflation-rate',
        tweet_url: 'https://x.com/federalreserve/status/1700000000000000003',
        category: 'Economics',
        description: 'Federal Reserve statement about current inflation trends and economic indicators',
        preview: {
          username: 'federalreserve',
          display_name: 'Federal Reserve',
          content: 'Core inflation has dropped to 3.2% year-over-year, the lowest level since early 2021, signaling economic stabilization efforts are working. 📊',
          verified: true,
          engagement: {
            likes: 3456,
            retweets: 789,
            replies: 123
          }
        }
      },
      {
        id: 'space-mars-discovery',
        tweet_url: 'https://x.com/nasa/status/1700000000000000004',
        category: 'Space Science',
        description: 'NASA announcement about recent Mars exploration findings',
        preview: {
          username: 'nasa',
          display_name: 'NASA',
          content: 'BREAKING: Perseverance rover has discovered organic compounds in ancient Martian rock samples, potentially indicating past microbial life! 🚀🔬 #Mars2025',
          verified: true,
          engagement: {
            likes: 15234,
            retweets: 4567,
            replies: 2891
          }
        }
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
    if (!count || count === 0) return '0';
    
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    
    return count.toString();
  }

  // ✅ NEW: Get tweet by ID (for easier testing/debugging)
  getPredefinedTweetById(id: string): PredefinedTweet | undefined {
    return this.getPredefinedTweets().find(tweet => tweet.id === id);
  }

  // ✅ NEW: Get tweets by category
  getPredefinedTweetsByCategory(category: string): PredefinedTweet[] {
    return this.getPredefinedTweets().filter(tweet => 
      tweet.category.toLowerCase().includes(category.toLowerCase())
    );
  }
}

export const researchService = new ResearchService();

// Legacy exports for backward compatibility
export const xService = researchService;
export type { TwitterAnalysisRequest as TwitterExtractionRequest };
export type { LLMResearchResponse as TwitterResearchResponse };