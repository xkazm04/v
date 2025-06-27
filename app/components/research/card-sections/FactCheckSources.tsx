"use client";

import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useResearchTranslations } from '@/app/hooks/useSmartTranslations';
import { LLMResearchResponse } from '@/app/types/research';
import { sectionVariants } from '../../animations/variants/feedVariants';

interface FactCheckSourcesProps {
  factCheck: LLMResearchResponse;
}

export function FactCheckSources({ factCheck }: FactCheckSourcesProps) {
  const { isDark } = useLayoutTheme();
  const { t: tr } = useResearchTranslations();

  const supportingData = factCheck.resources_agreed;
  const contradictingData = factCheck.resources_disagreed;

  const supportingCount = supportingData?.count || 0;
  const contradictingCount = contradictingData?.count || 0;
  const totalCount = supportingCount + contradictingCount;
  
  const supportingPercentage = supportingData?.total 
    ? parseFloat(supportingData.total.replace('%', '')) 
    : 0;
  const contradictingPercentage = contradictingData?.total 
    ? parseFloat(contradictingData.total.replace('%', '')) 
    : 0;

  if (!supportingData && !contradictingData) {
    return (
      <motion.div variants={sectionVariants} className="h-full flex flex-col items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-muted-foreground mb-2 opacity-50" />
        <p className="text-sm text-muted-foreground">
          {tr('no_source_analysis', 'No source analysis available')}
        </p>
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
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold" style={{ color: themeColors.neutral.text }}>
            {tr('source_analysis', 'Source Analysis')}
          </h4>
          <div className="text-xs text-muted-foreground">
            {tr('total_sources', '{count} total sources', { count: totalCount })}
          </div>
        </div>
        
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
            {tr('supporting_sources', '{count} supporting ({percent}%)', { count: supportingCount, percent: supportingPercentage.toFixed(1) })}
          </span>
          <span style={{ color: themeColors.opposing.text }}>
            {tr('opposing_sources', '{count} opposing ({percent}%)', { count: contradictingCount, percent: contradictingPercentage.toFixed(1) })}
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
            {tr('source_consensus', 'Source Consensus')}
          </span>
          <div className="flex items-center gap-2">
            {supportingPercentage > contradictingPercentage ? (
              <>
                <TrendingUp className="w-3 h-3" style={{ color: themeColors.supporting.text }} />
                <span className="text-xs font-medium" style={{ color: themeColors.supporting.text }}>
                  {tr('mostly_supporting', 'Mostly Supporting')}
                </span>
              </>
            ) : contradictingPercentage > supportingPercentage ? (
              <>
                <TrendingDown className="w-3 h-3" style={{ color: themeColors.opposing.text }} />
                <span className="text-xs font-medium" style={{ color: themeColors.opposing.text }}>
                  {tr('mostly_opposing', 'Mostly Opposing')}
                </span>
              </>
            ) : (
              <span className="text-xs font-medium" style={{ color: themeColors.neutral.text }}>
                {tr('balanced', 'Balanced')}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}