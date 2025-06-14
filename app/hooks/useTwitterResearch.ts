
'use client';

import { useState } from 'react';
import { TwitterAnalysisRequest, LLMResearchResponse } from '@/app/types/research';
import { researchService } from '../lib/services/x-service';

interface UseTwitterResearchReturn {
  researchTweet: (request: TwitterAnalysisRequest) => Promise<LLMResearchResponse>;
  isResearching: boolean;
  researchError: string | null;
  researchData: LLMResearchResponse | null;
  resetResearch: () => void;
}

export function useTwitterResearch(): UseTwitterResearchReturn {
  const [isResearching, setIsResearching] = useState(false);
  const [researchError, setResearchError] = useState<string | null>(null);
  const [researchData, setResearchData] = useState<LLMResearchResponse | null>(null);

  const researchTweet = async (request: TwitterAnalysisRequest): Promise<LLMResearchResponse> => {
    try {
      setIsResearching(true);
      setResearchError(null);
      setResearchData(null);

      const result = await researchService.researchTweet(request);
      setResearchData(result);
      return result;
      
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to research tweet';
      setResearchError(errorMessage);
      throw error;
    } finally {
      setIsResearching(false);
    }
  };

  const resetResearch = () => {
    setResearchError(null);
    setResearchData(null);
    setIsResearching(false);
  };

  return {
    researchTweet,
    isResearching,
    researchError,
    researchData,
    resetResearch
  };
}