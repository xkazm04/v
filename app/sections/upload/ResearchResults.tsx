'use client';

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ExpertPanel } from './ExpertPanel';
import { ResourceAnalysisCard } from './ResourceAnalysisCard';
import ResearchResultsOverview from './ResearchResultsOverview';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { LLMResearchResponse } from '@/app/types/research';

interface ResearchResultsProps {
  result: LLMResearchResponse | null;
  isLoading: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const loadingIndicatorVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, x: 100 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    x: 100,
    transition: {
      duration: 0.3
    }
  }
};

export function ResearchResults({ result, isLoading }: ResearchResultsProps) {
  const { colors, isDark } = useLayoutTheme();
  const displayResult = result || null;
  
  return (
    <>
      <AnimatePresence>
        {displayResult && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            {/* Enhanced Overview - Now includes statement, correction, and verdict */}
            <motion.div variants={itemVariants}>
              <ResearchResultsOverview
                isLoading={isLoading}
                displayResult={displayResult}
              />
            </motion.div>

            {/* Enhanced Resource Analysis - Merged Comparison */}
            {(displayResult.resources_agreed || displayResult.resources_disagreed) && (
              <motion.div variants={itemVariants}>
                <ResourceAnalysisCard
                  // @ts-expect-error Ignore
                  supportingAnalysis={displayResult.resources_agreed}
                  // @ts-expect-error Ignore 
                  contradictingAnalysis={displayResult.resources_disagreed}
                  isLoading={isLoading}
                />
              </motion.div>
            )}

            {/* Enhanced Expert Panel - Fixed to pass both legacy and new expert data */}
            <motion.div 
              variants={itemVariants}
              className={isLoading ? 'opacity-80' : ''}
            >
              <ExpertPanel 
                expert_perspectives={displayResult.expert_perspectives}
                isLoading={isLoading} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Loading Indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            variants={loadingIndicatorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
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
                <motion.div 
                  className="rounded-full h-5 w-5 border-2 border-white border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-blue-300 border-t-transparent"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <div>
                <motion.div 
                  className="font-bold"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  AI Analysis in Progress
                </motion.div>
                <div className="text-xs text-blue-100">Consulting expert panel...</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}