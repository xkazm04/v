'use client';

import { useState } from 'react';
import { xService, TwitterExtractionRequest, TwitterResearchResponse } from '@/app/lib/services/x-service';

interface UseTwitterResearchReturn {
  researchTweet: (request: TwitterExtractionRequest) => Promise<TwitterResearchResponse>;
  isResearching: boolean;
  researchError: string | null;
  researchData: TwitterResearchResponse | null;
  resetResearch: () => void;
}

export function useTwitterResearch(): UseTwitterResearchReturn {
  const [isResearching, setIsResearching] = useState(false);
  const [researchError, setResearchError] = useState<string | null>(null);
  const [researchData, setResearchData] = useState<TwitterResearchResponse | null>(null);

  const researchTweet = async (request: TwitterExtractionRequest): Promise<TwitterResearchResponse> => {
    try {
      setIsResearching(true);
      setResearchError(null);
      setResearchData(null);

      const result = await xService.researchTweet(request);
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