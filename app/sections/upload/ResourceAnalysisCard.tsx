'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { ResourceAnalysis } from './types';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import ResultResourceSection from './Result/ResultResourceSection';
import ResultResourceHeader from './Result/ResultResourceHeader';

interface ResourceAnalysisCardProps {
  supportingAnalysis?: ResourceAnalysis;
  contradictingAnalysis?: ResourceAnalysis;
  isLoading: boolean;
}

export function ResourceAnalysisCard({ 
  supportingAnalysis, 
  contradictingAnalysis, 
  isLoading 
}: ResourceAnalysisCardProps) {
  const { colors, isDark } = useLayoutTheme();

  // ✅ FIXED: Use count from the data structure, not total
  const supportingCount = supportingAnalysis?.count || 0;
  const contradictingCount = contradictingAnalysis?.count || 0;
  const totalSources = supportingCount + contradictingCount;
  
  // ✅ FIXED: Parse percentage from total field properly
  const supportingPercentage = supportingAnalysis?.total 
    ? parseFloat(supportingAnalysis.total.replace('%', '')) 
    : 0;
  const contradictingPercentage = contradictingAnalysis?.total 
    ? parseFloat(contradictingAnalysis.total.replace('%', '')) 
    : 0;

  // Debug logging
  console.log('ResourceAnalysisCard data:', {
    supportingAnalysis,
    contradictingAnalysis,
    supportingCount,
    contradictingCount,
    totalSources,
    supportingPercentage,
    contradictingPercentage
  });

  if (!supportingAnalysis && !contradictingAnalysis) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Main Analysis Card */}
      <div 
        className={`rounded-3xl border-2 overflow-hidden shadow-xl ${isLoading ? 'opacity-60 pointer-events-none animate-pulse' : ''}`}
        style={{
          background: colors.card.background,
          border: `2px solid ${colors.border}`,
          boxShadow: colors.card.shadow
        }}
      >
        {/* Header with Comparison Bar */}
        <ResultResourceHeader
          supportingTotal={supportingCount}
          contradictingTotal={contradictingCount}
          supportingPercentage={supportingPercentage}
          contradictingPercentage={contradictingPercentage}
          totalSources={totalSources}
        />
        
        {/* Side-by-Side Content */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <ResultResourceSection 
              analysis={supportingAnalysis} 
              type="supporting" 
              percentage={supportingPercentage}
              isLoading={isLoading}
            />
            
            {/* Divider */}
            <div 
              className="hidden lg:block w-px self-stretch"
              style={{ background: colors.border }}
            />
            <div 
              className="lg:hidden h-px w-full"
              style={{ background: colors.border }}
            />
            
            <ResultResourceSection 
              analysis={contradictingAnalysis} 
              type="contradicting" 
              percentage={contradictingPercentage}
              isLoading={isLoading}
            />
          </div>
        </div>
        
        {/* Winner Declaration */}
        {totalSources > 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="p-6 border-t"
            style={{
              background: supportingCount > contradictingCount
                ? isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)'
                : supportingCount < contradictingCount
                ? isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)'
                : isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)',
              borderColor: colors.border
            }}
          >
            <div 
              className="text-xl font-bold text-center"
              style={{
                color: supportingCount > contradictingCount
                  ? isDark ? '#4ade80' : '#16a34a'
                  : supportingCount < contradictingCount
                  ? isDark ? '#f87171' : '#dc2626'
                  : isDark ? '#fbbf24' : '#d97706'
              }}
            >
              {supportingCount > contradictingCount
                ? '✅ Sources Lean Toward Supporting the Statement'
                : supportingCount < contradictingCount
                ? '❌ Sources Lean Toward Contradicting the Statement'
                : '⚖️ Sources Are Evenly Divided'
              }
            </div>
            <p className="text-sm text-center mt-1" style={{ color: colors.mutedForeground }}>
              Based on {totalSources} sources from multiple categories and countries
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}