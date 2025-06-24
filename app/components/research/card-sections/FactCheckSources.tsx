"use client";

import { motion, Variants } from 'framer-motion';
import { AlertTriangle, Globe, BookOpen, Building, Heart, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { LLMResearchResponse } from '@/app/types/research';

interface FactCheckSourcesProps {
  factCheck: LLMResearchResponse;
  config: any;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// ✅ REUSED: Category icon mapping from ResourceAnalysisCard
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'mainstream': return Globe;
    case 'academic': return BookOpen;
    case 'governance': return Building;
    case 'medical': return Heart;
    default: return ExternalLink;
  }
};

// ✅ REUSED: Credibility color mapping from ResourceAnalysisCard
const getCredibilityColor = (credibility: string, isDark: boolean) => {
  switch (credibility.toLowerCase()) {
    case 'high': return isDark ? '#22c55e' : '#16a34a';
    case 'medium': return isDark ? '#f59e0b' : '#d97706';
    case 'low': return isDark ? '#ef4444' : '#dc2626';
    default: return isDark ? '#6b7280' : '#9ca3af';
  }
};

export function FactCheckSources({ factCheck, config }: FactCheckSourcesProps) {
  const { isDark } = useLayoutTheme();
  
  // ✅ FIXED: Use correct data mapping matching ResourceAnalysisCard
  const supportingData = factCheck.resources_agreed;
  const contradictingData = factCheck.resources_disagreed;
  
  // ✅ FIXED: Use count from the data structure, not total (matching ResourceAnalysisCard)
  const supportingCount = supportingData?.count || 0;
  const contradictingCount = contradictingData?.count || 0;
  const totalCount = supportingCount + contradictingCount;
  
  // ✅ FIXED: Parse percentage from total field properly (matching ResourceAnalysisCard)
  const supportingPercentage = supportingData?.total 
    ? parseFloat(supportingData.total.replace('%', '')) 
    : 0;
  const contradictingPercentage = contradictingData?.total 
    ? parseFloat(contradictingData.total.replace('%', '')) 
    : 0;

  // ✅ ENHANCED: Debug logging matching ResourceAnalysisCard
  console.log('FactCheckSources data:', {
    supportingData,
    contradictingData,
    supportingCount,
    contradictingCount,
    totalCount,
    supportingPercentage,
    contradictingPercentage
  });

  if (!supportingData && !contradictingData) {
    return (
      <motion.div variants={sectionVariants} className="h-full flex flex-col items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-muted-foreground mb-2 opacity-50" />
        <p className="text-sm text-muted-foreground">No source analysis available</p>
      </motion.div>
    );
  }

  const themeColors = {
    supporting: {
      bg: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)',
      border: isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)',
      text: isDark ? '#4ade80' : '#16a34a',
      hover: isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)'
    },
    opposing: {
      bg: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
      border: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
      text: isDark ? '#f87171' : '#dc2626',
      hover: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)'
    },
    neutral: {
      bg: isDark ? 'rgba(71, 85, 105, 0.1)' : 'rgba(248, 250, 252, 0.8)',
      border: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.5)',
      text: isDark ? '#94a3b8' : '#64748b'
    }
  };

  return (
    <motion.div variants={sectionVariants} className="h-full flex flex-col">
      {/* ✅ ENHANCED: Header with Overall Stats matching ResourceAnalysisCard */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold" style={{ color: themeColors.neutral.text }}>
            Source Analysis
          </h4>
          <div className="text-xs text-muted-foreground">
            {totalCount} total sources
          </div>
        </div>
        
        {/* ✅ ENHANCED: Progress bar matching ResourceAnalysisCard */}
        {totalCount > 0 && (
          <div className="relative h-2 rounded-full overflow-hidden" style={{ background: themeColors.neutral.bg }}>
            <motion.div
              className="absolute left-0 top-0 h-full"
              style={{ background: themeColors.supporting.text }}
              initial={{ width: 0 }}
              animate={{ width: `${supportingPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.div
              className="absolute right-0 top-0 h-full"
              style={{ background: themeColors.opposing.text }}
              initial={{ width: 0 }}
              animate={{ width: `${contradictingPercentage}%` }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </div>
        )}
        
        <div className="flex justify-between mt-2 text-xs">
          <span style={{ color: themeColors.supporting.text }}>
            {supportingCount} supporting ({supportingPercentage.toFixed(1)}%)
          </span>
          <span style={{ color: themeColors.opposing.text }}>
            {contradictingCount} opposing ({contradictingPercentage.toFixed(1)}%)
          </span>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex-shrink-0 mt-3 p-3 rounded-lg border"
        style={{
          background: themeColors.neutral.bg,
          borderColor: themeColors.neutral.border
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: themeColors.neutral.text }}>
            Source Consensus
          </span>
          <div className="flex items-center gap-2">
            {supportingPercentage > contradictingPercentage ? (
              <>
                <TrendingUp className="w-3 h-3" style={{ color: themeColors.supporting.text }} />
                <span className="text-xs font-medium" style={{ color: themeColors.supporting.text }}>
                  Mostly Supporting
                </span>
              </>
            ) : contradictingPercentage > supportingPercentage ? (
              <>
                <TrendingDown className="w-3 h-3" style={{ color: themeColors.opposing.text }} />
                <span className="text-xs font-medium" style={{ color: themeColors.opposing.text }}>
                  Mostly Opposing
                </span>
              </>
            ) : (
              <span className="text-xs font-medium" style={{ color: themeColors.neutral.text }}>
                Balanced
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}