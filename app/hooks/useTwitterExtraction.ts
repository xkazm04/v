'use client';

import { useState } from 'react';
import { xService, TwitterExtractionRequest, TwitterExtractionResponse } from '@/app/lib/services/x-service';

interface UseTwitterExtractionReturn {
  extractTweet: (request: TwitterExtractionRequest) => Promise<TwitterExtractionResponse>;
  isExtracting: boolean;
  extractionError: string | null;
  extractionData: TwitterExtractionResponse | null;
  resetExtraction: () => void;
}

export function useTwitterExtraction(): UseTwitterExtractionReturn {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [extractionData, setExtractionData] = useState<TwitterExtractionResponse | null>(null);

  const extractTweet = async (request: TwitterExtractionRequest): Promise<TwitterExtractionResponse> => {
    try {
      setIsExtracting(true);
      setExtractionError(null);
      setExtractionData(null);

      const result = await xService.extractTweet(request);
      setExtractionData(result);
      return result;
      
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to extract tweet';
      setExtractionError(errorMessage);
      throw error;
    } finally {
      setIsExtracting(false);
    }
  };

  const resetExtraction = () => {
    setExtractionError(null);
    setExtractionData(null);
    setIsExtracting(false);
  };

  return {
    extractTweet,
    isExtracting,
    extractionError,
    extractionData,
    resetExtraction
  };
}