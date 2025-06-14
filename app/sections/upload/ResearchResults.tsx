'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExpertPanel } from './ExpertPanel';
import { ResourceAnalysisCard } from './ResourceAnalysisCard';
import ResearchResultsOverview from './ResearchResultsOverview';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { LLMResearchResponse } from '@/app/types/research';

interface ResearchResultsProps {
  result: LLMResearchResponse | null;
  isLoading: boolean;
}

export function ResearchResults({ result, isLoading }: ResearchResultsProps) {
  const { colors, isDark } = useLayoutTheme();
  const displayResult = result || null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-12"
    >
      {displayResult && <>
      {/* Enhanced Overview - Now includes statement, correction, and verdict */}
      <ResearchResultsOverview
        isLoading={isLoading}
        displayResult={displayResult}
      />

      {/* Enhanced Resource Analysis - Merged Comparison */}
      {(displayResult.resources_agreed || displayResult.resources_disagreed) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <ResourceAnalysisCard
          // @ts-expect-error Ignore
            supportingAnalysis={displayResult.resources_agreed} contradictingAnalysis={displayResult.resources_disagreed}
            isLoading={isLoading}
          />
        </motion.div>
      )}

      {/* Enhanced Expert Panel */}
      <div className={isLoading ? 'opacity-80' : ''}>
         {/* @ts-expect-error Ignore */}
        <ExpertPanel experts={displayResult.experts} isLoading={isLoading} />
      </div>
      
      {/* Enhanced Loading Indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-6 right-6 px-6 py-4 rounded-2xl shadow-2xl z-50 border text-white"
          style={{
            background: isDark 
              ? 'linear-gradient(to right, rgba(59, 130, 246, 0.9), rgba(99, 102, 241, 0.9))'
              : 'linear-gradient(to right, rgba(59, 130, 246, 0.9), rgba(99, 102, 241, 0.9))',
            border: `1px solid ${colors.primary}`
          }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <div 
                className="absolute inset-0 rounded-full border-2 border-blue-300 border-t-transparent animate-spin" 
                style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
              />
            </div>
            <div>
              <div className="font-bold">AI Analysis in Progress</div>
              <div className="text-xs text-blue-100">Consulting expert panel...</div>
            </div>
          </div>
        </motion.div>
      )}
      </>}
      </motion.div>
  );
}