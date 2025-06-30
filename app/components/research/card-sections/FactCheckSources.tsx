"use client";

import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { sectionVariants } from '../../animations/variants/feedVariants';
import { NormalizedFactCheck } from '../FactCheckOverlay';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface FactCheckSourcesProps {
  factCheck: NormalizedFactCheck;
}

function safeParsePercentage(str: string | undefined): number {
  if (!str) return 0;
  const num = parseFloat(str.replace('%', ''));
  return isNaN(num) ? 0 : num;
}

export function FactCheckSources({ factCheck }: FactCheckSourcesProps) {
  const { colors, isDark } = useLayoutTheme();
  const agreed = factCheck.sources?.agreed;
  const disagreed = factCheck.sources?.disagreed;

  const supportingCount = agreed?.count || 0;
  const contradictingCount = disagreed?.count || 0;
  const totalCount = supportingCount + contradictingCount;

  const supportingPercentage = safeParsePercentage(agreed?.percentage);
  const contradictingPercentage = safeParsePercentage(disagreed?.percentage);

  if (!agreed && !disagreed) {
    return (
      <motion.div variants={sectionVariants} className="h-full flex flex-col items-center justify-center">
        <AlertTriangle className="w-8 h-8 mb-2 opacity-50" style={{ color: colors.mutedForeground }} />
        <p className="text-sm" style={{ color: colors.mutedForeground }}>
          No source analysis available
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div variants={sectionVariants} className="h-full flex flex-col">
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold" style={{ color: colors.foreground }}>
            Source Analysis
          </h4>
          <div className="text-xs" style={{ color: colors.mutedForeground }}>
            {totalCount} total sources
          </div>
        </div>
        {totalCount > 0 && (
          <div className="relative h-2 rounded-full overflow-hidden"
            style={{ background: isDark ? '#334155' : '#e5e7eb' }}>
            <motion.div
              className="absolute left-0 top-0 h-full"
              style={{ background: isDark ? '#22c55e' : '#16a34a' }}
              initial={{ width: 0 }}
              animate={{ width: `${supportingPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.div
              className="absolute right-0 top-0 h-full"
              style={{ background: isDark ? '#ef4444' : '#dc2626' }}
              initial={{ width: 0 }}
              animate={{ width: `${contradictingPercentage}%` }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </div>
        )}
        <div className="flex justify-between mt-2 text-xs">
          <span style={{ color: isDark ? '#22c55e' : '#16a34a' }}>
            {supportingCount} supporting ({supportingPercentage.toFixed(1)}%)
          </span>
          <span style={{ color: isDark ? '#ef4444' : '#dc2626' }}>
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
          background: isDark ? 'rgba(30,41,59,0.4)' : '#f8fafc',
          borderColor: colors.border
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: colors.foreground }}>
            Source Consensus
          </span>
          <div className="flex items-center gap-2">
            {supportingPercentage > contradictingPercentage ? (
              <>
                <TrendingUp className="w-3 h-3" style={{ color: isDark ? '#22c55e' : '#16a34a' }} />
                <span className="text-xs font-medium" style={{ color: isDark ? '#22c55e' : '#16a34a' }}>
                  Mostly Supporting
                </span>
              </>
            ) : contradictingPercentage > supportingPercentage ? (
              <>
                <TrendingDown className="w-3 h-3" style={{ color: isDark ? '#ef4444' : '#dc2626' }} />
                <span className="text-xs font-medium" style={{ color: isDark ? '#ef4444' : '#dc2626' }}>
                  Mostly Opposing
                </span>
              </>
            ) : (
              <span className="text-xs font-medium" style={{ color: colors.mutedForeground }}>
                Balanced
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}