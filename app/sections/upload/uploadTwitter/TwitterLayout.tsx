'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTwitterResearch } from '@/app/hooks/useTwitterResearch';
import { TwitterAnalysisRequest, LLMResearchResponse, PredefinedTweet } from '@/app/types/research';
import TwitterForm from './TwitterForm';
import { ResearchResults } from '../ResearchResults';
import { researchService } from '@/app/lib/services/x-service';

const smoothScrollBy = (distance: number, duration: number = 800) => {
  const startY = window.scrollY;
  const targetY = startY + distance;
  
  return motion.animate(startY, targetY, {
    duration: duration / 1000,
    ease: [0.25, 0.46, 0.45, 0.94],
    onUpdate: (value) => {
      window.scrollTo(0, value);
    }
  });
};

const TwitterLayout: React.FC = () => {
  const { researchTweet, isResearching, researchError, resetResearch } = useTwitterResearch();
  const [results, setResults] = useState<LLMResearchResponse | null>(null);

  const handleSubmitResearch = async (
    mode: 'url' | 'predefined',
    formData: TwitterAnalysisRequest,
    selectedTweet?: PredefinedTweet | null
  ): Promise<void> => {
    try {
      // Reset previous results
      setResults(null);
      resetResearch();

      let request: TwitterAnalysisRequest;

      if (mode === 'predefined' && selectedTweet) {
        // Use predefined tweet data
        request = {
          tweet_url: selectedTweet.url,
          additional_context: formData.additional_context || `Predefined example: ${selectedTweet.description}`,
          country: formData.country
        };
      } else {
        // Use form data directly
        request = formData;
      }

      // Validate the request
      if (!request.tweet_url?.trim()) {
        throw new Error('Tweet URL is required');
      }

      if (!researchService.validateTwitterUrl(request.tweet_url)) {
        throw new Error('Please enter a valid Twitter/X URL');
      }

      console.log('Submitting Twitter research request:', request);
      const result = await researchTweet(request);
      
      console.log('Twitter research completed:', result);
      setResults(result);

      setTimeout(() => {
        smoothScrollBy(100, 600);
      }, 300);

    } catch (error: any) {
      console.error('Twitter research failed:', error);
      throw error;
    }
  };

  const handleReset = () => {
    setResults(null);
    resetResearch();
  };

  return (
    <div className="space-y-8">
      <TwitterForm 
        onSubmit={handleSubmitResearch}
        isLoading={isResearching}
        error={researchError}
        onReset={handleReset}
      />

      {/* Results Section - Will be implemented in next phase */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
        <ResearchResults result={results} isLoading={isResearching} />
          
        </motion.div>
      )}
    </div>
  );
};

export default TwitterLayout;